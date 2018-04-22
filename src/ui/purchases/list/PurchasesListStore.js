import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Existence, Purchase} from "../../../model/entities";
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
    const offset = (pageNumber - 1) * pageSize;
    Purchase.findAndCountAll({
      offset,
      limit: pageSize,
      order: [
        ['date', 'DESC']
      ],
    }).then((result) => {
      this.activePage.purchases = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
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
