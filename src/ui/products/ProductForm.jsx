import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../components/form/FormGroup';
import BrandsAutosuggest from "../components/autosuggesters/BrandsAutosuggest";
import MeasurementUnitAutosuggest from "../components/autosuggesters/MeasurementUnitAutosuggest";

const ProductForm = ({ brandErr, onBrandChange, measurementUnitErr, onMeasurementUnitChange,
                        name, nameErr, onNameChange, code, codeErr, onCodeChange,
                        description, descriptionErr, onDescriptionChange,
                        minExistences, minExistencesErr, onMinExistencesChange,
                        submitText, onSaveClicked }) => {
  return (
    <form onSubmit={ onSaveClicked }>
      <div className="row">
        <div className="col-sm-6">
          <BrandsAutosuggest
            onBrandSelected={ onBrandChange }
            errMessage={ brandErr }
          />
        </div>
        <div className="col-sm-6">
          <MeasurementUnitAutosuggest
            onSuggestionSelected={ onMeasurementUnitChange }
            errMessage={ measurementUnitErr }
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <FormGroup
            label='Nombre'
            name='name'
            type='text'
            handleChange={ onNameChange }
            errMessage={ nameErr }
            inpProps={{ value: name }}
          />
        </div>
        <div className="col-sm-6">
          <FormGroup
            label='Código'
            name='name'
            type='text'
            handleChange={ onCodeChange }
            errMessage={ codeErr }
            inpProps={{ value: code }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <FormGroup
            label='Existencias minimas'
            name='min_existences'
            type='text'
            handleChange={ onMinExistencesChange }
            errMessage={ minExistencesErr }
            inpProps={{ value: minExistences }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12">
          <div className={`form-group${descriptionErr ? 'has-error' : ''}`}>
            <label htmlFor="inp-description"
                   className="control-label">
              Descripción
            </label>
            <textarea
              id="inp-description"
              name="description"
              className="form-control"
              rows="2"
              onChange={ onDescriptionChange }
              value={ description }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12 text-right">
          <button className="btn btn-success" type='submit'>
            <span>{ submitText ? submitText : 'Crear' }</span>
          </button>
        </div>
      </div>
    </form>
  )
};

ProductForm.propTypes = {
  brandErr: PropTypes.string.isRequired,
  onBrandChange: PropTypes.func.isRequired,

  measurementUnitErr: PropTypes.string.isRequired,
  onMeasurementUnitChange: PropTypes.func.isRequired,

  name: PropTypes.string.isRequired,
  nameErr: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,

  code: PropTypes.string.isRequired,
  codeErr: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,

  description: PropTypes.string.isRequired,
  descriptionErr: PropTypes.string.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,

  minExistences: PropTypes.string.isRequired,
  minExistencesErr: PropTypes.string.isRequired,
  onMinExistencesChange: PropTypes.func.isRequired,

  onSaveClicked: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};

export default ProductForm;
