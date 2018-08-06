import React from 'react';
import SalesListStore from './SalesListStore';
import PoSActions from "../../PoSActions";
import SalesTable from "./SalesTable";
import { Link } from 'react-router-dom';
import moment from "moment";

class SalesList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = SalesListStore.getState();
  }

  componentWillMount() {
    SalesListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Ventas';
    PoSActions.sales.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    SalesListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(SalesListStore.getState());
  }

  navToPage(targetPage) {
    PoSActions.sales.list.page(
      targetPage,
      this.pageSize
    )
  }

  static onFilterIdChange(e) {
    PoSActions.sales.list.onFilterIdChange(e.target.value);
  }

  static onFilterDateChange(aMoment) {
    const filterValue = moment.isMoment(aMoment) ? aMoment.toDate() : '';
    PoSActions.sales.list.onFilterDateChange(filterValue);
  }

  static onFilterTotalChange(e) {
    PoSActions.sales.list.onFilterTotalChange(e.target.value);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h1>Ventas</h1>
          </div>
          <div className="col-sm-6 text-right padding-top-24">
            <Link to={'/sales/create'} className="btn btn-primary">
              Nueva venta
            </Link>
          </div>
        </div>

        <SalesTable
          sales={ this.state.sales }
          activePage={ this.state.pageIdx }
          totalPages={ this.state.pagesCount }
          navCb={ this.navToPage }
          onFilterIdChange={ SalesList.onFilterIdChange }
          onFilterDateChange={ SalesList.onFilterDateChange }
          onFilterTotalChange={ SalesList.onFilterTotalChange }
        />
      </div>
    );
  }
}

export default SalesList;