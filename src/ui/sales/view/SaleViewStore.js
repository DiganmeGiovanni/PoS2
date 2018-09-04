import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Sale} from "../../../model/entities";
import sequelize from "../../../model/database";
const Sequelize = require('sequelize');

class SaleViewStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = {
      sale: null,
      contents: [],
      filters: {
        product: '',
        selfConsumption: '',
        quantity: '',
        mUnit: '',
        unitPrice: '',
        price: ''
      },

      isLoadingProducts: true
    }
  }

  getState() {
    return this.state;
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

  clearFilters() {
    this.state.filters.product = '';
    this.state.filters.selfConsumption = '';
    this.state.filters.quantity = '';
    this.state.filters.mUnit = '';
    this.state.filters.unitPrice = '';
    this.state.filters.price = '';
  }

  fetchSale(saleId) {
    this.clearFilters();
    Sale.findById(saleId)
      .then(sale => {
        this.state.sale = sale;

        this.fetchContents(sale.id)
          .then(contents => {
            this.state.isLoadingProducts = false;
            this.state.contents = contents;
            this.emitChange();
          })
          .catch(err => {
            console.error(err);
            this.emitChange();
          });
      })
      .catch(err => {
        console.error('Sale could not be retrieved: ' + err);
      });
  }

  fetchContents(saleId) {
    let sql = '\
      SELECT\
        PROD.id,\
        PROD.name,\
        SHP.self_consumption                 AS self_consumption,\
        SUM(SHP.quantity)                    AS quantity,\
        MU.name                              AS measurement_unit_name,\
        SALE_PRICE.price,\
        SALE_PRICE.price * SUM(SHP.quantity) AS total\
      FROM sale_has_product SHP\
      INNER JOIN sale_price SALE_PRICE\
        ON SHP.sale_price_id = SALE_PRICE.id\
      INNER JOIN product PROD\
        ON SALE_PRICE.product_id = PROD.id\
      INNER JOIN measurement_unit MU\
        ON MU.id = PROD.measurement_unit_id\
      WHERE SHP.sale_id = :saleId\
    ';

    sql += this.makeConditions();
    sql += '\
      GROUP BY PROD.id, SHP.self_consumption, SALE_PRICE.price\
      ORDER BY PROD.name\
    ';

    return sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        saleId: saleId,
        product: '%' + this.state.filters.product + '%',
        selfConsumption: this.state.filters.selfConsumption,
        quantity: this.state.filters.quantity,
        mUnit: '%' + this.state.filters.mUnit + '%',
        unitPrice: this.state.filters.unitPrice * 1,
        price: this.state.filters.price * 1
      }
    });
  }

  makeConditions() {
    let conditions = '';

    if (this.state.filters.product !== '') {
      conditions += " AND PROD.name LIKE :product";
    }

    if (this.state.filters.selfConsumption !== '') {
      conditions += " AND SHP.self_consumption = :selfConsumption"
    }

    if (this.state.filters.quantity !== '') {
      conditions += " AND SHP.quantity = :quantity";
    }

    if (this.state.filters.mUnit !== '') {
      conditions += " AND MU.name LIKE :mUnit";
    }

    if (this.state.filters.unitPrice !== '') {
      conditions += " AND ROUND(SALE_PRICE.price, 2) = :unitPrice";
    }

    if (this.state.filters.price !== '') {
      conditions += " AND ROUND((SALE_PRICE.price * SHP.quantity), 2) = :price";
    }

    return conditions;
  }

  filterByProduct(product) {
    this.state.filters.product = product;
    this.refreshContents();
  }

  filterBySelfConsumption(selfConsumption) {
    this.state.filters.selfConsumption = selfConsumption;
    this.refreshContents();
  }

  filterByQuantity(quantity) {
    this.state.filters.quantity = quantity;
    this.refreshContents();
  }

  filterByMUnit(mUnit) {
    this.state.filters.mUnit = mUnit;
    this.refreshContents();
  }

  filterByUnitPrice(unitPrice) {
    this.state.filters.unitPrice = unitPrice;
    this.refreshContents();
  }

  filterByPrice(price) {
    this.state.filters.price = price;
    this.refreshContents();
  }

  refreshContents() {
    if (this.state.sale !== null) {
      this.fetchContents(this.state.sale.id)
        .then(contents => {
          this.state.contents = contents;
          this.emitChange();
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
}

const storeInstance = new SaleViewStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SALES.VIEW.FETCH:
      storeInstance.fetchSale(action.saleId);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_PRODUCT_CHANGE:
      storeInstance.filterByProduct(action.product);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_SELF_CONSUMPTION_CHANGE:
      storeInstance.filterBySelfConsumption(action.selfConsumption);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_QUANTITY_CHANGE:
      storeInstance.filterByQuantity(action.quantity);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_M_UNIT_CHANGE:
      storeInstance.filterByMUnit(action.mUnit);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_UNIT_PRICE_CHANGE:
      storeInstance.filterByUnitPrice(action.unitPrice);
      break;

    case ActionTypes.SALES.VIEW.ON_FILTER_PRICE_CHANGE:
      storeInstance.filterByPrice(action.price);
      break;

  }
});

export default storeInstance;
