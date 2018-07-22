import React from 'react';
import { Link } from 'react-router-dom';
import PurchasesTable from "./PurchasesTable";
import PoSActions from "../../PoSActions";
import PurchasesListStore from './PurchasesListStore';

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

  static onFilterDateChange(moment) {
    console.log('Date filter updated to: ' + moment.toDate());
  }

  static onFilterProviderChange(e) {
    PoSActions.purchases.list.onFilterProviderChange(e.target.value);
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
          onFilterDateChange={ PurchasesList.onFilterDateChange }
          onFilterProviderChange={ PurchasesList.onFilterProviderChange }
        />
      </div>
    );
  }
}

export default PurchasesList;
