import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../components/form/FormGroup';

const BrandForm = ({ name, nameError, onNameChange, onSaveClicked, submitText }) => {
  return (
    <form onSubmit={ onSaveClicked }>
      <div className="row">
        <div className="col-xs-12">
          <FormGroup
            label='Nombre'
            name='name'
            type='text'
            handleChange={ onNameChange }
            errMessage={ nameError }
            inpProps={{ value: name }}
          />
        </div>
        <div className="col-xs-12 text-right">
          <button className="btn btn-success" type='submit'>
            <span>{ submitText ? submitText : 'Crear' }</span>
          </button>
        </div>
      </div>
    </form>
  )
};

BrandForm.propTypes = {
  name: PropTypes.string.isRequired,
  nameError: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onSaveClicked: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};

export default BrandForm;
