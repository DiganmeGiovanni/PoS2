import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { Brand } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class BrandCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE";

    this.state = BrandCreateStore.initialState();
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

  static initialState(redirectToList) {
    return {
      redirectToList: !!redirectToList,
      brand: {
        name: {
          value: '',
          error: ''
        }
      }
    }
  }

  onNameChange(name) {
    this.state.brand.name.value = name;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      let brand = Brand.build({
        name: this.state.brand.name.value
      });

      brand.save().then(() => {
        this.state = BrandCreateStore.initialState(true);
        this.emitChange();
      });
    }
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  _validate() {
    let formOk = true;

    if (!DValidator.isName(this.state.brand.name.value)) {
      formOk = false;
      this.state.brand.name.error = 'Ingrese un nombre valido';
      this.emitChange();
    }

    return formOk;
  }
}

const instance = new BrandCreateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.BRANDS.CREATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.BRANDS.CREATE.SAVE:
      instance.save();
      break;

    case ActionTypes.BRANDS.CREATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
