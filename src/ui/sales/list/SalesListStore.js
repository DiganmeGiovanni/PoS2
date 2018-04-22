import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import { Sale } from "../../../model/entities";

class SalesListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      sales: [],
      pageIdx: 0,
      pagesCount: 0
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

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    Sale.findAndCountAll({
      offset,
      limit: pageSize,
      order: [
        ['date', 'DESC']
      ],
    }).then((result) => {
      this.activePage.sales = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }
}

const storeInstance = new SalesListStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SALES.LIST:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;
  }
});

export default storeInstance;
