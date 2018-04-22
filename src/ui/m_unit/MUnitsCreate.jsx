import React from 'react';
import MUnitsForm from './MUnitsForm';
import { MeasurementUnit } from '../../model/entities';

class MUnitsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      mUnit: MeasurementUnit.build(),
    };
  }

  componentDidMount() {
    document.title = 'Registrar unidad de medida';
  }

  onSubmit(mUnit, history) {
    mUnit.save().then(() => {
      this.setState({
        mUnit,
      });

      history.push('/measurement_units');
    });
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Nueva unidad de medida</h1>
          <br />
          <br />

          <MUnitsForm
            onSubmit={this.onSubmit}
            mUnit={this.state.mUnit}
          />
        </div>
      </div>
    );
  }
}

export default MUnitsCreate;
