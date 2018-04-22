import { EventEmitter } from 'events';
import PoSDispatcher from '../PoSDispatcher';
import ActionTypes from '../ActionTypes';
import { ProductModel } from "../../model/entities";

class PurchasePricesStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = {
      pModel: null,
      purchasePrices: []
    }
  }

  getState() {
    return this.state;
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

  fetchProductModel(pModelId) {
    ProductModel.findOne({ where: { id: pModelId }})
      .then(pModel => {
        this.state.pModel = pModel;
        this.emitChange();
      })
      .catch(() => {
        console.error('Product model could not be retrieved')
      });
  }
}

const storeInstance = new PurchasePricesStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASE_PRICES.FETCH_P_MODEL:
      storeInstance.fetchProductModel(action.pModelId);
      break;

    default:
      // Do nothing
  }
});

export default storeInstance;
