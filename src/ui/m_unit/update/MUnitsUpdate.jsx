import React from 'react';
import MUnitsUpdateStore from './MUnitsUpdateStore';
import MUnitsForm from '../MUnitsForm';
import PoSActions from "../../PoSActions";

class MUnitsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.measurementUnitId = this.props.match.params.measurementUnitId;
    this.state = MUnitsUpdateStore.getState();
  }

  componentDidMount() {
    document.title = 'Modificar unidad de medida';
    PoSActions.measurementUnits.update.onIdChange(this.measurementUnitId);
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.measurementUnits.update.setRedirectAsCompleted();
      this.props.history.push('/measurement_units');
    }
  }

  componentWillMount() {
    MUnitsUpdateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    MUnitsUpdateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(MUnitsUpdateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.measurementUnits.update.onNameChange(evt.target.value);
  }

  static onAbbrChange(evt) {
    PoSActions.measurementUnits.update.onAbbrChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.measurementUnits.update.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Modificar unidad de medida</h1>
          <br />
          <br />

          <MUnitsForm
            name={ this.state.measurementUnit.name.value }
            nameError={ this.state.measurementUnit.name.error }
            onNameChange={ MUnitsUpdate.onNameChange }
            abbr={ this.state.measurementUnit.abbreviation.value }
            abbrError={ this.state.measurementUnit.abbreviation.error }
            onAbbrChange={ MUnitsUpdate.onAbbrChange }
            onSaveClicked={ MUnitsUpdate.onSaveClicked }
            submitText='Modificar'
          />
        </div>
      </div>
    );
  }
}

export default MUnitsUpdate;
