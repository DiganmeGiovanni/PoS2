import React from 'react';
import PropTypes from 'prop-types';
import ProductAutosuggest from '../../components/autosuggesters/ProductAutosuggest';
import ProvidersAutosuggest from "../../components/autosuggesters/ProvidersAutosuggest";
import FormGroup from '../../components/form/FormGroup';

const PurchaseProductForm = ({ inpProductValue, onProductValueChange, onProductSelected, productError,
                                quantity, onQuantityChange, quantityError, mUnitAbbr,
                                cost, onCostChange, costError, lastCost,
                                price, onPriceChange, priceError,
                                onAddClicked }) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4 className="panel-title">Producto comprado</h4>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-sm-4 col-md-12">
            <ProductAutosuggest
              onProductSelected={ onProductSelected }
              value={ inpProductValue }
              onValueChange={ onProductValueChange }
              error={ productError }
            />
          </div>
          <div className="col-sm-4 col-md-12">
            <FormGroup
              label="Cantidad"
              name="quantity"
              type="text"
              handleChange={ onQuantityChange }
              errMessage={ quantityError }
              inpProps={{
                value: quantity
              }}
              addOnEnd={ mUnitAbbr }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-8 col-md-12">
            <div className="row">
              <div className="col-xs-6">
                <FormGroup
                  label="Costo"
                  name="purchase_price"
                  type="text"
                  handleChange={ onCostChange }
                  errMessage={ costError }
                  addOnStart='$'
                  inpProps={{
                    value: cost
                  }}
                />
              </div>
              <div className="col-xs-6">
                <div className="form-group">
                  <label htmlFor="inp-last_purchase_price"
                          className="control-label">
                    Último costo
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">$</div>
                    <input
                      id="inp-last_purchase_price"
                      className="form-control"
                      type="text"
                      onChange={ () => {} }
                      value={ lastCost }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-12">
            <FormGroup
              label="Precio venta"
              name="sale_price"
              type="text"
              handleChange={ onPriceChange }
              errMessage={ priceError }
              addOnStart='$'
              inpProps={{ value: price }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 text-right padding-top-16">
            <button className="btn btn-primary" onClick={ onAddClicked }>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PurchaseProductForm.propTypes = {
  inpProductValue: PropTypes.string.isRequired,
  onProductValueChange: PropTypes.func.isRequired,
  onProductSelected: PropTypes.func.isRequired,
  productError: PropTypes.string,

  quantity: PropTypes.string.isRequired,
  quantityError: PropTypes.string.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  mUnitAbbr: PropTypes.string,

  cost: PropTypes.string.isRequired,
  costError: PropTypes.string.isRequired,
  onCostChange: PropTypes.func.isRequired,
  lastCost: PropTypes.number.isRequired,

  price: PropTypes.string.isRequired,
  priceError: PropTypes.string.isRequired,
  onPriceChange: PropTypes.func.isRequired,

  onAddClicked: PropTypes.func.isRequired
};

export default PurchaseProductForm;
