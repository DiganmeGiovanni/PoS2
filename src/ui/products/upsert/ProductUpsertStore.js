import { EventEmitter } from 'events';
import DValidator from '../../../services/ValidatorService';
import {Brand, MeasurementUnit, Product} from '../../../model/entities';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';

class ProductUpsertStore extends EventEmitter {
  constructor() {
      super();
      this.CHANGE_EVENT = "CHANGE_EVENT";

      this.state = ProductUpsertStore.initialState();
  }

  static initialState(redirectToList) {
    return {
      redirectToList: !!redirectToList,
      product: {
        id: { value: null },
        brand: {
          errMessage: '',
          value: null,
          inpValue: '',
        },
        measurementUnit: {
          errMessage: '',
          value: null,
          inpValue: '',
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
          errMessage: '',
        },
      },
    };
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

  onIdChange(id) {
    this.state.product.id.value = id;
    Product.findOne({
      where: { id: id },
      include: [
        {
          model: MeasurementUnit,
          as: 'measurementUnit'
        },
        {
          model: Brand,
          as: 'brand'
        }
      ]
    })
      .then(product => {
        this.state.product.brand.value = product.brand;
        this.state.product.brand.inpValue = product.brand.name;
        this.state.product.measurementUnit.value = product.measurementUnit;
        this.state.product.measurementUnit.inpValue = product.measurementUnit.name;
        this.state.product.name.value = product.name;
        this.state.product.code.value = product.code;
        this.state.product.description.value = product.description;
        this.state.product.minExistences.value = product.minimalExistences + '';
        this.emitChange();
      });
  }

  onBrandChange(brand) {
    this.state.product.brand.value = brand;
    this.state.product.brand.inpValue = brand.name;
    this.emitChange();
  }

  onBrandInpValueChange(value) {
    if (typeof value !== 'undefined') {
      this.state.product.brand.inpValue = value;
      this.emitChange();
    }
  }

  onMeasurementUnitChange(measurementUnit) {
    this.state.product.measurementUnit.value = measurementUnit;
    this.state.product.measurementUnit.inpValue = measurementUnit.name;
    this.emitChange();
  }

  onMeasurementUnitInpValueChange(value) {
    if (typeof value !== 'undefined') {
      this.state.product.measurementUnit.inpValue = value;
      this.emitChange();
    }
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
      if (this.state.product.id.value === null) {
        this.insert();
      } else {
        this.update();
      }
    } else {
      this.emitChange();
    }
  }

  insert() {
    const product = Product.build({
      name: this.state.product.name.value,
      code: this.state.product.code.value,
      description: this.state.product.description.value,
      minimalExistences: this.state.product.minExistences.value,
      brandId: this.state.product.brand.value.id,
      measurementUnitId: this.state.product.measurementUnit.value.id
    });

    product.save().then(() => {
      this.state = ProductUpsertStore.initialState(true);
      this.emitChange();
    });
  }

  update() {
    Product.findById(this.state.product.id.value)
      .then(product => {
        product.name = this.state.product.name.value;
        product.code = this.state.product.code.value;
        product.description = this.state.product.description.value;
        product.minimalExistences = this.state.product.minExistences.value;
        product.brandId = this.state.product.brand.value.id;
        product.measurementUnitId = this.state.product.measurementUnit.value.id

        product.save().then(() => {
          this.state = ProductUpsertStore.initialState(true);
          this.emitChange();
        });
      })
      .catch(err => {
        console.error(err);
        this.state.product.id.error = 'Id invalido';
        this.emitChange();
      });
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

    if (!DValidator.isNumber(this.state.product.minExistences.value)) {
      formOk = false;
      this.state.product.minExistences.errMessage = 'Ingrese una cantidad valida';
    } else {
      this.state.product.minExistences.errMessage = '';
    }

    if (this.state.product.brand.value === null) {
      formOk = false;
      this.state.product.brand.errMessage = 'Indique la marca del producto';
    } else if (this.state.product.brand.value.name !== this.state.product.brand.inpValue) {
      formOk = false;
      this.state.product.brand.errMessage = 'Elija una marca para el producto';
    } else {
      this.state.product.brand.errMessage = '';
    }

    if (this.state.product.measurementUnit.value === null) {
      formOk = false;
      this.state.product.measurementUnit.errMessage = 'Indique la unidad de medida basica';
    } else if (this.state.product.measurementUnit.value.name !== this.state.product.measurementUnit.inpValue) {
      formOk = false;
      this.state.product.measurementUnit.errMessage = 'Elija una unidad de medida para el producto';
    } else {
      this.state.product.measurementUnit.errMessage = '';
    }

    return formOk;
  }
}

const instance = new ProductUpsertStore();
instance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PRODUCTS.UPSERT.ON_ID_CHANGE:
      instance.onIdChange(action.id);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_BRAND_CHANGE:
      instance.onBrandChange(action.brand);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_BRAND_INP_VALUE_CHANGE:
      instance.onBrandInpValueChange(action.value);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_M_UNIT_CHANGE:
      instance.onMeasurementUnitChange(action.measurementUnit);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_M_UNIT_INP_VALUE_CHANGE:
      instance.onMeasurementUnitInpValueChange(action.value);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_NAME_CHANGE:
      instance.onNameChange(action.name);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_CODE_CHANGE:
      instance.onCodeChange(action.code);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_DESC_CHANGE:
      instance.onDescriptionChange(action.description);
      break;

    case ActionTypes.PRODUCTS.UPSERT.ON_MIN_EXISTENCES_CHANGE:
      instance.onMinExistencesChange(action.minExistences);
      break;

    case ActionTypes.PRODUCTS.UPSERT.SAVE:
      instance.save();
      break;

    case ActionTypes.PRODUCTS.UPSERT.SET_REDIRECT_AS_COMPLETED:
      instance.setRedirectAsCompleted();
      break;
  }
});

export default instance;
