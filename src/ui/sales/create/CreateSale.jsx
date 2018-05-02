import React from 'react';
import SaleForm from './SaleForm';
import CreateSaleStore from './CreateSaleStore';
import PoSActions from "../../PoSActions";
import PropTypes from "prop-types";

class CreateSale extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = CreateSaleStore.getState();
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

  render() {
    return <SaleForm
      date={ this.state.date }
      onDateChange={ CreateSale.onDateChange }
      productAutocompleteValue={ this.state.form.product.inpValue }
      onProductAutoCompleteValueChange={ CreateSale.onProductAutocompleteValueChange }
      onProductSelected={ CreateSale.onProductSelected }

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
    />
  }
}

export default CreateSale;
