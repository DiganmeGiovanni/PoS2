import { EventEmitter } from 'events';
import DValidator from '../../../services/ValidatorService';
import { Product } from '../../../model/entities';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';

class ProductCreateStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = "CHANGE_EVENT";

    this.state = ProductCreateStore.initialState();
  }

  static initialState(redirectToList) {
    return {
      redirectToList: !!redirectToList,
      product: {
        brand: {
          errMessage: '',
          value: null,
        },
        measurementUnit: {
          errMessage: '',
          value: null,
        },
        name: {
          errMessage: '',
          value: '',
        },
        code: {
          errMessage: '',
          value: '',
        },
        description: {
          errMessage: '',
          value: '',
        },
        minExistences: {
          value: '1',
          errMessage: ''
        },
      }
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

  onBrandChange(brand) {
    this.state.product.brand.value = brand;
    this.emitChange();
  }

  onMeasurementUnitChange(measurementUnit) {
    this.state.product.measurementUnit.value = measurementUnit;
    this.emitChange();
  }

  onNameChange(name) {
    this.state.product.name.value = name;
    this.emitChange();
  }

  onCodeChange(name) {
    this.state.product.code.value = name;
    this.emitChange();
  }

  onDescriptionChange(name) {
    this.state.product.description.value = name;
    this.emitChange();
  }

  onMinExistencesChange(name) {
    this.state.product.minExistences.value = name;
    this.emitChange();
  }

  save() {
    if (this._validate()) {
      let product = Product.build({
        name: this.state.product.name.value,
        code: this.state.product.code.value,
        description: this.state.product.description.value,
        minimalExistences: this.state.product.minExistences.value,
        brandId: this.state.product.brand.value.id,
        measurementUnitId: this.state.product.measurementUnit.value.id
      });

      product.save().then(() => {
        this.state = ProductCreateStore.initialState(true);
        this.emitChange();
      });
    } else {
      this.emitChange();
    }
  }

  setRedirectAsCompleted() {
    this.state.redirectToList = false;
  }

  _validate() {
    let formOk = true;

    if (!DValidator.isName(this.state.product.name.value)) {
      formOk = false;
      this.state.product.name.errMessage = 'El nombre es requerido';
    } else {
      this.state.product.name.errMessage = '';
    }

    if (!DValidator.isName(this.state.product.code.value)) {
      formOk = false;
      this.state.product.code.errMessage = 'El código es requerido';
    } else {
      this.state.product.code.errMessage = '';
    }

    if (this.state.product.brand.value === null) {
      formOk = false;
      this.state.product.brand.errMessage = 'Indique la marca del producto';
    } else {
      this.state.product.brand.errMessage = '';
    }

    if (this.state.product.measurementUnit.value === null) {
      formOk = false;
      this.state.product.measurementUnit.errMessage = 'Indique la unidad de medida basica';
    } else {
      this.state.product.measurementUnit.errMessage = '';
    }

    return formOk;
  }
}

const instance = new ProductCreateStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PRODUCTS.CREATE.ON_BRAND_CHANGE:
      instance.onBrandChange(action.brand);
      break;

    case ActionTypes.PRODUCTS.CREATE.ON_M_UNIT_CHANGE:
      instance.onMeasurementUnitChange(action.measurementUnit);
      break;

    case ActionTypes.PRODUCTS.CREATE.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.PRODUCTS.CREATE.ON_CODE_CHANGE:
      instance.onCodeChange(action.code);
      break;

    case ActionTypes.PRODUCTS.CREATE.ON_DESC_CHANGE:
      instance.onDescriptionChange(action.description);
      break;

    case ActionTypes.PRODUCTS.CREATE.ON_MIN_EXISTENCES_CHANGE:
      instance.onMinExistencesChange(action.minExistences);
      break;

    case ActionTypes.PRODUCTS.CREATE.SAVE:
      instance.save();
      break;

    case ActionTypes.PRODUCTS.CREATE.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
