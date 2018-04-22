import React from 'react';
import { Link } from 'react-router-dom';
import BrandsTable from './BrandsTable';
import BrandsListStore from './BrandsListStore';
import PoSActions from '../PoSActions';

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
    PoSActions.brands.page(1, this.pageSize);
  }

  componentWillUnmount() {
    BrandsListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(BrandsListStore.getState());
  }

  navToPage(targetPage) {
    PoSActions.brands.page(
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
        />
      </div>
    );
  }
}

export default BrandsList;
