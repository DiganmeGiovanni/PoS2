import React from 'react';
import { Link } from 'react-router-dom';
import PurchasesTable from "./PurchasesTable";
import PoSActions from "../../PoSActions";
import PurchasesListStore from './PurchasesListStore';
import moment from 'moment/moment';

class PurchasesList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = PurchasesListStore.getState();
  }

  componentWillMount() {
    PurchasesListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Compras';
    PoSActions.purchases.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    PurchasesListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(PurchasesListStore.getState());
  }

  navToPage(targetPage) {
    PoSActions.purchases.list.page(
      targetPage,
      this.pageSize
    )
  }

  static onFilterIdChange(e) {
    PoSActions.purchases.list.onFilterIdChange(e.target.value);
  }

  static onFilterDateChange(aMoment) {
    const filterValue = moment.isMoment(aMoment) ? aMoment.toDate() : '';
    PoSActions.purchases.list.onFilterDateChange(filterValue);
  }

  static onFilterProviderChange(e) {
    PoSActions.purchases.list.onFilterProviderChange(e.target.value);
  }

  static onFilterInvestmentChange(e) {
    PoSActions.purchases.list.onFilterInvestmentChange(e.target.value);
  }

  static onFilterReinvestmentChange(e) {
    PoSActions.purchases.list.onFilterReinvestmentChange(e.target.value);
  }

  static onFilterTotalChange(e) {
    PoSActions.purchases.list.onFilterTotalChange(e.target.value);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h1>Compras</h1>
          </div>
          <div className="col-sm-6 text-right padding-top-24">
            <Link to={'/purchases/create'} className="btn btn-primary">
              Nueva compra
            </Link>
          </div>
        </div>

        <PurchasesTable
          purchases={ this.state.purchases }
          activePage={ this.state.pageIdx }
          totalPages={ this.state.pagesCount }
          navCb={ this.navToPage }
          onFilterIdChange={ PurchasesList.onFilterIdChange }
          onFilterDateChange={ PurchasesList.onFilterDateChange }
          onFilterProviderChange={ PurchasesList.onFilterProviderChange }
          onFilterInvestmentChange={ PurchasesList.onFilterInvestmentChange }
          onFilterReinvestmentChange={ PurchasesList.onFilterReinvestmentChange }
          onFilterTotalChange={ PurchasesList.onFilterTotalChange }
        />
      </div>
    );
  }
}

export default PurchasesList;
