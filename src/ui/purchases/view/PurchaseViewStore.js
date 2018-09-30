import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Purchase} from "../../../model/entities";
import sequelize from "../../../model/database";
const Sequelize = require('sequelize');

class PurchaseViewStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = {
      purchase: null,
      contents: [],
      filters: {
        product: '',
        quantity: '',
        mUnitId: '',
        sold: '',
        stock: '',
        unitCost: '',
        cost: ''
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

  fetchPurchase(purchaseId) {
    this.resetFilters();
    Purchase.findById(purchaseId)
        .then(purchase => {
          this.state.purchase = purchase;

          this.fetchContents(purchase.id)
            .then(contents => {
              this.state.isLoadingProducts = false;
              this.state.contents = contents;
              this.emitChange();
            })
            .catch(err => {
              console.log('Existences could not be retrieved: ' + err);
              this.emitChange();
            });
        })
        .catch(err => {
          console.error('Purchase could not be retrieved: ' + err);
        });
  }

  fetchContents(purchaseId) {
    let sql = '\
      SELECT\
        PRO.id,\
        PROV.name                AS provider_name,\
        PRO.name                 AS product_name,\
        SUM(PHP.quantity)        AS quantity,\
        MU.name                  AS measurement_unit,\
        IFNULL(\
          CASE WHEN (STOCK.quantity - SOLD.quantity < 1) THEN\
            SUM(PHP.quantity)\
          ELSE\
            CASE WHEN (SUM(PHP.quantity) - (STOCK.quantity - SOLD.quantity)) < 0\
              THEN 0\
              ELSE SUM(PHP.quantity) - (STOCK.quantity - SOLD.quantity)\
            END\
          END,\
          0\
        )                        AS sold,\
        IFNULL(\
          CASE WHEN (STOCK.quantity - SOLD.quantity < 1) THEN\
            0\
          ELSE\
            CASE WHEN (STOCK.quantity - SOLD.quantity) > SUM(PHP.quantity)\
              THEN SUM(PHP.quantity)\
              ELSE STOCK.quantity - SOLD.quantity\
            END\
          END,\
          SUM(PHP.quantity)\
        )                        AS stock,\
        PP.price                 AS cost,\
        SUM(PHP.quantity) * PP.price AS total\
      FROM purchase_has_product PHP\
      INNER JOIN purchase_price PP\
        ON PP.id = PHP.purchase_price_id\
      INNER JOIN product PRO\
        ON PRO.id = PP.product_id\
      INNER JOIN measurement_unit MU\
        ON MU.id = PRO.measurement_unit_id\
      INNER JOIN provider PROV\
        ON PP.provider_id = PROV.id\
      LEFT JOIN (\
            SELECT\
              product_id,\
              SUM(quantity) AS quantity\
            FROM purchase_has_product\
            INNER JOIN purchase p on purchase_has_product.purchase_id = p.id\
            WHERE p.id <= :purchaseId\
            GROUP BY product_id\
          ) STOCK\
        ON PRO.id = STOCK.product_id\
      LEFT JOIN (\
            SELECT\
              price.product_id,\
              SUM(quantity) AS quantity\
            FROM sale_has_product\
            INNER JOIN sale_price price\
              on sale_has_product.sale_price_id = price.id\
            GROUP BY price.product_id\
          ) SOLD\
        ON SOLd.product_id = PRO.id\
      WHERE PHP.purchase_id = :purchaseId\
    ';

    sql += this.fetchAppendConditionsAndGroup();

    return sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        purchaseId: purchaseId,
        product: '%' + this.state.filters.product + '%',
        quantity: this.state.filters.quantity * 1,
        sold: this.state.filters.sold * 1,
        stock: this.state.filters.stock * 1,
        unitCost: this.state.filters.unitCost * 1,
        cost: this.state.filters.cost * 1
      }
    });
  }

  fetchAppendConditionsAndGroup() {
    let conditions = '';

    if (this.state.filters.product !== '') {
      conditions += " AND PRO.name LIKE :product"
    }

    // Group
    conditions += " GROUP BY PRO.id, PP.price HAVING 1 = 1";

    if (this.state.filters.quantity !== '') {
      conditions += " AND SUM(PHP.quantity) = :quantity"
    }

    if (this.state.filters.sold !== '') {
      const sqlSold = '\
        IFNULL(\
          CASE WHEN (STOCK.quantity - SOLD.quantity < 1) THEN\
            SUM(PHP.quantity)\
          ELSE\
            CASE WHEN (SUM(PHP.quantity) - (STOCK.quantity - SOLD.quantity)) < 0\
              THEN 0\
              ELSE SUM(PHP.quantity) - (STOCK.quantity - SOLD.quantity)\
            END\
          END,\
          0\
        )';
      conditions += ` AND ${ sqlSold }  = :sold`
    }

    if (this.state.filters.stock !== '') {
      const stockSql = '\
        IFNULL(\
          CASE WHEN (STOCK.quantity - SOLD.quantity < 1) THEN\
            0\
          ELSE\
            CASE WHEN (STOCK.quantity - SOLD.quantity) > SUM(PHP.quantity)\
              THEN SUM(PHP.quantity)\
              ELSE STOCK.quantity - SOLD.quantity\
            END\
          END,\
          SUM(PHP.quantity)\
        )';
      conditions += ` AND ${ stockSql } = :stock`
    }

    if (this.state.filters.unitCost !== '') {
      conditions += " AND ROUND(PP.price, 2) = :unitCost"
    }

    if (this.state.filters.cost !== '') {
      conditions += " AND ROUND(SUM(PHP.quantity) * PP.price, 2) = :cost"
    }

    conditions += ' ORDER BY PRO.name';
    return conditions;
  }

  filterByProduct(product) {
    this.state.filters.product = product;
    this.refreshContents();
  }

  filterByQuantity(quantity) {
    this.state.filters.quantity = quantity;
    this.refreshContents();
  }

  filterBySold(sold) {
    this.state.filters.sold = sold;
    this.refreshContents();
  }

  filterByStock(stock) {
    this.state.filters.stock = stock;
    this.refreshContents();
  }

  filterByUnitCost(unitCost) {
    this.state.filters.unitCost = unitCost;
    this.refreshContents();
  }

  filterByCost(cost) {
    this.state.filters.cost = cost;
    this.refreshContents();
  }

  refreshContents() {
    if (this.state.purchase !== null) {
      this.fetchContents(this.state.purchase.id)
        .then(contents => {
          this.state.contents = contents;
          this.emitChange();
        })
        .catch(err => {
          console.log('Purchase contents could not be retrieved: ' + err)
        });
    }
  }

  resetFilters() {
    this.state.filters = {
      product: '',
      quantity: '',
      mUnitId: '',
      sold: '',
      stock: '',
      unitCost: '',
      cost: ''
    }
  }
}

const storeInstance = new PurchaseViewStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASES.VIEW.FETCH:
      storeInstance.fetchPurchase(action.purchaseId);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_PRODUCT_CHANGE:
      storeInstance.filterByProduct(action.product);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_QUANTITY_CHANGE:
      storeInstance.filterByQuantity(action.quantity);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_SOLD_CHANGE:
      storeInstance.filterBySold(action.sold);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_STOCK_CHANGE:
      storeInstance.filterByStock(action.stock);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_UNIT_COST_CHANGE:
      storeInstance.filterByUnitCost(action.unitCost);
      break;

    case ActionTypes.PURCHASES.VIEW.ON_FILTER_COST_CHANGE:
      storeInstance.filterByCost(action.cost);
      break;
  }
});

export default storeInstance;
