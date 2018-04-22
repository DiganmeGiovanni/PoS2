import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import ProductService from '../../../services/ProductService';
import {Sale, SaleHasExistence, SalePrice} from "../../../model/entities";
import sequelize from "../../../model/database";

class SaleCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = this.makeInitialState();
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

  getState() {
    return this.state;
  }

  reset(redirectToList) {
    this.state = this.makeInitialState(redirectToList);
    this.emitChange();
  }

  // noinspection JSMethodCanBeStatic
  makeInitialState(redirectToList) {
    return {
      contents: [],
      total: 0,
      date: new Date(),
      selfConsumption: false,

      validationErrors: {
        contents: '',
        date: '',
        paymentInvestment: ''
      },

      redirectToList: !!redirectToList
    };
  }

  setDate(date) {
    this.state.date = date;
    this.emitChange();
  }

  setSelfConsumption(selfConsumption) {
    this.state.selfConsumption = selfConsumption;
    this.emitChange();
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  addProduct(product, quantity, price) {
    this.state.contents.push({ product, quantity, price });
    this.state.total += price * quantity;
    this.emitChange();
  }

  save() {
    if (this.validate()) {

      // Save all in transaction
      sequelize.transaction(transaction => {
        let saleData = {
          date: this.state.date,
          selfConsumption: this.state.selfConsumption,
          total: this.state.total
        };

        return Sale.create(saleData, { transaction: transaction })
          .then(sale => {
            return this.saveContents(sale, transaction);
          });
      })
      .then(() => { this.reset(true); })
      .catch(err => { console.error('Sale could not be stored: ' + err); });
    }
  }

  saveContents(sale, transaction) {
    let promises = [];

    for (let content of this.state.contents) {
      let promise = ProductService
        .lastPrice(content.product.id, this.state.date)
        .then(lastPrice => {

          // Create new sale price
          if (lastPrice === null || lastPrice.price !== content.price) {
            let salePrice = {
              price: content.price,
              productId: content.product.id,
              date: this.state.date
            };

            return SalePrice.create(salePrice, { transaction: transaction })
              .then(salePrice => {
                return this.saveSaleExistences(
                  content.product.id,
                  sale.id,
                  salePrice.id,
                  content.quantity,
                  this.state.date,
                  transaction
                )
              });
          }

          // Use existing sale price
          else {
            return this.saveSaleExistences(
              content.product.id,
              sale.id,
              lastPrice.id,
              content.quantity,
              this.state.date,
              transaction
            );
          }
        });

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  saveSaleExistences(productId, saleId, salePriceId, quantity, date, transaction) {

    // Retrieve existences to add to sale
    return ProductService.availableExistences(productId, quantity, date)
      .then(products => {

        // Create sale has existence data
        let sHasExistenceData = [];
        for (let product of products) {
          sHasExistenceData.push({
            saleId: saleId,
            existenceId: product.existence_id,
            salePriceId: salePriceId,
          });
        }

        // Insert sale has existence
        return SaleHasExistence.bulkCreate(
          sHasExistenceData,
          { transaction: transaction }
        );
      });
  }

  validate() {
    let formOk = true;

    if (this.state.contents.length === 0) {
      formOk = false;
      this.state.validationErrors.contents = 'Agregue al menos un producto';
    } else {
      this.state.validationErrors.contents = '';
    }

    this.emitChange();
    return formOk;
  }
}

const storeInstance = new SaleCreateStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SALES.ADD_CONTENT:
      storeInstance.addProduct(
        action.product,
        action.quantity,
        action.price
      );
      break;

    case ActionTypes.SALES.CHANGE_DATE:
      storeInstance.setDate(action.date);
      break;

    case ActionTypes.SALES.CHANGE_SELF_CONSUMPTION:
      storeInstance.setSelfConsumption(action.selfConsumption);
      break;

    case ActionTypes.SALES.SAVE:
      storeInstance.save();
      break;

    case ActionTypes.SALES.SET_REDIRECT_AS_COMPLETED:
      storeInstance.setRedirectAsCompleted();
      break;
  }
});

export default storeInstance;
