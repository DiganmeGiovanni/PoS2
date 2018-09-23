import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Existence, Provider, Purchase, PurchasePrice} from "../../../model/entities";
import sequelize from '../../../model/database';
import DateFormatter from "../../../services/DateFormatter";
import DateService from "../../../services/DateService";
const Sequelize = require('sequelize');

class PurchasesListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      purchases: [],
      pageIdx: 0,
      pagesCount: 0,
      filters: {
        id: '',
        date: '',
        provider: '',
        investment: '',
        reinvestment: '',
        total: ''
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

  getState() {
    return this.activePage;
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
      INNER JOIN purchase_has_product php\
        ON purchase.id = php.purchase_id\
      INNER JOIN purchase_price price\
        ON php.purchase_price_id = price.id\
      INNER JOIN provider p\
        ON price.provider_id = p.id\
    ';
    sql = this.appendConditions(sql);
    sql += ' GROUP BY purchase.id ORDER BY purchase.date DESC ';

    // Prepare count sql
    let countSql = `SELECT COUNT(*) AS count FROM (${ sql }) SQ1`;

    // Append offset and limit
    sql += ' LIMIT :offset, :limit';

    // Get count
    sequelize
      .query(countSql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          id: this.activePage.filters.id,
          formattedDate: DateFormatter.asDateOnly(this.activePage.filters.date),
          provider: '%' + this.activePage.filters.provider + '%',
          investment: this.activePage.filters.investment,
          reinvestment: this.activePage.filters.reinvestment,
          total: this.activePage.filters.total
        }
      })
      .then(result => {
        this.activePage.pagesCount = Math.ceil(result[0].count / pageSize);

        // Get purchases
        sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
              offset: (pageNumber - 1) * pageSize,
              limit: pageSize,
              id: this.activePage.filters.id,
              formattedDate: DateFormatter.asDateOnly(this.activePage.filters.date),
              provider: '%' + this.activePage.filters.provider + '%',
              investment: this.activePage.filters.investment * 1,
              reinvestment: this.activePage.filters.reinvestment * 1,
              total: this.activePage.filters.total * 1
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

  appendConditions(sql) {
    sql += ' WHERE 1 = 1 ';

    if (this.activePage.filters.id) {
      sql += " AND purchase.id = :id "
    }

    if (this.activePage.filters.date !== '') {
      sql += ` AND ${ DateService.fromSQLiteUtcToLocal('purchase.date', true) } = :formattedDate`;
    }

    if (this.activePage.filters.provider !== '') {
      sql += " AND p.name LIKE :provider "
    }

    if (this.activePage.filters.investment !== '') {
      sql += " AND investment = :investment "
    }

    if (this.activePage.filters.reinvestment !== '') {
      sql += " AND reinvestment = :reinvestment "
    }

    if (this.activePage.filters.total !== '') {
      sql += " AND (reinvestment + investment) = :total "
    }

    return sql;
  }

  filterById(id) {
    this.activePage.filters.id = id;
    this.page(1, 20);
  }

  filterByDate(date) {
    this.activePage.filters.date = date;
    this.page(1, 20);
  }

  filterByProvider(provider) {
    this.activePage.filters.provider = provider;
    this.page(1, 20);
  }

  filterByInvestment(investment) {
    this.activePage.filters.investment = investment;
    this.page(1, 20);
  }

  filterByReinvestment(reinvestment) {
    this.activePage.filters.reinvestment = reinvestment;
    this.page(1, 20);
  }

  filterByTotal(total) {
    this.activePage.filters.total = total;
    this.page(1, 20);
  }
}

const storeInstance = new PurchasesListStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASES.LIST.LIST:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_ID_CHANGE:
      storeInstance.filterById(action.id);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_DATE_CHANGE:
      storeInstance.filterByDate(action.date);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_PROVIDER_CHANGE:
      storeInstance.filterByProvider(action.provider);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_INVESTMENT_CHANGE:
      storeInstance.filterByInvestment(action.investment);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_REINVESTMENT_CHANGE:
      storeInstance.filterByReinvestment(action.reinvestment);
      break;

    case ActionTypes.PURCHASES.LIST.ON_FILTER_TOTAL_CHANGE:
      storeInstance.filterByTotal(action.total);
      break;
  }
});

export default storeInstance;
