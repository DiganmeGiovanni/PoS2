import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import sequelize from '../../model/database';
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
        IFNULL(EXISTENCES.stock, 0) AS stock,\
        IFNULL(SALES.quantity, 0)   AS sold\
      FROM product PROD\
      INNER JOIN brand BRA\
        ON BRA.id = PROD.brand_id\
      INNER JOIN measurement_unit MU\
        ON MU.id = PROD.measurement_unit_id\
      LEFT JOIN (\
          SELECT\
            PROD.id  AS product_id,\
            COUNT(*) AS stock\
          FROM existence EXI\
          INNER JOIN purchase PUR\
            ON PUR.id = EXI.purchase_id\
          INNER JOIN product PROD\
            ON PROD.id = EXI.product_id\
          LEFT JOIN sale_has_existence SHE\
            ON SHE.existence_id = EXI.id\
          WHERE SHE.id IS NULL\
          AND PUR.date <= :date\
          GROUP BY PROD.id\
        ) EXISTENCES\
        ON EXISTENCES.product_id = PROD.id\
      LEFT JOIN (\
          SELECT\
            PROD.id  AS product_id,\
            COUNT(*) AS quantity\
          FROM existence EXI\
          INNER JOIN purchase PUR\
            ON PUR.id = EXI.purchase_id\
          INNER JOIN product PROD\
            ON PROD.id = EXI.product_id\
          LEFT JOIN sale_has_existence SHE\
            ON SHE.existence_id = EXI.id\
          WHERE SHE.id IS NOT NULL\
          AND PUR.date <= :date\
          GROUP BY PROD.id\
        ) SALES\
        ON SALES.product_id = PROD.id\
    ';
    let countSql = `SELECT COUNT(*) AS count FROM (${ sql }) SQ1`;

    // Append offset and limit
    sql += ' LIMIT :offset, :limit';

    // Get count
    sequelize
      .query(countSql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { date: new Date() }
      })
      .then(result => {
        this.activePage.pagesCount = Math.ceil(result.count / pageSize);

        sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          replacements: {
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize,
            date: new Date()
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
  }
});

export default storeInstance;
