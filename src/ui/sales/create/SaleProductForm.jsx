import React from 'react';
import PropTypes from 'prop-types';
import SaleProductAutosuggest from '../../components/autosuggesters/SaleProductAutosuggest';
import FormGroup from "../../components/form/FormGroup";

const SaleProductForm = ({
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
                           onAddProductClicked, }) => {

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Agregar producto</div>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-12">
            <SaleProductAutosuggest
              onProductSelected={ onProductSelected }
              value={ productAutocompleteValue }
              onValueChange={ onProductAutoCompleteValueChange }
              error={ productAutocompleteError }
            />
          </div>
        </div>

        <div className="row">

          {/* Quantity */}
          <div className="col-sm-6 col-md-12">
            <div className="row">
              <div className="col-xs-6">
                <FormGroup
                  label="Cantidad"
                  name="quantity"
                  type="text"
                  handleChange={ onQuantityChange }
                  errMessage={ quantityError }
                  inpProps={{
                    value: quantity
                  }}
                />
              </div>

              <div className="col-xs-6">
                <div className="form-group">
                  <label htmlFor="inp-stock"
                         className="control-label">
                    En stock
                  </label>
                  <input
                    id="inp-stock"
                    className="form-control"
                    type="text"
                    onChange={() => {}}
                    value={ stock }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Self consumption && cost */}
          <div className="col-sm-6 col-md-12">
            <div className="row">
              <div className="col-xs-6">
                <div className="form-group">
                  <label className="control-label">
                    ¿Autoconsumo?
                  </label>
                  <select
                    id="inp-self_consumption"
                    name="self_consumption"
                    className="form-control"
                    onChange={ onSelfConsumptionChange }
                    value={ selfConsumption ? '1' : '0' }
                  >
                    <option value="0">No</option>
                    <option value="1">Si</option>
                  </select>
                </div>
              </div>

              <div className="col-xs-6">
                <div className="form-group">
                  <label htmlFor="inp-stock"
                         className="control-label">
                    Costo
                  </label>
                  <input
                    id="inp-stock"
                    className="form-control"
                    type="text"
                    onChange={() => {}}
                    value={ cost }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="col-sm-6 col-md-12">
            <div className="row">
              <div className="col-xs-6">
                <FormGroup
                  label="Precio c/u"
                  name="price"
                  type="text"
                  handleChange={ onPriceChange }
                  errMessage={ priceError }
                  inpProps={{
                    value: price
                  }}
                />
              </div>

              <div className="col-xs-6">
                <div className="form-group">
                  <label htmlFor="inp-last-price"
                         className="control-label">
                    Último precio
                  </label>
                  <input
                    id="inp-stock"
                    className="form-control"
                    type="text"
                    onChange={() => {}}
                    value={ lastPrice }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total price */}
          <div className="col-sm-6 col-md-12">
            <div className="row">
              <div className="col-xs-6">
                <div className="form-group">
                  <label htmlFor="inp-total-price"
                         className="control-label">
                    Precio total
                  </label>
                  <input
                    id="inp-total-price"
                    className="form-control"
                    type="text"
                    onChange={() => {}}
                    value={ totalPrice }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 text-center margin-top-16">
            <button className="btn btn-primary"
                    onClick={ onAddProductClicked }
            >
              <span>Agregar producto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

SaleProductForm.propTypes = {
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
};

export default SaleProductForm;
