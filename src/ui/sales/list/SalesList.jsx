import React from 'react';
import SalesListStore from './SalesListStore';
import PoSActions from "../../PoSActions";
import SalesTable from "./SalesTable";
import { Link } from 'react-router-dom';

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

  render() {
    return (
      <div className="container">
        <h1>Ventas</h1>
        <Link to={'/sales/create'} className="btn btn-primary">
          Nueva venta
        </Link>

        <br/>
        <br/>
        <SalesTable
          sales={ this.state.sales }
          activePage={ this.state.pageIdx }
          totalPages={ this.state.pagesCount }
          navCb={ this.navToPage }
        />
      </div>
    );
  }
}

export default SalesList;