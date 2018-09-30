import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../../components/form/FormGroup';

const DatePicker = require('react-datetime');
import 'moment/locale/es';
import ProvidersAutosuggest from "../../components/autosuggesters/ProvidersAutosuggest";

const PurchaseForm = ({ date, onDateChange,
                         inpProviderValue, onProviderValueChange, onProviderSelected, providerError,
                         investment, investmentError, onInvestmentChange,
                         reinvestment, reinvestmentError, onReinvestmentChange }) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4 className="panel-title">Compra</h4>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group">
              <label className="control-label">Fecha</label>
              <br/>
                <DatePicker
                  dateFormat="DD MMMM, YYYY"
                  timeFormat={ false }
                  locale="es"
                  viewMode="years"
                  closeOnSelect={ true }
                  closeOnTab={ true }
                  onChange={ onDateChange }
                  value={ date }
                />
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <ProvidersAutosuggest
              onProviderSelected={ onProviderSelected }
              value={ inpProviderValue }
              onValueChange={ onProviderValueChange }
              error={ providerError }
            />
          </div>
          
          <div className="col-sm-6 col-md-3">
            <FormGroup
              label="Pago como inversión"
              name="payment_investment"
              type="text"
              handleChange={ onInvestmentChange }
              errMessage={ investmentError }
              inpProps={{ value: investment }}
            />
          </div>

          <div className="col-sm-6 col-md-3">
            <FormGroup
              label="Pago como reinversión"
              name="payment_reinvestment"
              type="text"
              handleChange={ onReinvestmentChange }
              errMessage={ reinvestmentError }
              inpProps={{ value: reinvestment }}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

PurchaseForm.propTypes = {
  date: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired,

  inpProviderValue: PropTypes.string.isRequired,
  onProviderValueChange: PropTypes.func.isRequired,
  onProviderSelected: PropTypes.func.isRequired,
  providerError: PropTypes.string,

  investment: PropTypes.string.isRequired,
  onInvestmentChange: PropTypes.func.isRequired,
  investmentError: PropTypes.string.isRequired,

  reinvestment: PropTypes.string.isRequired,
  onReinvestmentChange: PropTypes.func.isRequired,
  reinvestmentError: PropTypes.string.isRequired
};

export default PurchaseForm
