import React from 'react';
import { Link } from 'react-router-dom';
import ProductsTable from './ProductsTable';
import ProductsListStore from './ProductsListStore';
import PoSActions from './../PoSActions';
import "moment/locale/es";

class ProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = ProductsListStore.getState();
  }

  componentWillMount() {
    ProductsListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Productos';
    PoSActions.products.page(1, this.pageSize);
  }

  componentWillUnmount() {
    ProductsListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(ProductsListStore.getState());
  }

  // noinspection JSMethodCanBeStatic
  handleEndDateChange(endDate) {
    PoSActions.products.setEndDate(endDate);
  }

  // noinspection JSMethodCanBeStatic
  onFilterNameChange(e) {
    PoSActions.products.filterByName(e.target.value);
  }

  navToPage(targetPage) {
    PoSActions.products.page(
      targetPage,
      this.pageSize,
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h1>Productos</h1>
          </div>
          <div className="col-sm-6 text-right padding-top-24">
            <Link to={'/products/create'} className={'btn btn-primary'}>
              Nuevo producto
            </Link>
          </div>
        </div>

        <ProductsTable
          products={this.state.products}
          navCallback={this.navToPage}
          activePage={this.state.pageIdx}
          totalPages={this.state.pagesCount}
          onFilterNameChange={ this.onFilterNameChange }
        />
      </div>
    );
  }
}

export default ProductsList;
