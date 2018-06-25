import { EventEmitter } from 'events';
import DValidator from "../../../services/ValidatorService";
import { MeasurementUnit } from "../../../model/entities";
import PoSDispatcher from "../../PoSDispatcher";
import ActionTypes from "../../ActionTypes";

class MUnitsUpdateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EVENT";

    this.state = MUnitsUpdateStore.initialState();
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
        id: { value: null },
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

  onIdChange(id) {
    this.state.measurementUnit.id.value = id;
    MeasurementUnit.findById(id).then(measurementUnit => {
      this.state.measurementUnit.name.value = measurementUnit.name;
      this.state.measurementUnit.name.error = '';
      this.state.measurementUnit.abbreviation.value = measurementUnit.abbreviation;
      this.state.measurementUnit.abbreviation.error = '';
      this.emitChange();
    });
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
      MeasurementUnit.findById(this.state.measurementUnit.id.value)
        .then(measurementUnit => {
          measurementUnit.name = this.state.measurementUnit.name.value;
          measurementUnit.abbreviation = this.state.measurementUnit.abbreviation.value;
          measurementUnit.save().then(() => {
            this.state = MUnitsUpdateStore.initialState(true);
            this.emitChange();
          });
        })
        .catch(err => {
          console.error(err);
          this.state.measurementUnit.id.error = 'Id invalido';
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

const instance = new MUnitsUpdateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_ID_CHANGE:
      instance.onIdChange(action.id);
      break;

    case ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_ABBR_CHANGE:
      instance.onAbbrChange(action.abbr);
      break;

    case ActionTypes.MEASUREMENT_UNITS.UPDATE.SAVE:
      instance.save();
      break;

    case ActionTypes.MEASUREMENT_UNITS.UPDATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
