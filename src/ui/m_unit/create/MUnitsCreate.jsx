import React from 'react';
import MUnitsForm from '../MUnitsForm';
import MUnitsCreateStore from './MUnitsCreateStore';
import PoSActions from '../../PoSActions';

class MUnitsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = MUnitsCreateStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar unidad de medida';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.measurementUnits.create.setRedirectAsCompleted();
      this.props.history.push('/measurement_units');
    }
  }

  componentWillMount() {
    MUnitsCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    MUnitsCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(MUnitsCreateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.measurementUnits.create.onNameChange(evt.target.value);
  }

  static onAbbrChange(evt) {
    PoSActions.measurementUnits.create.onAbbrChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.measurementUnits.create.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Nueva unidad de medida</h1>
          <br />
          <br />

          <MUnitsForm
            name={ this.state.measurementUnit.name.value }
            nameError={ this.state.measurementUnit.name.error }
            onNameChange={ MUnitsCreate.onNameChange }
            abbr={ this.state.measurementUnit.abbreviation.value }
            abbrError={ this.state.measurementUnit.abbreviation.error }
            onAbbrChange={ MUnitsCreate.onAbbrChange }
            onSaveClicked={ MUnitsCreate.onSaveClicked }
          />
        </div>
      </div>
    );
  }
}

export default MUnitsCreate;
