import React from 'react';
import PurchaseUpsertStore from './PurchaseUpsertStore';
import PurchaseForm from './PurchaseForm';
import PurchaseProductForm from './PurchaseProductForm';
import PurchaseContents from './PurchaseContents';
import PoSActions from '../../PoSActions';
import ButtonSave from "../../components/form/ButtonSave";


class PurchaseUpsert extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.purchaseId = this.props.match.params.purchaseId;
    this.state = PurchaseUpsertStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar compra';
    PoSActions.purchases.upsert.onIdChange(this.purchaseId);
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.purchases.upsert.setRedirectAsCompleted();
      this.props.history.push('/purchases');
    }
  }

  componentWillMount() {
    PurchaseUpsertStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    PurchaseUpsertStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(PurchaseUpsertStore.getState());
  }

  static onDateChange(moment) {
    PoSActions.purchases.upsert.onDateChange(moment.toDate());
  }

  static onInvestmentChange(e) {
    PoSActions.purchases.upsert.onInvestmentChange(e.target.value);
  }

  static onReinvestmentChange(e) {
    PoSActions.purchases.upsert.onReinvestmentChange(e.target.value);
  }

  static onTotalPaidChange(e) {
    PoSActions.purchases.upsert.onTotalPaidChange(e.target.value);
  }

  static onProductSelected(e, { suggestion }) {
    PoSActions.purchases.upsert.onProductSelected(suggestion);
  }

  static onProductValueChange(e) {
    PoSActions.purchases.upsert.onProductValueChange(e.target.value);
  }

  static onQuantityChange(e) {
    PoSActions.purchases.upsert.onQuantityChange(e.target.value);
  }

  static onProviderSelected(e, { suggestion }) {
    PoSActions.purchases.upsert.onProviderSelected(suggestion);
  }

  static onProviderValueChange(e) {
    PoSActions.purchases.upsert.onProviderValueChange(e.target.value);
  }

  static onCostChange(e) {
    PoSActions.purchases.upsert.onCostChange(e.target.value);
  }

  static onPriceChange(e) {
    PoSActions.purchases.upsert.onPriceChange(e.target.value);
  }

  static onAddProduct(e) {
    e.preventDefault();
    PoSActions.purchases.upsert.onAddProductClicked();
  }

  static deleteContent(index) {
    PoSActions.purchases.upsert.deleteContent(index);
  }

  static editContent(index) {
    PoSActions.purchases.upsert.editContent(index);
  }

  static onSaveClicked() {
    PoSActions.purchases.upsert.onSaveClicked();
  }

  _renderTitle() {
    if (this.state.id !== null) {
      return (
        <div className="row">
          <div className="col-xs-12">
            <h1 className="margin-bottom-0">Modificar compra</h1>
            <h4 className="margin-top-4">#{ this.state.id }</h4>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-xs-12">
            <h1>Registrar compra</h1>
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

        <PurchaseForm
          date={ this.state.date }
          onDateChange={ PurchaseUpsert.onDateChange }

          inpProviderValue={ this.state.provider.inpValue }
          onProviderValueChange={ PurchaseUpsert.onProviderValueChange }
          onProviderSelected={ PurchaseUpsert.onProviderSelected }
          providerError={ this.state.provider.error }

          investment={ this.state.investment.value }
          investmentError={ this.state.investment.error }
          onInvestmentChange={ PurchaseUpsert.onInvestmentChange }

          reinvestment={ this.state.reinvestment.value }
          reinvestmentError={ this.state.reinvestment.error }
          onReinvestmentChange={ PurchaseUpsert.onReinvestmentChange }
        />

        <div className="row">
          <div className="col-md-3">
            <PurchaseProductForm
              inpProductValue={ this.state.productForm.product.inpValue }
              onProductValueChange={ PurchaseUpsert.onProductValueChange }
              onProductSelected={ PurchaseUpsert.onProductSelected }
              productError={ this.state.productForm.product.error }

              quantity={ this.state.productForm.quantity.value }
              quantityError={ this.state.productForm.quantity.error }
              onQuantityChange={ PurchaseUpsert.onQuantityChange }
              mUnitAbbr={ this.state.productForm.product.value
                ? this.state.productForm.product.value.measurementUnit.abbreviation
                : undefined
              }

              cost={ this.state.productForm.cost.value }
              costError={ this.state.productForm.cost.error }
              onCostChange={ PurchaseUpsert.onCostChange }
              lastCost={ this.state.productForm.lastCost.value }

              price={ this.state.productForm.price.value }
              priceError={ this.state.productForm.price.error }
              onPriceChange={ PurchaseUpsert.onPriceChange }

              onAddClicked={ PurchaseUpsert.onAddProduct }
            />
          </div>
          <div className="col-md-9">
            <PurchaseContents
              contents={ this.state.contents }
              total={ this.state.total }
              totalPaid={ this.state.totalPaid }
              onTotalPaidChange={ PurchaseUpsert.onTotalPaidChange }
              error={ this.state.errors.contents }
              onDeleteClicked={ PurchaseUpsert.deleteContent }
              onEditClicked={ PurchaseUpsert.editContent }
            />
          </div>
        </div>

        <div className="row padding-top-16 padding-bottom-64">
          <div className="col-xs-12 text-center">
            <ButtonSave
              label="Guardar compra"
              saving={ this.state.saving }
              onClick={ PurchaseUpsert.onSaveClicked }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default PurchaseUpsert;
