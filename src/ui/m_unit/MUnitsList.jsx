import React from 'react';
import { Link } from 'react-router-dom';
import MUnitsTable from './MUnitsTable';
import MUnitListStore from './MUnitsListStore';
import PoSActions from './../PoSActions';

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
    PoSActions.measurementUnits.page(1, this.pageSize);
  }

  componentWillUnmount() {
    MUnitListStore.removeChangeListener(this.onChange);
  }

  onChange() {
    // Pull state changes from store
    this.setState(MUnitListStore.getState());
  }

  navToPage(targetPage) {
    PoSActions.measurementUnits.page(
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
        />
      </div>
    );
  }
}

export default MUnitsList;
