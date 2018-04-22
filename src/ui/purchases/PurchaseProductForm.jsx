import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from "../components/form/FormGroup";
import ProductAutosuggest from "../components/autosuggesters/ProductAutosuggest";
import ProvidersAutosuggest from "../components/autosuggesters/ProvidersAutosuggest";
import DValidator from "../../services/ValidatorService";
import ProductService from '../../services/ProductService';

class PurchaseProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.onAddClicked = this.onAddClicked.bind(this);
    this.onProductChange = this.onProductChange.bind(this);
    this.onProviderChange = this.onProviderChange.bind(this);
    this.onPurchasePriceChange = this.onPurchasePriceChange.bind(this);
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onSalePriceChange = this.onSalePriceChange.bind(this);

    this.state = {
      product: {
        hasError: false,
        errMessage: null,
        value: null
      },
      provider: {
        hasError: false,
        errMessage: null,
        value: null
      },
      purchasePrice: {
        hasError: false,
        errMessage: null,
        value: ''
      },
      quantity: {
        hasError: false,
        errMessage: null,
        value: ''
      },
      salePrice: {
        hasError: false,
        errMessage: null,
        value: ''
      },

      lastPurchasePrice: 0
    };
  }

  cleanForm() {
    this.setState({
      product: {
        hasError: false,
        errMessage: null,
        value: this.state.product.value
      },
      provider: {
        hasError: false,
        errMessage: null,
        value: this.state.provider.value
      },
      purchasePrice: {
        hasError: false,
        errMessage: null,
        value: ''
      },
      quantity: {
        hasError: false,
        errMessage: null,
        value: ''
      },
      salePrice: {
        hasError: false,
        errMessage: null,
        value: ''
      },

      lastPurchasePrice: 0
    });
  }

  onAddClicked(e) {
    e.preventDefault();
    if (this.validate()) {
      this.props.addProduct(
        this.state.product.value,
        this.state.provider.value,
        this.state.quantity.value      * 1,
        this.state.purchasePrice.value * 1,
        this.state.salePrice.value     * 1
      );

      this.cleanForm();
    }
  }

  onProductChange(evt, { suggestion }) {
    ProductService.lastCost(suggestion.id, this.props.date)
        .then(purchasePrice => {
          this.setState({
            product: { value: suggestion },
            lastPurchasePrice: purchasePrice === null ? 0 : purchasePrice.price
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({ product: { value: suggestion }});
        });
  }

  onProviderChange(evt, { suggestion }) {
    this.setState({
      provider: { value: suggestion }
    });
  }

  onPurchasePriceChange(evt) {
    this.setState({
      purchasePrice: { value: evt.target.value }
    });
  }

  onQuantityChange(evt) {
    this.setState({
      quantity: { value: evt.target.value }
    });
  }

  onSalePriceChange(evt) {
    this.setState({
      salePrice: { value: evt.target.value }
    });
  }

  validate() {
    let formOk = true;

    if (this.state.product.value == null) {
      formOk = false;
      this.setState({
        product: {
          hasError: true,
          errMessage: 'Indique el producto',
          value: this.state.product.value
        }
      });
    }

    if (this.state.provider.value == null) {
      formOk = false;
      this.setState({
        provider: {
          hasError: true,
          errMessage: 'Indique el proveedor',
          value: this.state.provider.value
        }
      });
    }

    if (!DValidator.isNumber(this.state.quantity.value)) {
      formOk = false;
      this.setState({
        quantity: {
          hasError: true,
          errMessage: 'Indique una cantidad valida',
          value: this.state.quantity.value
        }
      });
    }

    if (!DValidator.isNumber(this.state.purchasePrice.value)) {
      formOk = false;
      this.setState({
        purchasePrice: {
          hasError: true,
          errMessage: 'Indique el costo unitario',
          value: this.state.purchasePrice.value
        }
      });
    }

    if (!DValidator.isNumber(this.state.salePrice.value)) {
      formOk = false;
      this.setState({
        salePrice: {
          hasError: true,
          errMessage: 'Indique el precio de venta',
          value: this.state.salePrice.value
        }
      });
    }

    return formOk;
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">Agregar producto</h4>
        </div>
        <div className="panel-body">
          <div className="row">
            <div className="col-sm-4 col-md-12">
              <ProductAutosuggest
                onProductSelected={ this.onProductChange }
                errMessage={ this.state.product.errMessage }
              />
            </div>
            <div className="col-sm-4 col-md-12">
              <FormGroup
                label="Cantidad"
                name="quantity"
                type="text"
                handleChange={ this.onQuantityChange }
                errMessage={ this.state.quantity.errMessage }
                inpProps={{
                  value: this.state.quantity.value
                }}
              />
            </div>
            <div className="col-sm-4 col-md-12">
              <ProvidersAutosuggest
                onProviderSelected={ this.onProviderChange }
                errMessage={ this.state.provider.errMessage }
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
                    handleChange={ this.onPurchasePriceChange }
                    errMessage={ this.state.purchasePrice.errMessage }
                    inpProps={{
                      value: this.state.purchasePrice.value
                    }}
                  />
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="inp-last_purchase_price"
                           className="control-label">
                      Último costo
                    </label>
                    <input
                      id="inp-last_purchase_price"
                      className="form-control"
                      type="text"
                      onChange={ () => {} }
                      value={ this.state.lastPurchasePrice }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-md-12">
              <FormGroup
                label="Precio venta"
                name="sale_price"
                type="text"
                handleChange={ this.onSalePriceChange }
                errMessage={ this.state.salePrice.errMessage }
                inpProps={{
                  value: this.state.salePrice.value
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <button className="btn btn-primary"
                      onClick={ this.onAddClicked }
              >
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PurchaseProductForm.propTypes = {
  addProduct: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired
};

export default PurchaseProductForm;