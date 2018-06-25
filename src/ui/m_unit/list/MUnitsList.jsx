import React from 'react';
import { Link } from 'react-router-dom';
import MUnitsTable from './MUnitsTable';
import MUnitListStore from './MUnitsListStore';
import PoSActions from '../../PoSActions';

class MUnitsList extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.navToPage = this.navToPage.bind(this);

    this.pageSize = 20;
    this.state = MUnitListStore.getState();
  }

  componentWillMount() {
    MUnitListStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Unidades de medida';
    PoSActions.measurementUnits.list.page(1, this.pageSize);
  }

  componentWillUnmount() {
    MUnitListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(MUnitListStore.getState());
  }

  static onFilterIdChange(e) {
    PoSActions.measurementUnits.list.filterById(e.target.value);
  }

  static onFilterNameChange(e) {
    PoSActions.measurementUnits.list.filterByName(e.target.value);
  }

  static onFilterAbbrChange(e) {
    PoSActions.measurementUnits.list.filterByAbbr(e.target.value);
  }

  navToPage(targetPage) {
    PoSActions.measurementUnits.list.page(
      targetPage,
      this.pageSize,
    );
  }

  render() {
    return (
      <div className="container">
        <h1>Unidades de medida</h1>
        <Link to={'/measurement_units/create'} className={'btn btn-primary'}>
          Nueva unidad
        </Link>

        <br />
        <br />
        <MUnitsTable
          mUnits={this.state.mUnits}
          navCallback={this.navToPage}
          activePage={this.state.pageIdx}
          totalPages={this.state.pagesCount}

          filterId={ this.state.filters.id }
          onFilterIdChange={ MUnitsList.onFilterIdChange }
          filterName={ this.state.filters.name }
          onFilterNameChange={ MUnitsList.onFilterNameChange }
          filterAbbr={ this.state.filters.abbr }
          onFilterAbbrChange={ MUnitsList.onFilterAbbrChange }
        />
      </div>
    );
  }
}

export default MUnitsList;
