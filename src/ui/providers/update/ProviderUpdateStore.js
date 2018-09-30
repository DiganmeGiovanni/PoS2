import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { Provider } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class ProviderUpdateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EVENT_PROVIDER_UPDATE";

    this.state = ProviderUpdateStore.initialState();
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
      provider: {
        id: { value: null },
        name: {
          value: 'Demo',
          error: ''
        }
      }
    }
  }

  onIdChange(id) {
    this.state.provider.id.value = id;
    Provider.findById(id).then(provider => {
      this.state.provider.name.value = provider.name;
      this.state.provider.name.error = '';
      this.emitChange();
    });
  }

  onNameChange(name) {
    this.state.provider.name.value = name;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      Provider.findById(this.state.provider.id.value)
        .then(provider => {
          provider.name = this.state.provider.name.value;
          provider.save().then(() => {
            this.state = ProviderUpdateStore.initialState(true);
            this.emitChange();
          });
        })
        .catch(err => {
          console.error(err);
          this.state.provider.id.error = 'Id invalido';
          this.emitChange();
        });
    }
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  _validate() {
    let formOk = true;

    if (!DValidator.isName(this.state.provider.name.value)) {
      formOk = false;
      this.state.provider.name.error = 'Ingrese un nombre valido';
      this.emitChange();
    }

    return formOk;
  }
}

const instance = new ProviderUpdateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PROVIDERS.UPDATE.ON_ID_CHANGE:
      instance.onIdChange(action.id);
      break;

    case ActionTypes.PROVIDERS.UPDATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.PROVIDERS.UPDATE.SAVE:
      instance.save();
      break;

    case ActionTypes.PROVIDERS.UPDATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
