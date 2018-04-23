import React from 'react';
import PurchaseProductForm from "./PurchaseProductForm";
import PoSActions from "../PoSActions";
import PurchaseCreateStore from './PurchaseCreateStore';
import FormGroup from "../components/form/FormGroup";
import PurchaseContents from "./form/PurchaseContents"

const DatePicker = require('react-datetime');
import "moment/locale/es";


class PurchasesCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = PurchaseCreateStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar compra';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.purchase.create.setRedirectAsCompleted();
      this.props.history.push('/purchases');
    }
  }

  componentWillMount() {
    PurchaseCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    PurchaseCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(PurchaseCreateStore.getState());
  }

  // noinspection JSMethodCanBeStatic
  addProduct(product, provider, quantity, cost, price) {
    PoSActions.purchase.create.addProduct(
      product,
      provider,
      quantity,
      cost,
      price
    );
  }

  // noinspection JSMethodCanBeStatic
  handleDateChange(moment) {
    PoSActions.purchase.create.changeDate(moment.toDate());
  }

  // noinspection JSMethodCanBeStatic
  onPaymentInvestmentChange(e) {
    PoSActions.purchase
      .create
      .changePaymentInvestment(e.target.value * 1);
  }

  // noinspection JSMethodCanBeStatic
  onPaymentReinvestmentChange(e) {
    PoSActions.purchase
    .create
    .changePaymentReinvestment(e.target.value * 1);
  }

  // noinspection JSMethodCanBeStatic
  onTotalPaidChange(e) {
    e.preventDefault();
    PoSActions.purchase
      .create
      .changeTotalPaid(e.target.value);
  }

  // noinspection JSMethodCanBeStatic
  onSaveClicked(e) {
    e.preventDefault();
    PoSActions.purchase.create.save();
  }

  render() {
    // noinspection JSUnusedGlobalSymbols
    return (
      <div className="container">
        <h1>Registrar compra</h1>
        <br/>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">Compra</h4>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-4">
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
                      onChange={ this.handleDateChange }
                      value={ this.state.date }
                    />
                </div>
              </div>
              
              <div className="col-md-4">
                <FormGroup
                  label="Pago como inversión"
                  name="payment_investment"
                  type="text"
                  handleChange={ this.onPaymentInvestmentChange }
                  value={ `${this.state.paymentInvestment}` }
                  errMessage={ this.state.validationErrors.paymentInvestment }
                />
              </div>

              <div className="col-md-4">
                <FormGroup
                  label="Pago como reinversión"
                  name="payment_reinvestment"
                  type="text"
                  handleChange={ this.onPaymentReinvestmentChange }
                  value={ `${this.state.paymentReinvestment}` }
                  errMessage={ this.state.validationErrors.paymentInvestment }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <PurchaseProductForm
              addProduct={ this.addProduct }
              date={ this.state.date }
            />
          </div>

          <div className="col-md-8">
            <PurchaseContents
              contents={ this.state.contents }
              totalCost={ this.state.totalCost }
              errMessage={ this.state.validationErrors.contents }
              totalPaid={ this.state.totalPaid }
              onTotalPaidChange={ this.onTotalPaidChange }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-center padding-bottom-64">
            <hr/>
            <button
              className="btn btn-success"
              onClick={ this.onSaveClicked }
              type="button"
            >
              <span>Crear compra</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PurchasesCreate;
