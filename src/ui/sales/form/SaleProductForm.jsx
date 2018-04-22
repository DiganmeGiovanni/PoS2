import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../../components/form/FormGroup';
import DValidator from '../../../services/ValidatorService';
import ProductAutosuggest from "../../components/autosuggesters/ProductAutosuggest";
import ProductService from "../../../services/ProductService";


class SaleProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.onAddClicked = this.onAddClicked.bind(this);
    this.onProductChange = this.onProductChange.bind(this);
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onSalePriceChange = this.onSalePriceChange.bind(this);

    this.state = this.makeInitialState();
  }

  // noinspection JSMethodCanBeStatic
  makeInitialState() {
    return {
      product: {
        hasError: false,
          errMessage: null,
          value: null
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

      lastSalePrice: 0,
      stock: 0
    };
  }

  onProductChange(evt, { suggestion }) {

    // Get last sale price
    ProductService.lastPrice(suggestion.id, this.props.date)
      .then(salePrice => {

        // Get stock
        ProductService.stockCount(suggestion.id, this.props.date)
          .then(products => {

            this.setState({
              product: { value: suggestion },
              stock: products.length > 0 ? products[0].stock : 0,
              lastSalePrice: salePrice === null
                ? 0
                : salePrice.price
            });
          })
          .catch(err => {
            console.error(err);

            this.setState({
              product: { value: suggestion },
              lastSalePrice: salePrice === null
                ? 0
                : salePrice.price
            });
          });
      })
      .catch(err => {
        console.error(err);
        this.setState({product: { value: suggestion }});
      });
  }

  onSalePriceChange(evt) {
    this.setState({
      salePrice: { value: evt.target.value }
    })
  }

  onQuantityChange(evt) {
    this.setState(
      { quantity: { value: evt.target.value }},
      this.validateQuantity
    );
  }

  onAddClicked(e) {
    e.preventDefault();
    if (this.validate()) {

      // Validate available stock
      ProductService.stockCount(this.state.product.value.id, this.props.date)
        .then(products => {
          this.state.stock = products[0].stock;

          if (this.validateQuantity()) {
            this.props.addProduct(
              this.state.product.value,
              this.state.quantity.value  * 1,
              this.state.salePrice.value * 1
            );

            this.setState(this.makeInitialState());
          }
        })
        .catch(err => { console.error(err); });
    }
  }

  validate() {
    let formOk = true;

    if (this.state.product.value === null) {
      formOk = false;
      this.setState({
        product: {
          hasError: true,
          errMessage: 'Indique el producto',
          value: this.state.product.value
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

    formOk = formOk && this.validateQuantity();
    return formOk;
  }

  validateQuantity() {
    let formOk = true;

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

    else {
      let qty = this.state.quantity.value * 1;
      if (qty > this.state.stock) {
        formOk = false;
        this.setState({
          quantity: {
            hasError: true,
            errMessage: 'Sobrepasa stock',
            value: this.state.quantity.value
          }
        });
      }
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

            {/* Quantity */}
            <div className="col-sm-4 col-md-12">
              <div className="row">
                <div className="col-xs-6">
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

                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="inp-stock"
                           className="control-label">
                      Stock
                    </label>
                    <input
                      id="inp-stock"
                      className="form-control"
                      type="text"
                      onChange={() => {}}
                      value={ this.state.stock }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sale price */}
            <div className="col-sm-4 col-md-12">
              <div className="row">
                <div className="col-xs-6">
                  <FormGroup
                    label="Precio"
                    name="sale_price"
                    type="text"
                    handleChange={ this.onSalePriceChange }
                    errMessage={ this.state.salePrice.errMessage }
                    inpProps={{
                      value: this.state.salePrice .value
                    }}
                  />
                </div>

                <div className="col-xs-6">
                  <div className="form-group">
                    <label htmlFor="inp-last_sale_price"
                           className="control-label">
                      Último precio
                    </label>
                    <input
                      id="inp-last_sale_price"
                      className="form-control"
                      type="text"
                      onChange={() => {}}
                      value={ this.state.lastSalePrice }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
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

SaleProductForm.propTypes = {
  date: PropTypes.object.isRequired,
  addProduct: PropTypes.func.isRequired
};

export default SaleProductForm;