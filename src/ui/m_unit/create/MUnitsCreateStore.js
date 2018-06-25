import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { MeasurementUnit } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class MUnitsCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EVENT";

    this.state = MUnitsCreateStore.initialState();
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
      measurementUnit: {
        name: {
          value: '',
          error: ''
        },
        abbreviation: {
          value: '',
          error: ''
        }
      }
    }
  }

  onNameChange(name) {
    this.state.measurementUnit.name.value = name;
    this.emitChange();
  }

  onAbbrChange(abbr) {
    this.state.measurementUnit.abbreviation.value = abbr;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      let measurementUnit = MeasurementUnit.build({
        name: this.state.measurementUnit.name.value,
        abbreviation: this.state.measurementUnit.abbreviation.value
      });

      measurementUnit.save().then(() => {
        this.state = MUnitsCreateStore.initialState(true);
        this.emitChange();
      });
    }
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  _validate() {
    let formOk = true;

    if (!DValidator.isName(this.state.measurementUnit.name.value)) {
      formOk = false;
      this.state.measurementUnit.name.error = 'Ingrese un nombre valido';
      this.emitChange();
    } else {
      this.state.measurementUnit.name.error = '';
      this.emitChange();
    }

    if (!DValidator.isName(this.state.measurementUnit.abbreviation.value)) {
      formOk = false;
      this.state.measurementUnit.abbreviation.error = 'Ingrese una abreviación valida';
      this.emitChange();
    } else {
      this.state.measurementUnit.abbreviation.error = '';
      this.emitChange();
    }

    return formOk;
  }
}

const instance = new MUnitsCreateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.MEASUREMENT_UNITS.CREATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.MEASUREMENT_UNITS.CREATE.ON_ABBR_CHANGE:
      instance.onAbbrChange(action.abbr);
      break;

    case ActionTypes.MEASUREMENT_UNITS.CREATE.SAVE:
      instance.save();
      break;

    case ActionTypes.MEASUREMENT_UNITS.CREATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
