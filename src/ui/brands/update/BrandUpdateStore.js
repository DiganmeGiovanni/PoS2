import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { Brand } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class BrandUpdateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EVENT_PROVIDER_UPDATE";

    this.state = BrandUpdateStore.initialState();
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
        id: { value: null },
        name: {
          value: '',
          error: ''
        }
      }
    }
  }

  onIdChange(id) {
    this.state.brand.id.value = id;
    Brand.findById(id).then(brand => {
      this.state.brand.name.value = brand.name;
      this.state.brand.name.error = '';
      this.emitChange();
    });
  }

  onNameChange(name) {
    this.state.brand.name.value = name;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      Brand.findById(this.state.brand.id.value)
        .then(brand => {
          brand.name = this.state.brand.name.value;
          brand.save().then(() => {
            this.state = BrandUpdateStore.initialState(true);
            this.emitChange();
          });
        })
        .catch(err => {
          console.error(err);
          this.state.brand.id.error = 'Id invalido';
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

const instance = new BrandUpdateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.BRANDS.UPDATE.ON_ID_CHANGE:
      instance.onIdChange(action.id);
      break;

    case ActionTypes.BRANDS.UPDATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.BRANDS.UPDATE.SAVE:
      instance.save();
      break;

    case ActionTypes.BRANDS.UPDATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
