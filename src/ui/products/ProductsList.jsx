import React from 'react';
import { Link } from 'react-router-dom';
import ProductsTable from './ProductsTable';
import ProductsListStore from './ProductsListStore';
import PoSActions from './../PoSActions';
import "moment/locale/es";

const DatePicker = require('react-datetime');


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

  navToPage(targetPage) {
    PoSActions.products.page(
      targetPage,
      this.pageSize,
    );
  }

  render() {
    return (
      <div className="container">
        <h1>Productos</h1>
        <div className="row">
          <div className="col-sm-6">
            <Link to={'/products/create'} className={'btn btn-primary'}>
              Nuevo producto
            </Link>
          </div>
          {/*<div className="col-sm-6">*/}
            {/*<div className="form-group">*/}
              {/*<label className="control-label">Stock hasta</label>*/}
              {/*<br/>*/}
              {/*<DatePicker*/}
                {/*dateFormat="DD MMMM, YYYY"*/}
                {/*dateTimeFormat=" HH:mm:ss"*/}
                {/*locale="es"*/}
                {/*viewMode="years"*/}
                {/*closeOnSelect={ true }*/}
                {/*closeOnTab={ true }*/}
                {/*onChange={ this.handleEndDateChange }*/}
                {/*value={ this.state.endDate }*/}
              {/*/>*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>


        <br />
        <br />
        <ProductsTable
          products={this.state.products}
          navCallback={this.navToPage}
          activePage={this.state.pageIdx}
          totalPages={this.state.pagesCount}
        />
      </div>
    );
  }
}

export default ProductsList;
