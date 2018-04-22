import React from 'react';
import FormGroup from "../components/form/FormGroup";
import { Route } from "react-router-dom";
import ProvidersAutosuggest from "../components/autosuggesters/ProvidersAutosuggest";
import DValidator from "../../services/ValidatorService";

class PurchasePricesForm extends React.Component {
  constructor(props) {
    super(props);
    this.onProviderChange = this.onProviderChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onMinQuantityChange = this.onMinQuantityChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);

    this.state = {
      provider: {
        errMessage: null,
        hasError: false,
        value: null
      },
      date: {
        errMessage: null,
        hasError: false,
        value: new Date().toISOString()
      },
      minQuantity: {
        errMessage: null,
        hasError: false,
        value: null
      },
      price: {
        errMessage: null,
        hasError: false,
        value: null
      }
    }
  }

  onProviderChange(evt, { suggestion }) {
    this.setState({ provider: { value: suggestion }});
  }

  onDateChange(value, formattedValue) {
    console.log('Chosen value: ' + value);
    console.log('Chosen value (formatted): ' + formattedValue);
  }

  onMinQuantityChange(evt) {
    this.setState({ minQuantity: { value: evt.target.value }});
  }

  onPriceChange(evt) {
    this.setState({ price: { value: evt.target.value }});
  }

  onSubmitClicked(evt, history) {
    evt.preventDefault();
    if (this.validate()) {

    }
  }

  validate() {
    let formOk = true;

    if (this.state.provider.value === null) {
      formOk = false;
      this.setState({
        provider: {
          hasError: true,
          errMessage: 'Indique el proveedor'
        }
      });
    }

    if (!DValidator.nonEmpty(this.state.date.value)) {
      formOk = false;
      this.setState({
        date: {
          hasError: true,
          errMessage: 'Indique la fecha'
        }
      });
    }

    if (!DValidator.isNumber(this.state.minQuantity.value)) {
      formOk = false;
      this.setState({
        minQuantity: {
          hasError: true,
          errMessage: 'Indique la cantidad minima'
        }
      });
    }

    if (!DValidator.isNumber(this.state.price.value)) {
      formOk = false;
      this.setState({
        price: {
          hasError: true,
          errMessage: 'Indique el precio de compra'
        }
      });
    }

    return formOk;
  }

  render() {
    return (
      <Route render={({ history }) => (
        <form onSubmit={evt => this.onSubmitClicked(evt, history)}>
          <div className="row">
            <div className="col-sm-6">
              <ProvidersAutosuggest
                onProviderSelected={ this.onProviderChange }
                errMessage={ this.state.provider.errMessage }
              />
            </div>
            <div className="col-sm-6">
              <div className={`form-group${ this.state.date.hasError ? 'has-error' : ''}`}>
                <label htmlFor="inp-date" className="control-label">Fecha</label>

                <br/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <FormGroup
                label="Cantidad minima"
                name="min_quantity"
                type="text"
                handleChange={ this.onMinQuantityChange }
                errMessage={ this.state.minQuantity.errMessage }
              />
            </div>
            <div className="col-sm-6">
              <FormGroup
                label='Precio'
                name='price'
                type='text'
                handleChange={ this.onPriceChange }
                errMessage={ this.state.price.errMessage }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 text-right">
              <button className="btn btn-success" type="submit">
                <span>Registrar</span>
              </button>
            </div>
          </div>
        </form>
      )} />
    )
  }
}

export default PurchasePricesForm
