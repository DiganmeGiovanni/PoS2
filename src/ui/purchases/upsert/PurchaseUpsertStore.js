import { EventEmitter } from "events";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";
import ProductService from "../../../services/ProductService";
import DValidator from '../../../services/ValidatorService';
import sequelize from '../../../model/database';
import {Purchase, PurchaseHasProduct, PurchasePrice, SalePrice} from "../../../model/entities";

class PurchaseUpsertStore extends EventEmitter { 
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE";

    this.state = PurchaseUpsertStore.initialState();
  }

  static initialState(redirectToList) {
    return {
      redirectToList: !!redirectToList,
      contents: [],
      total: 0,
      date: new Date(),
      investment: { value: '0', error: '' },
      reinvestment: { value: '0', error: '' },
      provider: { value:null, inpValue: '', error: '' },
      totalPaid: '0',
      errors: {
        contents: '',
        date: ''
      },
      productForm: PurchaseUpsertStore.initialProductFormState()
    }
  }

  static initialProductFormState() {
    return {
      product: { value: null, inpValue: '', error: '' },
      quantity: { value: '', error: '' },
      cost: { value: '', error: '' },
      lastCost: { value: 0 },
      price: { value: '', error: '' }
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

  getState() {
    return this.state;
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  onDateChange(date) {
    this.state.date = date;
    this.emitChange();
  }

  onInvestmentChange(amount) {
    this.state.investment.value = amount;
    this.state.investment.error = '';
    this.emitChange();
  }

  onReinvestmentChange(amount) {
    this.state.reinvestment.value = amount;
    this.state.reinvestment.error = '';
    this.emitChange();
  }

  onTotalPaidChange(totalPaid) {
    this.state.totalPaid = totalPaid;
    this.state.investment.error = '';
    this.emitChange();
  }

  onProductValueChange(value) {
    if (typeof value !== 'undefined') {
      this.state.productForm.product.inpValue = value;
      this.state.productForm.product.error = '';
      this.emitChange();
    }
  }

  onProductSelected(product) {
    // Fetch last cost for product and refresh state
    ProductService.lastCost(product.id, this.state.date)
      .then(purchasePrice => {

        this.state.productForm.product.value = product;
        this.state.productForm.product.inpValue = product.name;
        this.state.productForm.product.error = '';
        this.state.productForm.lastCost.value = purchasePrice === null ? 0 : purchasePrice.price;
        this.emitChange();
      })
      .catch(err => { console.error(err); });
  }

  onQuantityChange(quantity) {
    this.state.productForm.quantity.value = quantity;
    this.state.productForm.quantity.error = '';
    this.emitChange();
  }

  onProviderValueChange(value) {
    if (typeof value !== 'undefined') {
      this.state.provider.inpValue = value;
      this.state.provider.error = '';
      this.emitChange();
    }
  }

  onProviderChange(provider) {
    this.state.provider.value = provider;
    this.state.provider.inpValue = provider.name;
    this.state.provider.error = '';
    this.emitChange();
  }

  onCostChange(cost) {
    this.state.productForm.cost.value = cost;
    this.state.productForm.cost.error = '';
    this.emitChange();
  }

  onPriceChange(price) {
    this.state.productForm.price.value = price;
    this.state.productForm.price.error = '';
    this.emitChange();
  }

  onAddProductClicked() {
    if (this._validateProductForm()) {
      let productForm = this.state.productForm;
      let totalDelta = productForm.quantity.value * productForm.cost.value;

      this.state.contents.unshift(productForm);
      this.state.total += totalDelta;
      this._cleanUpProductForm();
      this.emitChange();
    } else {
      this.emitChange();
    }
  }

  deleteContent(index) {
    let productItem = this.state.contents[index];
    let itemCost = productItem.quantity.value * productItem.cost.value;

    this.state.contents.splice(index, 1);
    this.state.total -= itemCost;
    this.emitChange();
  }

  editContent(index) {
    let productItem = this.state.contents[index];
    let itemCost = productItem.quantity.value * productItem.cost.value;

    this.state.productForm = productItem;
    this.state.contents.splice(index, 1);
    this.state.total -= itemCost;
    this.emitChange();
  }

  onSaveClicked() {
    if (this._validate()) {

      // Save purchase on transaction
      sequelize.transaction(transaction => {
        let purchaseValues = {
          reinvestment: this.state.reinvestment.value,
          investment: this.state.investment.value,
          date: this.state.date
        };

        return Purchase
          .create(purchaseValues, { transaction: transaction })
          .then(purchase => {
            return this._saveContents(purchase, transaction);
          });
      }).then(() => {
        this.state = PurchaseUpsertStore.initialState(true);
        this.emitChange();
      }).catch(err => {
        console.error('Purchase could not be stored');
        console.error(err);
      });
    } else {
      this.emitChange();
    }
  }

  _saveContents(purchase, transaction) {
    let promises = [];
    let providerId = this.state.provider.value.id;

    for (let content of this.state.contents) {
      let productId = content.product.value.id;
      let cost = content.cost.value * 1;
      let price = content.price.value * 1;

      // Find last purchase price
      let lastPricePromise = ProductService
        .lastProviderPrice(productId, providerId, this.state.date)
        .then(lastPrice => {

          // Should create new purchase price?
          if (lastPrice === null || lastPrice.price !== cost) {
            let purchasePriceValues = {
              price: content.cost.value,
              measurementUnitId: content.product.value.measurementUnitId,
              providerId: providerId,
              productId: productId,
              date: this.state.date
            };

            return PurchasePrice
              .create(purchasePriceValues, { transaction: transaction })
              .then(purchasePrice => {
                return this._saveExistences(
                  productId,
                  purchase.id,
                  purchasePrice.id,
                  content.quantity.value,
                  transaction
                );
              });
          }

          // Use existent purchase price
          else {
            return this._saveExistences(
              productId,
              purchase.id,
              lastPrice.id,
              content.quantity.value,
              transaction
            );
          }
        });

      // Upsert sale price
      let salePricePromise = ProductService
        .lastPrice(productId, this.state.date)
        .then(lastSalePrice => {
          if (lastSalePrice === null || lastSalePrice.price !== price) {
            let salePriceValues = {
              price: price,
              date: this.state.date,
              productId: productId
            };

            return SalePrice.create(
              salePriceValues,
              { transaction: transaction }
            );
          }

          // Sale price is already updated
          else {
            return Promise.resolve('Saleprice reused');
          }
        });

      promises.push(lastPricePromise);
      promises.push(salePricePromise);
    }

    return Promise.all(promises);
  }

  _saveExistences(productId, purchaseId, purchasePriceId, quantity, transaction) {
    return ProductService.findOne(productId).then(product => {
      let purchaseHasProductData = {
        purchaseId: purchaseId,
        productId: productId,
        purchasePriceId: purchasePriceId,
        quantity: quantity
      };

      return PurchaseHasProduct
        .create(purchaseHasProductData, { transaction: transaction })
        .then(hasProduct => {
          product.existences += quantity;
          return product.save({ transaction: transaction });
        });
    });
  }

  _validate() {
    let formOk = true;

    this.state.errors.contents = '';
    this.state.errors.date = '';
    this.state.investment.error = '';

    if (this.state.contents.length === 0) {
      formOk = false;
      this.state.errors.contents = 'Agregue al menos un producto a la compra';
    }

    if (this.state.provider.value === null) {
      formOk = false;
      this.state.provider.error = 'Elija un proveedor para esta compra';
    }

    // Verify that total paid is a valid number
    if (!DValidator.isNumber(this.state.totalPaid)) {
      formOk = false;
      this.state.investment.error = 'El total pagado es invalido';
    }

    // Validate that total paid is not zero
    if (this.state.totalPaid === '' || this.state.totalPaid * 1 === 0) {
      formOk = false;
      this.state.investment.error = 'El total pagado es invalido';
    }

    // Validate that total paid matches investment and reinvestment
    else {
      let paidQuantity = this.state.investment.value * 1;
      paidQuantity += this.state.reinvestment.value * 1;
      if (paidQuantity !== (this.state.totalPaid * 1)) {
        formOk = false;
        this.state.investment.error = 'El monto pagado no coincide con el total' +
          ' indicado para la compra (' + this.state.totalPaid + ')';
      }
    }

    return formOk;
  }

  _validateProductForm() {
    let formOk = true;

    if (this.state.productForm.product.value === null) {
      formOk = false;
      this.state.productForm.product.error = 'Elija un producto valido';
    }

    if (!DValidator.isNumber(this.state.productForm.quantity.value)) {
      formOk = false;
      this.state.productForm.quantity.error = 'Cantidad invalida';
    } else if (this.state.productForm.quantity.value * 1 <= 0) {
      formOk = false;
      this.state.productForm.quantity.error = 'Cantidad invalida';
    }

    if (!DValidator.isNumber(this.state.productForm.cost.value)) {
      formOk = false;
      this.state.productForm.cost.error = 'Indique el costo unitario';
    }

    if (!DValidator.isNumber(this.state.productForm.price.value)) {
      formOk = false;
      this.state.productForm.price.error = 'Indique el precio de venta';
    }

    return formOk;
  }

  _cleanUpProductForm() {
    this.state.productForm = PurchaseUpsertStore.initialProductFormState();
  }
}

const instance = new PurchaseUpsertStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASES.UPSERT.ON_DATE_CHANGE:
      instance.onDateChange(action.date);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_INVESTMENT_CHANGE:
      instance.onInvestmentChange(action.investment);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_REINVESTMENT_CHANGE:
      instance.onReinvestmentChange(action.reinvestment);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_TOTAL_PAID_CHANGE:
      instance.onTotalPaidChange(action.totalPaid);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_PROD_VALUE_CHANGE:
      instance.onProductValueChange(action.value);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_PROD_SELECTED:
      instance.onProductSelected(action.product);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_QUANTITY_CHANGE:
      instance.onQuantityChange(action.quantity);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_PROVIDER_VALUE_CHANGE:
      instance.onProviderValueChange(action.value);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_PROVIDER_SELECTED:
      instance.onProviderChange(action.provider);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_COST_CHANGE:
      instance.onCostChange(action.cost);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_PRICE_CHANGE:
      instance.onPriceChange(action.price);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_ADD_PRODUCT_CLICKED:
      instance.onAddProductClicked();
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_DELETE_CONTENT_CLICKED:
      instance.deleteContent(action.index);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_EDIT_CONTENT_CLICKED:
      instance.editContent(action.index);
      break;

    case ActionTypes.PURCHASES.UPSERT.ON_SAVE_CLICKED:
      instance.onSaveClicked();
      break;

    case ActionTypes.PURCHASES.UPSERT.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
