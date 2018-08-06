import {EventEmitter} from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import sequelize from '../../../model/database';
import DateFormatter from "../../../services/DateFormatter";

const Sequelize = require('sequelize');

class SalesListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      sales: [],
      pageIdx: 0,
      pagesCount: 0,
      filters: {
        id: '',
        date: '',
        total: ''
      }
    }
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

  static appendOffsetAndOrder(sql) {
    sql += ' ORDER BY date DESC LIMIT :offset, :limit';
    return sql;
  }

  static makeSalesQuery() {
    return '\
      SELECT *\
      FROM sale\
      WHERE 1 = 1\
    ';
  }

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;

    // Prepare query and conditions
    let sql = SalesListStore.makeSalesQuery();
    sql = this.appendConditions(sql);

    // Prepare count sql
    let countSql = `SELECT COUNT(*) AS count FROM (${ sql }) SQ1`;

    // Append limit and order
    sql = SalesListStore.appendOffsetAndOrder(sql);

    // Count results
    sequelize
      .query(countSql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          offset,
          limit: pageSize,
          id: this.activePage.filters.id,
          formattedDate: DateFormatter.asDateOnly(this.activePage.filters.date),
          total: this.activePage.filters.total * 1
        }
      })
      .then(result => {
        this.activePage.pagesCount = Math.ceil(result[0].count / pageSize);

        // Get sales
        sequelize
          .query(sql, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
              offset,
              limit: pageSize,
              id: this.activePage.filters.id,
              formattedDate: DateFormatter.asDateOnly(this.activePage.filters.date),
              total: this.activePage.filters.total * 1
            }
          })
          .then(sales => {
            this.activePage.sales = sales;
            this.activePage.pageIdx = pageNumber;
            this.emitChange();
          });
      })
      .catch(err => {
        console.error('Sales querying error: ' + err);
      });
  }

  appendConditions(sql) {
    if (this.activePage.filters.id !== '') {
      sql += ' AND id = :id';
    }

    if (this.activePage.filters.date !== '') {
      sql += ' AND strftime(\'%Y-%m-%d\', datetime(date, \'-5 hours\')) = :formattedDate';
    }

    if (this.activePage.filters.total !== '') {
      sql += ' AND ROUND(total, 2) = :total';
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

  filterByTotal(total) {
    this.activePage.filters.total = total;
    this.page(1, 20);
  }
}

const storeInstance = new SalesListStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SALES.LIST.ALL:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.SALES.LIST.ON_FILTER_ID_CHANGE:
      storeInstance.filterById(action.id);
      break;

    case ActionTypes.SALES.LIST.ON_FILTER_DATE_CHANGE:
      storeInstance.filterByDate(action.date);
      break;

    case ActionTypes.SALES.LIST.ON_FILTER_TOTAL_CHANGE:
      storeInstance.filterByTotal(action.total);
      break;
  }
});

export default storeInstance;
