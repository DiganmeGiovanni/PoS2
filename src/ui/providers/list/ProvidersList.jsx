import React from 'react';
import { Link } from 'react-router-dom';
import ProvidersTable from './ProvidersTable';
import ProvidersListStore from './ProvidersListStore';
import PoSActions from '../../PoSActions';

class ProvidersList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = ProvidersListStore.getState();
  }

  componentWillMount() {
    ProvidersListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Proveedores';
    PoSActions.provider.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    ProvidersListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(ProvidersListStore.getState());
  }

  static onFilterNameChange(e) {
    PoSActions.provider.list.filterByName(e.target.value);
  }

  static onFilterIdChange(e) {
    PoSActions.provider.list.filterById(e.target.value);
  }

  navToPage(targetPage) {
    PoSActions.provider.list.page(
      targetPage,
      this.pageSize,
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h1>Proveedores</h1>
          </div>
          <div className="col-sm-6 text-right padding-top-24">
            <Link to={'/providers/create'} className={'btn btn-primary'}>
              Nuevo proveedor
            </Link>
          </div>
        </div>

        <ProvidersTable
          providers={this.state.providers}
          navCallback={this.navToPage}
          activePage={this.state.pageIdx}
          totalPages={this.state.pagesCount}
          filterId={ this.state.filters.id }
          filterName={ this.state.filters.name }
          onFilterNameChange={ ProvidersList.onFilterNameChange }
          onFilterIdChange={ ProvidersList.onFilterIdChange }
        />
      </div>
    );
  }
}

export default ProvidersList;
