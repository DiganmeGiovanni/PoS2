import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Existence, Provider, Purchase, PurchasePrice} from "../../../model/entities";
import sequelize from '../../../model/database';
const Sequelize = require('sequelize');

class PurchasesListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      purchases: [],
      pageIdx: 0,
      pagesCount: 0
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

  page(pageNumber, pageSize) {
    let sql = '\
      SELECT\
        purchase.id,\
        purchase.reinvestment,\
        purchase.investment,\
        purchase.date,\
        p.name                  AS provider_name\
      FROM purchase\
      INNER JOIN existence e\
        ON purchase.id = e.purchase_id\
      INNER JOIN purchase_price price\
        ON e.purchase_price_id = price.id\
      INNER JOIN provider p\
        ON price.provider_id = p.id\
      GROUP BY purchase.id \
      ORDER BY purchase.date DESC \
    ';

    // Prepare count sql
    let countSql = `SELECT COUNT(*) AS count FROM (${ sql }) SQ1`;

    // Append offset and limit
    sql += ' LIMIT :offset, :limit';

    // Get count
    sequelize.query(countSql, { type: Sequelize.QueryTypes.SELECT })
      .then(result => {
        this.activePage.pagesCount = Math.ceil(result[0].count / pageSize);

        // Get purchases
        sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
              offset: (pageNumber - 1) * pageSize,
              limit: pageSize,
            }
          })
          .then(purchases => {
            this.activePage.purchases = purchases;
            this.activePage.pageIdx = pageNumber;
            this.emitChange();
          })
          .catch(err => {
            console.error('Fail during purchases query: ' + err);
          })
      })
      .catch(err => {
        console.error('Fail during purchases count: ' + err);
      });
  }

  getState() {
    return this.activePage;
  }
}

const storeInstance = new PurchasesListStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASE.LIST:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;
  }
});

export default storeInstance;
