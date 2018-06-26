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
        name: '',
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

  filterByName(name) {
    this.activePage.filters.name = name;
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
          name: '%' + this.activePage.filters.name + '%'
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
            name: '%' + this.activePage.filters.name + '%'
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
    if (this.activePage.filters.name === '') {
      return sql;
    }

    sql += " WHERE PROD.name LIKE :name ";
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

    case ActionTypes.PRODUCTS.FILTER_BY_NAME:
      storeInstance.filterByName(action.name);
      break;
  }
});

export default storeInstance;
