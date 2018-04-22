import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import DValidator from '../../services/ValidatorService';
import { MeasurementUnit } from '../../model/entities';
import FormGroup from '../components/form/FormGroup';

class MUnitsForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onAbbrChange = this.onAbbrChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);

    this.state = {
      abbr: {
        hasError: false,
        value: '',
      },
      name: {
        hasError: false,
        value: '',
      },
    };
  }

  onSubmitClick(evt, history) {
    evt.preventDefault();
    if (this.validate()) {
      const mUnit = this.props.mUnit;
      mUnit.name = this.state.name.value;
      mUnit.abbreviation = this.state.abbr.value;

      this.props.onSubmit(mUnit, history);
    }
  }

  onAbbrChange(evt) {
    this.setState({
      abbr: {
        value: evt.target.value,
      },
    });
  }

  onNameChange(evt) {
    this.setState({
      name: {
        value: evt.target.value,
      },
    });
  }

  validate() {
    let formOk = true;

    if (DValidator.isName(this.state.name.value)) {
      formOk = formOk && true;
    } else {
      formOk = formOk && false;
      this.setState({
        name: {
          hasError: true,
          value: this.state.name.value,
        },
      });
    }

    if (DValidator.nonEmpty(this.state.abbr.value)) {
      formOk = formOk && true;
    } else {
      formOk = formOk && false;
      this.setState({
        abbr: {
          hasError: true,
          value: this.state.abbr.value,
        },
      });
    }

    return formOk;
  }

  render() {
    return (
      <Route render={({ history }) => (
        <form onSubmit={evt => this.onSubmitClick(evt, history)}>
          <div className="row">
            <div className="col-xs-12">
              <FormGroup
                label={'Abreviatura'}
                name={'abbr'}
                type={'text'}
                errMessage={this.state.abbr.hasError
                  ? 'Ingrese una abreviatura valida'
                  : null
                }
                handleChange={this.onAbbrChange}
              />
            </div>
            <div className="col-xs-12">
              <FormGroup
                label={'Nombre'}
                name={'name'}
                type={'text'}
                errMessage={this.state.name.hasError
                  ? 'Ingrese un nombre valido'
                  : null
                }
                handleChange={this.onNameChange}
              />
            </div>
            <div className="col-xs-12 text-right">
              <button className="btn btn-success" type={'submit'}>
                <span>Crear</span>
              </button>
            </div>
          </div>
        </form>
      )}
      />
    );
  }
}

MUnitsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  mUnit: PropTypes.objectOf(MeasurementUnit).isRequired,
};

export default MUnitsForm;
