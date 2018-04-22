import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import {
  Existence,
  Purchase,
  PurchasePrice,
  SalePrice
} from "../../model/entities";
import ProductService from '../../services/ProductService';
import sequelize from '../../model/database';

class PurchaseCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = {
      contents: [],
      totalCost: 0,
      date: new Date(),
      paymentInvestment: 0,
      paymentReinvestment: 0,
      validationErrors: {
        contents: '',
        date: '',
        paymentInvestment: ''
      },

      // This is used after purchase has been saved successfully to inform
      // to component that should redirect to purchases list
      redirectToList: false
    };
  }

  emitChange() {
    this.emit(this.CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(this.CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(this.CHANGE_EVENT, callback);
  }

  reset(redirectToList) {
    this.state = {
      contents: [],
      totalCost: 0,
      date: new Date(),
      paymentInvestment: 0,
      paymentReinvestment: 0,
      validationErrors: {
        contents: '',
        date: '',
        paymentInvestment: ''
      },

      redirectToList: redirectToList
    };

    this.emitChange();
  }

  addProduct(product, provider, quantity, cost, price) {
    this.state.contents.push({
      product,
      provider,
      quantity,
      cost,
      price
    });

    this.state.totalCost += cost * quantity;
    this.emitChange();
  }

  setDate(date) {
    this.state.date = date;
    this.emitChange();
  }

  setPaymentInvestment(amount) {
    this.state.paymentInvestment = amount;
  }

  setPaymentReinvestment(amount) {
    this.state.paymentReinvestment = amount;
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  save() {
    if (this.validate()) {

      // Save purchase on transaction
      sequelize.transaction(transaction => {
        let purchaseData = {
          reinvestment: this.state.paymentReinvestment,
          investment: this.state.paymentInvestment,
          date: this.state.date
        };

        return Purchase.create(purchaseData, { transaction: transaction })
            .then(purchase => {
              return this.saveContents(purchase, transaction);
            });
      })
      .then(() => {
        this.reset(true);
      })
      .catch(err => {
        console.error('Purchase could not be stored: ' + err);
      });
    }
  }

  /** Register existences for each purchased product */
  saveContents(purchase, transaction) {
    let promises = [];

    for (let content of this.state.contents) {

      // Find last purchase price
      let promise = ProductService
          .lastProviderPrice(
            content.product.id,
            content.provider.id,
            this.state.date
          )
          .then(lastPrice => {

            // Create new purchase price
            if (lastPrice === null || lastPrice.price !== content.cost) {
              let purchasePrice = {
                price: content.cost,
                measurementUnitId: 1,
                providerId: content.provider.id,
                productId: content.product.id,
                date: this.state.date
              };

              return PurchasePrice.create(purchasePrice, { transaction: transaction })
                .then(purchasePrice => {
                  return this.saveExistences(
                    content.product.id,
                    purchase.id,
                    purchasePrice.id,
                    content.quantity,
                    transaction
                  );
                });
            }

            // Use existing purchase price
            else {
              return this.saveExistences(
                content.product.id,
                purchase.id,
                lastPrice.id,
                content.quantity,
                transaction
              );
            }
          });

      // Upsert sale price
      let salePricePromise = ProductService
        .lastPrice(content.product.id, this.state.date)
        .then(lastPrice => {
          if (lastPrice === null || lastPrice.price !== content.price) {
            let salePrice = {
              productId: content.product.id,
              price: content.price,
              date: this.state.date
            };

            return SalePrice.create(salePrice, { transaction: transaction });
          }

          // Sale price is already updated
          else {
            return Promise.resolve('Sale price reused');
          }
        });

      promises.push(promise);
      promises.push(salePricePromise);
    }

    return Promise.all(promises);
  }

  // noinspection JSMethodCanBeStatic
  /** Creates given number of existences */
  saveExistences(productId, purchaseId, purchasePriceId, quantity, transaction) {
    let data = [];
    for (let i = 0; i < quantity; i++) {
      data.push({
        productId: productId,
        purchaseId: purchaseId,
        purchasePriceId: purchasePriceId
      });
    }

    return Existence.bulkCreate(data, { transaction: transaction });
  }

  validate() {
    let formOk = true;

    if (this.state.contents.length === 0) {
      formOk = false;
      this.state.validationErrors.contents = 'Agregue al menos un producto';
    } else {
      this.state.validationErrors.contents = '';
    }

    let payment = this.state.paymentInvestment;
    payment += this.state.paymentReinvestment;
    if (payment !== this.state.totalCost) {
      formOk = false;
      this.state
        .validationErrors
        .paymentInvestment = 'El monto pagado no coincide con el costo de la' +
            ' compra (' + this.state.totalCost + ')';
    } else {
      this.state.validationErrors.paymentInvestment = '';
    }

    this.emitChange();
    return formOk;
  }

  getState() {
    return this.state;
  }
}

const storeInstance = new PurchaseCreateStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.PURCHASE.ADD_CONTENT:
      storeInstance.addProduct(
        action.product,
        action.provider,
        action.quantity,
        action.cost,
        action.price
      );
      break;

    case ActionTypes.PURCHASE.CHANGE_PAYMENT_AS_INVESTMENT:
      storeInstance.setPaymentInvestment(action.amount);
      break;

    case ActionTypes.PURCHASE.CHANGE_PAYMENT_AS_REINVESTMENT:
      storeInstance.setPaymentReinvestment(action.amount);
      break;

    case ActionTypes.PURCHASE.CHANGE_DATE:
      storeInstance.setDate(action.date);
      break;

    case ActionTypes.PURCHASE.SAVE:
      storeInstance.save();
      break;

    case ActionTypes.PURCHASE.SET_REDIRECT_AS_COMPLETED:
      storeInstance.setRedirectAsCompleted();
      break;
  }
});

export default storeInstance;
