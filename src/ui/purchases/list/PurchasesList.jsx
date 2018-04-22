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
    PoSActions.purchase.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    PurchasesListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(PurchasesListStore.getState());
  }

  navToPage(targetPage) {
    PoSActions.purchase.list.page(
      targetPage,
      this.pageSize
    )
  }

  render() {
    return (
      <div className="container">
        <h1>Compras</h1>
        <Link to={'/purchases/create'} className="btn btn-primary">
          Nueva compra
        </Link>

        <br/>
        <br/>
        <PurchasesTable
          purchases={ this.state.purchases }
          activePage={ this.state.pageIdx }
          totalPages={ this.state.pagesCount }
          navCb={ this.navToPage }
        />
      </div>
    );
  }
}

export default PurchasesList;
