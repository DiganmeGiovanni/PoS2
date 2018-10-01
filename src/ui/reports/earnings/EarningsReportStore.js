import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import SaleService from '../../../services/SaleService';
import moment from 'moment';

class EarningsReportStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EARNINGS_REPORT";

    this.state = {
      startDate: new Date(2017, 1, 1),
      endDate: new Date(),

      totalSold: 0,
      totalEarnings: 0,
      totalSelfConsumption: 0,
      details: [],

      // Indicates if report is being generated on background
      generatingReport: false,

      showingModal: false,
      salePrices: []
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
    return this.state;
  }

  onStartDateChange(date) {
    this.state.startDate = date;
    this.emitChange();
  }

  onEndDateChange(date) {
    this.state.endDate = date;
    this.emitChange();
  }

  showSalePricesModal(detailsIndex) {
    this.state.showingModal = true;
    this.state.salePrices = this.state.details[detailsIndex].salePrices;

    this.emitChange();
  }

  onSalePricesModalClose() {
    this.state.showingModal = false;
    this.state.salePrices = [];

    this.emitChange();
  }

  generateReport() {
    this.state.generatingReport = true;
    this.emitChange();

    // Set hours to dates
    let mStartDate = moment(this.state.startDate);
    let mEndDate = moment(this.state.endDate);
    mStartDate.set({
      'hour': 0,
      'minute': 0,
      'second': 0
    });
    mEndDate.set({
      'hour': 23,
      'minute': 59,
      'second': 59
    });

    // Convert to date again
    mStartDate = mStartDate.toDate();
    mEndDate = mEndDate.toDate();

    SaleService.getEarningsReport(mStartDate, mEndDate, report => {
      this.state.totalSold = report.totalSold;
      this.state.totalEarnings = report.totalEarnings;
      this.state.details = report.details;
      this.state.generatingReport = false;

      // Compute self consumption debt
      SaleService.getSelfConsumptionDebpt(mStartDate, mEndDate, results => {
        this.state.totalSelfConsumption = results[0].self_consumption;

        this.emitChange();
      });
    });
  }
}

const store = new EarningsReportStore();
store.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.REPORTS.EARNINGS.ON_START_DATE_CHANGE:
      store.onStartDateChange(action.date);
      break;

    case ActionTypes.REPORTS.EARNINGS.ON_END_DATE_CHANGE:
      store.onEndDateChange(action.date);
      break;

    case ActionTypes.REPORTS.EARNINGS.ON_GENERATE_REPORT_CLICKED:
      store.generateReport();
      break;

    case ActionTypes.REPORTS.EARNINGS.ON_SHOW_SALE_PRICES_MODAL_CLICKED:
      store.showSalePricesModal(action.detailsIndex);
      break;

    case ActionTypes.REPORTS.EARNINGS.ON_CLOSE_SALE_PRICES_MODAL_CLICKED:
      store.onSalePricesModalClose();
      break;
  }
});

export default store;
