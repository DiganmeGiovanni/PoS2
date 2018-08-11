import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import sequelize from '../../../model/database';
import moment from "moment/moment";
const Sequelize = require('sequelize');

class ProductsListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      products: [],
      pageIdx: 0,
      pagesCount: 0,

      endDate: new Date(),
      filters: {
        code: '',
        name: '',
        brand: '',
        measurementUnit: ''
      }
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

  filterByCode(code) {
    this.activePage.filters.code = code;
    this.page(1, 20);
  }

  filterByName(name) {
    this.activePage.filters.name = name;
    this.page(1, 20);
  }

  filterByBrand(brand) {
    this.activePage.filters.brand = brand;
    this.page(1, 20);
  }

  filterByMeasurementUnit(measurementUnit) {
    this.activePage.filters.measurementUnit = measurementUnit;
    this.page(1, 20);
  }

  setEndDate(date) {
    this.activePage.endDate = date;
    this.page(this.activePage.pageIdx, 20);
  }

  page(pageNumber, pageSize) {
    let sql = '\
      SELECT\
        PROD.id                     AS id,\
        PROD.code                   AS code,\
        PROD.name                   AS name,\
        BRA.name                    AS brand_name,\
        MU.name                     AS measurement_unit_name,\
        PROD.minimal_existences,\
        PROD.existences             AS stock,\
        IFNULL(SALES.quantity, 0)   AS sold\
      FROM product PROD\
      INNER JOIN brand BRA\
        ON BRA.id = PROD.brand_id\
      INNER JOIN measurement_unit MU\
        ON MU.id = PROD.measurement_unit_id\
      LEFT JOIN (\
          SELECT\
            sale_price.product_id,\
            SUM(quantity) AS quantity\
          FROM sale_price\
          INNER JOIN sale_has_product s on sale_price.id = s.sale_price_id\
          GROUP BY sale_price.product_id\
        ) SALES\
        ON SALES.product_id = PROD.id\
    ';
    sql = this.appendConditions(sql);

    // Prepare count sql
    let countSql = `SELECT COUNT(*) AS count FROM (${ sql }) SQ1`;

    // Append offset and limit
    sql += ' ORDER BY name LIMIT :offset, :limit';

    // Get count
    sequelize
      .query(countSql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          code: '%' + this.activePage.filters.code + '%',
          name: '%' + this.activePage.filters.name + '%',
          brand: '%' + this.activePage.filters.brand + '%',
          measurementUnit: '%' + this.activePage.filters.measurementUnit + '%',
        }
      })
      .then(result => {
        this.activePage.pagesCount = Math.ceil(result[0].count / pageSize);

        sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          replacements: {
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize,
            date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),

            code: '%' + this.activePage.filters.code + '%',
            name: '%' + this.activePage.filters.name + '%',
            brand: '%' + this.activePage.filters.brand + '%',
            measurementUnit: '%' + this.activePage.filters.measurementUnit + '%',
          }
        })
        .then(products => {
          this.activePage.products = products;
          this.activePage.pageIdx = pageNumber;
          this.emitChange();
        })
        .catch(err => {
          console.error('Fail during products query: ' + err);
        })
      })
      .catch(err => {
        console.error('Fail during products count: ' + err);
      });
  }

  appendConditions(sql) {
    sql += " WHERE 1 = 1";

    if (this.activePage.filters.name !== '') {
      sql += " AND PROD.name LIKE :name";
    }

    if (this.activePage.filters.code !== '') {
      sql += " AND PROD.code LIKE :code";
    }

    if (this.activePage.filters.brand !== '') {
      sql += " AND BRA.name LIKe :brand";
    }

    if (this.activePage.filters.measurementUnit !== '') {
      sql += " AND MU.name LIKE :measurementUnit"
    }

    return sql;
  }

  getState() {
    return this.activePage;
  }
}

const storeInstance = new ProductsListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.PRODUCTS.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.PRODUCTS.SET_END_DATE:
      storeInstance.setEndDate(action.endDate);
      break;

    case ActionTypes.PRODUCTS.FILTER_BY_CODE:
      storeInstance.filterByCode(action.code);
      break;

    case ActionTypes.PRODUCTS.FILTER_BY_NAME:
      storeInstance.filterByName(action.name);
      break;

    case ActionTypes.PRODUCTS.FILTER_BY_BRAND:
      storeInstance.filterByBrand(action.brand);
      break;

    case ActionTypes.PRODUCTS.FILTER_BY_MEASUREMENT_UNIT:
      storeInstance.filterByMeasurementUnit(action.measurementUnit);
      break;
  }
});

export default storeInstance;
