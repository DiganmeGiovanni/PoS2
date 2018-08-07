import React from "react";
import SaleUpsertStore from './SaleUpsertStore';
import PoSActions from "../../PoSActions";
import SaleProductForm from "../create/SaleProductForm";
import SaleContents from "../create/SaleContents";

const DatePicker = require('react-datetime');

class SaleUpsert extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.saleId = this.props.match.params.saleId;
    this.state = SaleUpsertStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar venta';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.sales.upsert.setRedirectAsCompleted();
      this.props.history.push('/sales');
    }
  }

  componentWillMount() {
    SaleUpsertStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SaleUpsertStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(SaleUpsertStore.getState());
  }

  static onDateChange(aMoment) {
    PoSActions.sales.upsert.onDateChange(aMoment.toDate())
  }

  static onProductAutoCompleteValueChange(e, { newValue }) {
    PoSActions.sales.upsert.onProductAutoCompleteValueChange(newValue);
  }

  static onProductSelected(e, { suggestion }) {
    PoSActions.sales.upsert.onProductSelected(suggestion);
  }

  static onQuantityChange(e) {
    PoSActions.sales.upsert.onQuantityChange(e.target.value)
  }

  static onSelfConsumptionChange(e) {
    PoSActions.sales.upsert.onSelfConsumptionChange(
      e.target.value === '1'
    )
  }

  static onPriceChange(e) {
    PoSActions.sales.upsert.onPriceChange(e.target.value);
  }

  static onAddProductClicked() {
    PoSActions.sales.upsert.onAddProductClicked()
  }

  static onContentDeleteClicked(index) {
    PoSActions.sales.upsert.onContentDeleteClicked(index)
  }

  static onSaveClicked() {
    PoSActions.sales.upsert.onSaveClicked();
  }

  _renderTitle() {
    if (this.state.id !== null) {
      return (
        <div className="row">
          <div className="col-xs-12">
            <h1 className="margin-bottom-0">Modificar venta</h1>
            <h4 className="margin-top-4">#{ this.state.id }</h4>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <h1>Registrar venta</h1>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
        { this._renderTitle() }
        <br/>

        <div className="row">
          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="panel-title">Venta</div>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="control-label">Fecha</label>
                  <DatePicker
                    dateFormat="YYYY, MMMM DD"
                    timeFormat={ false }
                    locale="es"
                    viewMode="years"
                    closeOnSelect={ true }
                    closeOnTab={ true }
                    onChange={ SaleUpsert.onDateChange }
                    value={ this.state.date }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">

            {/* Add product form as a panel */}
            <SaleProductForm
              productAutocompleteValue={ this.state.form.product.inpValue }
              productAutocompleteError={ this.state.form.product.error }
              onProductAutoCompleteValueChange={ SaleUpsert.onProductAutoCompleteValueChange }
              onProductSelected={ SaleUpsert.onProductSelected }

              quantity={ this.state.form.quantity.value }
              quantityError={ this.state.form.quantity.error }
              onQuantityChange={ SaleUpsert.onQuantityChange }

              stock={ this.state.form.stock.value }

              onSelfConsumptionChange={ SaleUpsert.onSelfConsumptionChange }
              selfConsumption={ this.state.form.selfConsumption.value }

              cost={ this.state.form.cost.value }

              price={ this.state.form.price.value }
              priceError={ this.state.form.price.error }
              onPriceChange={ SaleUpsert.onPriceChange }
              lastPrice={ this.state.form.lastPrice.value }
              totalPrice={ this.state.form.totalPrice.value }

              onAddProductClicked={ SaleUpsert.onAddProductClicked }
            />
          </div>

          <div className="col-md-8">
            <SaleContents
              contents={ this.state.contents }
              total={ this.state.total }
              error={ this.state.error }
              onContentDeleteClicked={ SaleUpsert.onContentDeleteClicked }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 text-center margin-top-16 padding-bottom-64">
            <button className="btn btn-success"
                    onClick={ SaleUpsert.onSaveClicked }
            >
              <span>Crear venta</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SaleUpsert
