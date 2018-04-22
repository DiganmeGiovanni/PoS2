import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import { Brand } from '../../model/entities';

class BrandsListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'change';

    this.activePage = {
      brands: [],
      pageIdx: 0,
      pagesCount: 0,
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
    const offset = (pageNumber - 1) * pageSize;
    Brand.findAndCountAll({
      offset,
      limit: pageSize,
    }).then((result) => {
      this.activePage.brands = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }
}

const storeInstance = new BrandsListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.BRANDS.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    default:
      // Do nothing
  }
});

export default storeInstance;
