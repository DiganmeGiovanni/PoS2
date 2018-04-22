import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import DValidator from '../../services/ValidatorService';
import { Provider } from '../../model/entities';
import FormGroup from '../components/form/FormGroup';

class ProvidersForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onNameChange = this.onNameChange.bind(this);

    this.state = {
      name: {
        hasError: false,
        value: '',
      },
    };
  }

  onSubmitClick(evt, history) {
    evt.preventDefault();
    if (this.validate()) {
      const provider = this.props.provider;
      provider.name = this.state.name.value;

      this.props.onSubmit(provider, history);
    }
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

    return formOk;
  }

  render() {
    return (
      <Route render={({ history }) => (
        <form onSubmit={evt => this.onSubmitClick(evt, history)}>
          <div className="row">
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

ProvidersForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  provider: PropTypes.objectOf(Provider).isRequired,
};

export default ProvidersForm;
