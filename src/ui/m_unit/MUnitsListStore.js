import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import { MeasurementUnit } from '../../model/entities';

class MUnitsListStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.activePage = {
      mUnits: [],
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
    MeasurementUnit.findAndCountAll({
      offset,
      limit: pageSize,
    }).then((result) => {
      this.activePage.mUnits = result.rows;
      this.activePage.pageIdx = pageNumber;
      this.activePage.pagesCount = Math.ceil(result.count / pageSize);
      this.emitChange();
    });
  }

  getState() {
    return this.activePage;
  }
}

const storeInstance = new MUnitsListStore();
storeInstance.dispatchToken = PoSDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.MEASUREMENT_UNITS.PAGE:
      storeInstance.page(action.pageNumber, action.pageSize);
      break;

    default:
      // Do nothing
  }
});

export default storeInstance;
