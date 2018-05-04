import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import ProductService from '../../../services/ProductService';
import {Sale, SaleHasExistence, SalePrice} from "../../../model/entities";
import sequelize from "../../../model/database";

class CreateSaleStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = CreateSaleStore.initialState();
  }

  /** Creates the default state with empty/default values */
  static initialState(redirectToList) {
    return {

      // Component logic related
      redirectToList: !!redirectToList,

      // Sale related data
      error: null,
      contents: [
        // product: {}
        // quantity: number
        // price
        // selfConsumption
      ],
      total: 0,
      date: new Date(),

      // Product form data
      form: CreateSaleStore.initialFormState()
    }
  }

  static initialFormState() {
    return {
      error: null,
      product: {
        // A product instance
        value: null,

        // Autosuggest input value
        inpValue: '',
        error: null
      },
      quantity: {
        value: '1',
        error: null,
      },
      stock: { value: 0 },
      selfConsumption: {
        value: false,
        error: null,
      },
      cost: { value: 0 },
      price: {
        value: '0',
        error: null,
      },
      lastPrice: { value: 0 },
      totalPrice: { value: 0 },
    }
  }

  /** Remove '.' from begin or end of value */
  static _trimDots(value) {
    if (value === '.' || value.length === 0) {
      return 0;
    }

    if (typeof value === "number") {
      return value;
    }

    // Starts with dot
    if (value.startsWith('.')) {
      value = value.substr(1);

      // Also ends with dot?
      if (value.endsWith('.')) {
        value = value.substr(0, value.length - 2);

        if (value.length === 0) {
          return 0;
        }

        return value;
      }
    }

    // Ends with dot
    if (value.endsWith('.')) {
      value = value.substr(0, value.length - 2);
      return value;
    }

    return value;
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

  addProduct() {
    if (this._validate()) {
      let qty = this.state.form.quantity.value * 1;
      let price = this.state.form.price.value * 1;
      let content = {
        product: this.state.form.product.value,
        quantity: qty,
        price: price,
        selfConsumption: this.state.form.selfConsumption.value
      };

      this.state.total += qty * price;
      this.state.contents.push(content);
      this.resetProductForm();
      this.emitChange();
    }
  }

  onDateChange(date) {
    this.state.date = date;
    this.emitChange();
  }

  onProductAutocompleteValueChange(value) {
    this.state.form.product.inpValue = value;
    this.emitChange();
  }

  /** Product selected from auto complete */
  onProductSelected(product) {
    this.state.form.product.value = product;

    // Retrieve current available stock
    let alreadyAddedQty = this._countAlreadyAdded(product.id);
    ProductService.stockCount(product.id, this.state.date)
      .then(products => {
        let stock = products.length > 0
          ? products[0].stock ? products[0].stock : 0
          : 0;
        stock -= alreadyAddedQty;
        this.state.form.stock.value = stock;

        this.emitChange();
      })
      .catch(err => {
        console.error(err);
        this.state.form.stock.value = 0;
        this.emitChange();
      });

    // Retrieve current cost
    ProductService.lastCost(product.id, this.state.date)
      .then(purchasePrice => {
        this.state.form.cost.value = purchasePrice == null
          ? 0
          : purchasePrice.price;
        this.emitChange();
      })
      .catch(err => {
        console.error(err);
        this.state.form.cost.value = 0;
        this.emitChange();
      });

    // Retrieve last price
    ProductService.lastPrice(product.id, this.state.date)
      .then(lastPrice => {
        this.state.form.lastPrice.value = lastPrice == null
          ? 0
          : lastPrice.price;

        let price = this.state.form.lastPrice.value;
        this.onPriceChange(price);
      })
      .catch(err => {
        console.error(err);
        this.state.form.lastPrice.value = 0;
        let price = this.state.form.lastPrice.value;
        this.onPriceChange(price)
      });
  }

  onQuantityChange(value) {
    this.state.form.quantity.value = `${value}`;
    if (this._validateQuantity() && this._validatePrice()) {
      this._calculateTotalPrice();
    }

    this.emitChange();
  }

  onSelfConsumptionChange(value) {
    this.state.form.selfConsumption.value = value;

    let price = value
      ? this.state.form.cost.value
      : this.state.form.lastPrice.value;
    this.onPriceChange(price);
  }

  onPriceChange(value) {
    this.state.form.price.value = `${value}`;
    if (this._validateQuantity() && this._validatePrice()) {
      this._calculateTotalPrice();
    }

    this.emitChange();
  }

  onSaveClicked() {
    if (this._validateSale()) {

      // Store sale in transaction
      sequelize.transaction(transaction => {
          let saleData = {
            date: this.state.date,
            total: this.state.total
          };

          return Sale.create(saleData, { transaction: transaction })
            .then(sale => {
              return this._saveContents(sale, transaction);
            });
        })
        .then(() => this.reset(true))
        .catch(err => {
          console.error('Sale could not be created');
          console.error(err);
        });
    }
  }

  /** Reset the state to empty/default values */
  reset(redirectToList) {
    this.state = CreateSaleStore.initialState(redirectToList);
    this.emitChange();
  }

  /** Reset the product form state to empty/default values */
  resetProductForm() {
    this.state.form = CreateSaleStore.initialFormState();
    this.emitChange()
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  _calculateTotalPrice() {
    let quantity = CreateSaleStore._trimDots(this.state.form.quantity.value) * 1;
    let price = CreateSaleStore._trimDots(this.state.form.price.value) * 1;

    this.state.form.totalPrice.value = quantity * price;
  }

  /** Counts the already added quantity of given product */
  _countAlreadyAdded(productId) {
    let alreadyAdded = 0;

    for (let content of this.state.contents) {
      if (content.product.id === productId) {
        alreadyAdded += content.quantity;
      }
    }

    return alreadyAdded;
  }

  _saveContents(sale, transaction) {
    let promises = [];

    for (let content of this.state.contents) {
      let productId = content.product.id;
      let quantity = content.quantity;
      let price = content.price;
      let date = sale.date;

      // Validate stock
      let promise = ProductService.stockCount(productId, date).then(products => {
        let stock = products.length > 0
          ? products[0].stock ? products[0].stock : 0
          : 0;
        if (quantity > stock) {
          let msg = 'La cantidad (' + stock + ') disponible de "' + content.product.name + '"';
          msg += ' no es suficiente';
          this.state.error = msg;
          this.emitChange();

          throw "Insufficient stock";
        }

        // Get sale price to use
        return ProductService.lastPrice(productId, date).then(lPrice => {

          // Create new one
          if (lPrice === null || lPrice.price !== price) {
            let salePrice = {
              price: price,
              productId: productId,
              date: date
            };
            return SalePrice.create(salePrice, { transaction: transaction }).then(sPrice => {
              return this._saveExistencesIntoSale(
                productId,
                sale.id,
                sPrice.id,
                quantity,
                date,
                transaction
              );
            })
          }

          // User already existing
          else {
            return this._saveExistencesIntoSale(
              productId,
              sale.id,
              lPrice.id,
              quantity,
              date,
              transaction
            );
          }
        })
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  _saveExistencesIntoSale(productId, saleId, sPriceId, quantity, date, transaction) {
    let suppliedQuantity = 0;
    return ProductService.stockAvailable(productId, date).then(existences => {

      // Prepare all sale_has_existence required to supply required quantity
      let sHasExistences = [];
      for (let existence of existences) {
        let pendingQty = quantity - suppliedQuantity;
        if (pendingQty <= 0) break;

        let takenQty = 1;
        if (pendingQty >= existence.available) {
          if (existence.available !== 1) {
            takenQty = existence.available;
          }
        } else {
          takenQty = pendingQty;
        }

        suppliedQuantity += takenQty;
        sHasExistences.push({
          saleId: saleId,
          existenceId: existence.id,
          salePriceId: sPriceId,
          partialQuantity: takenQty === 1 ? null : takenQty
        });
      }

      // Store all 'sale_has_existence' on transaction
      return SaleHasExistence.bulkCreate(sHasExistences, { transaction: transaction});
    })
  }

  _validate() {
    let formOk = this._validateQuantity() &&
      this._validatePrice() &&
      this._validateProduct();

    if (isNaN(this.state.form.quantity.value)) {
      this.state.form.quantity.error = 'Invalida';
      formOk = false;
    }

    if (isNaN(this.state.form.price.value)) {
      this.state.form.price.error = 'Invalido';
      formOk = false;
    }

    if (!formOk) this.emitChange();
    return formOk;
  }

  _validatePrice() {
    let price = CreateSaleStore._trimDots(this.state.form.price.value);

    if (isNaN(price)) {
      this.state.form.price.error = 'Es invalido';
      return false;
    }
    else {
      this.state.form.price.error = null;
    }

    return true;
  }

  _validateProduct() {
    if (this.state.form.product.value === null) {
      this.state.form.product.error = 'Indique el producto';
      return false;
    } else {
      this.state.form.product.error = null;
    }

    return true;
  }

  _validateQuantity() {
    let quantity = CreateSaleStore._trimDots(this.state.form.quantity.value);

    if (isNaN(quantity)) {
      this.state.form.quantity.error = 'Es invalida';
      return false;
    }
    else if (this.state.form.quantity.value * 1 > this.state.form.stock.value) {
      this.state.form.quantity.error = 'Sobrepasa stock';
      return false;
    }
    else if (this.state.form.quantity.value * 1 === 0) {
      this.state.form.quantity.error = 'Invalida';
      return false;
    }
    else {
      this.state.form.quantity.error = null;
    }

    return true;
  }

  _validateSale() {
    if (this.state.contents.length === 0) {
      this.state.error = 'Agregue al menos un producto';
      this.emitChange();
      return false;
    }

    return true;
  }
}

const storeInstance = new CreateSaleStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SALES.CREATE.ON_DATE_CHANGE:
      storeInstance.onDateChange(action.date);
      break;

    case ActionTypes.SALES.CREATE.ON_PRODUCT_AUTO_COMPLETE_VALUE_CHANGE:
      storeInstance.onProductAutocompleteValueChange(action.value);
      break;

    case ActionTypes.SALES.CREATE.ON_PRODUCT_SELECTED:
      storeInstance.onProductSelected(action.product);
      break;

    case ActionTypes.SALES.CREATE.ON_QUANTITY_CHANGE:
      storeInstance.onQuantityChange(action.value);
      break;

    case ActionTypes.SALES.CREATE.ON_SELF_CONSUMPTION_CHANGE:
      storeInstance.onSelfConsumptionChange(action.value);
      break;

    case ActionTypes.SALES.CREATE.ON_PRICE_CHANGE:
      storeInstance.onPriceChange(action.value);
      break;

    case ActionTypes.SALES.CREATE.ON_ADD_PRODUCT_CLICKED:
      storeInstance.addProduct();
      break;

    case ActionTypes.SALES.CREATE.ON_SAVE_CLICKED:
      storeInstance.onSaveClicked();
      break;

    case ActionTypes.SALES.SET_REDIRECT_AS_COMPLETED:
      storeInstance.setRedirectAsCompleted();
      break;
  }
});

export default storeInstance;
