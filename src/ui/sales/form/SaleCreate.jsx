import React from 'react';
import PoSActions from '../../PoSActions';
import SaleCreateStore from './SaleCreateStore';
import SaleForm from "./SaleForm";
import SaleProductForm from "./SaleProductForm";
import SaleContent from "./SaleContent";

class SaleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = SaleCreateStore.getState();
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
    SaleCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SaleCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(SaleCreateStore.getState());
  }

  // noinspection JSMethodCanBeStatic
  handleDateChange(moment) {
    PoSActions.sales.create.changeDate(moment.toDate());
  }

  // noinspection JSMethodCanBeStatic
  handleSelfConsumptionChange(e) {
    PoSActions.sales.create.changeSelfConsumption(e.target.value === '1');
  }

  // noinspection JSMethodCanBeStatic
  addProduct(product, quantity, price) {
    PoSActions.sales.create.addProduct(product, quantity, price);
  }

  // noinspection JSMethodCanBeStatic
  onSaveClicked(e) {
    e.preventDefault();
    PoSActions.sales.create.save();
  }

  render() {
    return (
      <div className="container">
        <h1>Registrar venta</h1>

        <br/>
        <SaleForm
          date={ this.state.date }
          selfConsumption={ this.state.selfConsumption }
          onDateChange={ this.handleDateChange }
          onSelfConsumptionChange={ this.handleSelfConsumptionChange }
        />

        {/* Contents */}
        <div className="row">
          <div className="col-md-4">
            <SaleProductForm
              addProduct={ this.addProduct }
              date={ this.state.date }
            />
          </div>

          <div className="col-md-8">
            <SaleContent
              contents={ this.state.contents }
              total={ this.state.total }
              errMessage={ this.state.validationErrors.contents }
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
              <span>Crear venta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SaleCreate;