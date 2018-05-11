import React from 'react';
import SaleForm from './SaleForm';
import CreateSaleStore from './CreateSaleStore';
import PoSActions from "../../PoSActions";

class CreateSale extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = CreateSaleStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar venta';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.sales.create.setRedirectAsCompleted();
      this.props.history.push('/sales');
    }
  }

  componentWillMount() {
    CreateSaleStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    CreateSaleStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(CreateSaleStore.getState());
  }

  static onAddProductClicked() {
    PoSActions.sales.create.onAddProductClicked();
  }

  static onDateChange(moment) {
    PoSActions.sales.create.onDateChange(moment.toDate());
  }

  static onProductAutocompleteValueChange(evt, { newValue }) {
    PoSActions.sales.create.onProductAutoCompleteValueChange(newValue);
  }

  static onProductSelected(evt, { suggestion }) {
    PoSActions.sales.create.onProductSelected(suggestion);
  }

  static onQuantityChange(e) {
    PoSActions.sales.create.onQuantityChange(e.target.value);
  }

  static onSelfConsumptionChange(e) {
    PoSActions.sales.create.onSelfConsumptionChange(
      e.target.value === '1'
    )
  }

  static onPriceChange(e) {
    PoSActions.sales.create.onPriceChange(e.target.value);
  }

  static onSaveClicked() {
    PoSActions.sales.create.onSaveClicked();
  }

  static onContentDeleteClicked(index) {
    PoSActions.sales.create.onContentDeleteClicked(index);
  }

  render() {
    return <SaleForm
      date={ this.state.date }
      onDateChange={ CreateSale.onDateChange }
      productAutocompleteValue={ this.state.form.product.inpValue }
      onProductAutoCompleteValueChange={ CreateSale.onProductAutocompleteValueChange }
      onProductSelected={ CreateSale.onProductSelected }
      productAutocompleteError={ this.state.form.product.error }

      quantity={ this.state.form.quantity.value }
      quantityError={ this.state.form.quantity.error }
      onQuantityChange={ CreateSale.onQuantityChange }
      stock={ this.state.form.stock.value }

      onSelfConsumptionChange={ CreateSale.onSelfConsumptionChange }
      selfConsumption={ this.state.form.selfConsumption.value }
      cost={ this.state.form.cost.value }

      price={ this.state.form.price.value }
      priceError={ this.state.form.price.error }
      onPriceChange={ CreateSale.onPriceChange }
      lastPrice={ this.state.form.lastPrice.value }

      totalPrice={ this.state.form.totalPrice.value }
      onAddProductClicked={ CreateSale.onAddProductClicked }

      contents={ this.state.contents }
      total={ this.state.total }

      error={ this.state.error }
      onSaveClicked={ CreateSale.onSaveClicked }
      onContentDeleteClicked={ CreateSale.onContentDeleteClicked }
    />
  }
}

export default CreateSale;
