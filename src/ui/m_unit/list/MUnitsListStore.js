import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import { MeasurementUnit } from '../../../model/entities';
const Sequelize = require('sequelize');

class MUnitsListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      mUnits: [],
      pageIdx: 0,
      pagesCount: 0,

      filters: {
        id: '',
        name: '',
        abbr: ''
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
    this.page(1, 20);
  }

  filterByAbbr(abbr) {
    this.activePage.filters.abbr = abbr;
    this.page(1, 20);
  }

  page(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    MeasurementUnit.findAndCountAll({
      offset,
      limit: pageSize,
      where: this._makeConditions()
    }).then((result) => {
      this.activePage.mUnits = result.rows;
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
    if (this.activePage.filters.abbr) {
      where.abbreviation = {
        [Sequelize.Op.like]: '%' + this.activePage.filters.abbr + '%'
      }
    }

    return where;
  }
}

const storeInstance = new MUnitsListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.MEASUREMENT_UNITS.LIST.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    case ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_ID:
      storeInstance.filterById(action.id);
      break;

    case ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_NAME:
      storeInstance.filterByName(action.name);
      break;

    case ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_ABBR:
      storeInstance.filterByAbbr(action.abbr);
      break;
  }
});

export default storeInstance;
