import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import { Provider } from '../../model/entities';

class ProvidersListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      providers: [],
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

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    Provider.findAndCountAll({
      offset,
      limit: pageSize,
    }).then((result) => {
      this.activePage.providers = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }

  getState() {
    return this.activePage;
  }
}

const storeInstance = new ProvidersListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.PROVIDERS.LIST:
      Provider.findAll().then((providers) => {
        storeInstance.currentPage = providers;
        storeInstance.emitChange();
      });
      break;

    case ActionTypes.PROVIDERS.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    default:
    // Do nothing
  }
});
export default storeInstance;
