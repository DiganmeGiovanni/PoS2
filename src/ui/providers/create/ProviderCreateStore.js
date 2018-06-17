import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { Provider } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class ProviderCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE";

    this.state = ProviderCreateStore.initialState();
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
        name: {
          value: '',
          error: ''
        }
      }
    }
  }

  onNameChange(name) {
    this.state.provider.name.value = name;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      let provider = Provider.build({
        name: this.state.provider.name.value
      });

      provider.save().then(() => {
        this.state = ProviderCreateStore.initialState(true);
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

const instance = new ProviderCreateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PROVIDERS.CREATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.PROVIDERS.CREATE.SAVE:
      instance.save();
      break;

    case ActionTypes.PROVIDERS.CREATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
