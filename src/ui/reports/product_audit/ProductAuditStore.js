import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import ProductService from '../../../services/ProductService';

class ProductAuditStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_AUDIT_STORE";

    this.state = {
      form: {
        product: {
          value: null,
          autocompleteValue: '',
          error: '',
        },
        startDate: new Date(2017, 2, 1),
        endDate: new Date(),
        operationsType: '0'
      },

      operations: [],
      purchasesTotal: 0,
      salesTotal: 0,
      gain: 0,

      showingModal: false,
      modalOperationType: '0',
      modalOperationId: 0,
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

  onProductAutocompleteValueChange(value) {
    this.state.form.product.autocompleteValue = value;
    this.emitChange();
  }

  onProductSelected(product) {
    this.state.form.product.value = product;
    this.state.form.product.error = '';
    this.emitChange();
  }

  onStartDateChange(date) {
    this.state.form.startDate = date;
    this.emitChange();
  }

  onEndDateChange(date) {
    this.state.form.endDate = date;
    this.emitChange();
  }

  onOperationsTypeChange(operationsType) {
    this.state.form.operationsType = operationsType;
    this.emitChange();
  }

  generateReport() {
    if (this.validate()) {

      // Query for all product operations
      ProductService.auditProduct(
        this.state.form.product.value.id,
        this.state.form.startDate,
        this.state.form.endDate,
        this.state.form.operationsType,
        dbResponse => {
          this.state.operations = dbResponse[0];

          // Calculate purchases's total
          ProductService.totalPurchases(
            this.state.form.product.value.id,
            this.state.form.startDate,
            this.state.form.endDate,
            dbResponse => {
              this.state.purchasesTotal = dbResponse[0][0].total;

              // Query for sale's total
              ProductService.totalSales(
                this.state.form.product.value.id,
                this.state.form.startDate,
                this.state.form.endDate,
                dbResponse => {
                  this.state.salesTotal = dbResponse[0][0].total;
                  this.state.gain = this.state.salesTotal - this.state.purchasesTotal;

                  this.emitChange();
                }
              )
            }
          );
        }
      )
    } else {
      this.emitChange();
    }
  }

  onViewDetailsClicked(operationType, operationId) {
    this.state.showingModal = true;
    this.state.modalOperationType = operationType;
    this.state.modalOperationId = operationId;
    this.emitChange();
  }

  onDetailsModalCloseClicked() {
    this.state.showingModal = false;
    this.state.modalOperationType = '0';
    this.state.modalOperationId = 0;
    this.emitChange();
  }

  validate() {
    let formOk = true;

    if (this.state.form.product.value == null) {
      formOk = false;
      this.state.form.product.error = 'Seleccione un producto';
    }

    return formOk;
  }
}

const store = new ProductAuditStore();
store.dispatchToken= PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.REPORTS.PAUDIT.ON_PRODUCT_AUTO_COMPLETE_VALUE_CHANGE:
      store.onProductAutocompleteValueChange(action.value);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_PRODUCT_SELECTED:
      store.onProductSelected(action.product);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_START_DATE_CHANGE:
      store.onStartDateChange(action.date);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_END_DATE_CHANGE:
      store.onEndDateChange(action.date);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_OPERATIONS_TYPE_CHANGE:
      store.onOperationsTypeChange(action.operationsType);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_GENERATE_REPORT_CLICKED:
      store.generateReport();
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_VIEW_DETAIL_CLICKED:
      store.onViewDetailsClicked(action.operationType, action.operationId);
      break;

    case ActionTypes.REPORTS.PAUDIT.ON_DETAIL_MODAL_CLOSE_CLICKED:
      store.onDetailsModalCloseClicked();
      break;
  }
});

export default store;
