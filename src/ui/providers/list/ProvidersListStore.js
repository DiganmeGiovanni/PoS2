import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import { Provider } from '../../../model/entities';
const Sequelize = require('sequelize');

class ProvidersListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      providers: [],
      pageIdx: 0,
      pagesCount: 0,

      filters: {
        id: '',
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

  getState() {
    return this.activePage;
  }

  filterByName(name) {
    this.activePage.filters.name = name;
    this.page(1, 20)
  }

  filterById(id) {
    this.activePage.filters.id = id;
    this.page(1, 20);
  }

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    Provider.findAndCountAll({
      offset,
      limit: pageSize,
      where: this.makeConditions()
    }).then((result) => {
      this.activePage.providers = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }

  makeConditions() {
    let where = {};
    if (this.activePage.filters.id) {
      where.id = {
        [Sequelize.Op.like]: '%' + this.activePage.filters.id + '%'
      }
    }
    if (this.activePage.filters.name) {
      where.name = {
        [Sequelize.Op.like]: '%' + this.activePage.filters.name + '%'
      }
    }

    return where;
  }
}

const storeInstance = new ProvidersListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.PROVIDERS.LIST.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.PROVIDERS.LIST.FILTER_BY_ID:
      storeInstance.filterById(action.id);
      break;

    case ActionTypes.PROVIDERS.LIST.FILTER_BY_NAME:
      storeInstance.filterByName(action.name);
      break;

    default:
    // Do nothing
  }
});
export default storeInstance;
