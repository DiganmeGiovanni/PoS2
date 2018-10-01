import React from 'react';
import PropTypes from 'prop-types';

const DatePicker = require('react-datetime');

const EarningsForm = props => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Rango de fechas</div>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-sm-4">
            <label className="control-label">Desde el</label>
            <DatePicker
              dateFormat="YYYY, MMMM DD"
              timeFormat={ false }
              locale="es"
              viewMode="years"
              closeOnSelect={ true }
              closeOnTab={ true }
              onChange={ props.onStartDateChange }
              value={ props.startDate }
            />
          </div>

          <div className="col-sm-4">
            <label className="control-label">Hasta el</label>
            <DatePicker
              dateFormat="YYYY, MMMM DD"
              timeFormat={ false }
              locale="es"
              viewMode="years"
              closeOnSelect={ true }
              closeOnTab={ true }
              onChange={ props.onEndDateChange }
              value={ props.endDate }
            />
          </div>

          <div className="col-sm-4 padding-top-24">
            <button className="btn btn-primary"
                    onClick={ props.onGenerateReportClicked }
            >
              <span>Generar reporte</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EarningsForm.propTypes = {
  startDate: PropTypes.object.isRequired,
  onStartDateChange: PropTypes.func.isRequired,

  endDate: PropTypes.object.isRequired,
  onEndDateChange: PropTypes.func.isRequired,

  onGenerateReportClicked: PropTypes.func.isRequired
};

export default EarningsForm;
