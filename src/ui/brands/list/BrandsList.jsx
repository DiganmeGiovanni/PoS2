import React from 'react';
import { Link } from 'react-router-dom';
import BrandsTable from './BrandsTable';
import BrandsListStore from './BrandsListStore';
import PoSActions from '../../PoSActions';

class BrandsList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = BrandsListStore.getState();
  }

  componentWillMount() {
    BrandsListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Marcas';
    PoSActions.brands.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    BrandsListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(BrandsListStore.getState());
  }

  static onFilterNameChange(e) {
    PoSActions.brands.list.filterByName(e.target.value);
  }

  static onFilterIdChange(e) {
    PoSActions.brands.list.filterById(e.target.value);
  }

  navToPage(targetPage) {
    PoSActions.brands.list.page(
      targetPage,
      this.pageSize,
    );
  }

  render() {
    return (
      <div className="container">
        <h1>Marcas</h1>
        <Link to={'/brands/create'} className={'btn btn-primary'}>
          Nueva marca
        </Link>

        <br />
        <br />
        <BrandsTable
          brands={this.state.brands}
          activePage={this.state.pageIdx}
          totalPages={this.state.pagesCount}
          navCallback={this.navToPage}
          filterId={ this.state.filters.id }
          filterName={ this.state.filters.name }
          onFilterIdChange={ BrandsList.onFilterIdChange }
          onFilterNameChange={ BrandsList.onFilterNameChange }
        />
      </div>
    );
  }
}

export default BrandsList;
