import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import { Brand } from '../../../model/entities';
const Sequelize = require('sequelize');

class BrandsListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'change';

    this.activePage = {
      brands: [],
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

  filterById(id) {
    this.activePage.filters.id = id;
    this.page(1, 20);
  }

  filterByName(name) {
    this.activePage.filters.name = name;
    this.page(1, 20)
  }

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    Brand.findAndCountAll({
      offset,
      limit: pageSize,
      where: this._makeConditions()
    }).then((result) => {
      this.activePage.brands = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }

  _makeConditions() {
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

const storeInstance = new BrandsListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.BRANDS.LIST.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.BRANDS.LIST.FILTER_BY_ID:
      storeInstance.filterById(action.id);
      break;

    case ActionTypes.BRANDS.LIST.FILTER_BY_NAME:
      storeInstance.filterByName(action.name);
      break;

    default:
      // Do nothing
  }
});

export default storeInstance;
