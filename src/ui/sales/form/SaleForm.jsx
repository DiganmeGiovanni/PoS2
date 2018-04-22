import React from 'react';
import PropTypes from 'prop-types';

const DatePicker = require('react-datetime');
import "moment/locale/es";

const SaleForm = ({ date, selfConsumption, onDateChange, onSelfConsumptionChange }) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Venta</div>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="control-label">
                Fecha
              </label>

              <br/>
              <DatePicker
                dateFormat="DD MMMM, YYYY"
                timeFormat={ false }
                locale="es"
                viewMode="years"
                closeOnSelect={ true }
                closeOnTab={ true }
                onChange={ onDateChange }
                value={ date }
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="control-label">Autoconsumo</label>
              <select
                id="inp-self_consumption"
                name="self_consumption"
                className="form-control"
                onChange={ onSelfConsumptionChange }
                value={selfConsumption ? '1' : '0' }
              >
                <option value="0">No</option>
                <option value="1">Si</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SaleForm.propTypes = {
  date: PropTypes.object.isRequired,
  selfConsumption: PropTypes.bool.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSelfConsumptionChange: PropTypes.func.isRequired
};

export default SaleForm;
