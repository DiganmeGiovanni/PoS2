import React from 'react';
import SaleProductForm from './SaleProductForm';
import PropTypes from 'prop-types';

const DatePicker = require('react-datetime');
import 'moment/locale/es';
import SaleContents from "./SaleContents";

const SaleForm = ({
                    date,
                    dateError,
                    onDateChange,
                    productAutocompleteValue,
                    onProductAutoCompleteValueChange,
                    onProductSelected,
                    productAutocompleteError,
                    quantity,
                    quantityError,
                    onQuantityChange,
                    stock,
                    onSelfConsumptionChange,
                    selfConsumption,
                    cost,
                    price,
                    priceError,
                    onPriceChange,
                    lastPrice,
                    totalPrice,
                    onAddProductClicked,
                    contents,
                    total,
                    onSaveClicked,
                    error, }) => {

  return (
    <div className="container">
      <h1>Registrar venta</h1>
      <br/>

      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">Venta</div>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <div className="control-label">Fecha</div>
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
          </div>

          {/* Add product form as a panel */}
          <SaleProductForm
            productAutocompleteValue={ productAutocompleteValue }
            onProductAutoCompleteValueChange={ onProductAutoCompleteValueChange }
            onProductSelected={ onProductSelected }
            quantity={ quantity }
            quantityError={ quantityError }
            onQuantityChange={ onQuantityChange }
            stock={ stock }
            onSelfConsumptionChange={ onSelfConsumptionChange }
            selfConsumption={ selfConsumption }
            cost={ cost }

            price={ price }
            priceError={ priceError }
            onPriceChange={ onPriceChange }
            lastPrice={ lastPrice }

            totalPrice={ totalPrice }
            onAddProductClicked={ onAddProductClicked }
            productAutocompleteError={ productAutocompleteError }
          />
        </div>

        {/* Sale contents */}
        <div className="col-md-8">
          <SaleContents contents={ contents } total={ total } error={ error }/>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12 text-center margin-top-16 padding-bottom-64">
          <button className="btn btn-success"
                  onClick={ onSaveClicked }
          >
            <span>Crear venta</span>
          </button>
        </div>
      </div>
    </div>
  )
};

SaleForm.propTypes = {
  date: PropTypes.object.isRequired,
  dateError: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,

  productAutocompleteValue: PropTypes.string.isRequired,
  onProductAutoCompleteValueChange: PropTypes.func.isRequired,
  onProductSelected: PropTypes.func.isRequired,
  productAutocompleteError: PropTypes.string,

  quantity: PropTypes.string.isRequired,
  quantityError: PropTypes.string,
  onQuantityChange: PropTypes.func.isRequired,
  stock: PropTypes.number.isRequired,

  onSelfConsumptionChange: PropTypes.func.isRequired,
  selfConsumption: PropTypes.bool.isRequired,
  cost: PropTypes.number.isRequired,

  price: PropTypes.string.isRequired,
  priceError: PropTypes.string,
  onPriceChange: PropTypes.func.isRequired,
  lastPrice: PropTypes.number.isRequired,

  totalPrice: PropTypes.number.isRequired,
  onAddProductClicked: PropTypes.func.isRequired,

  contents: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,

  error: PropTypes.string,
  onSaveClicked: PropTypes.func.isRequired,
};

export default SaleForm;