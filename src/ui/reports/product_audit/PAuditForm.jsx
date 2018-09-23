import React from 'react';
import PropTypes from 'prop-types';
import ProductAutosuggest from '../../components/autosuggesters/ProductAutosuggest';

const DatePicker = require('react-datetime');

const PAuditForm = props => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Producto a auditar</div>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <ProductAutosuggest
              onProductSelected={ props.onProductSelected }
              value={ props.productAutocompleteValue }
              onValueChange={ props.onProductAutocompleteValueChange }
              error={ props.productError }
            />
          </div>

          <div className="col-sm-6 col-md-3">
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

          <div className="col-sm-6 col-md-3">
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

          <div className="col-sm-6 col-md-3">
            <label className="control-label">Movimientos</label>
            <select onChange={ props.onOperationsTypeChange }
                    value={ props.operationsType }
                    className="form-control"
            >
              <option value="0">Todos</option>
              <option value="1">Solo compras</option>
              <option value="2">Solo ventas</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <button className="btn btn-primary"
                    onClick={ props.onGenerateReportClicked }
            >
              Generar reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PAuditForm.propTypes = {
  productAutocompleteValue: PropTypes.string.isRequired,
  onProductAutocompleteValueChange: PropTypes.func.isRequired,
  onProductSelected: PropTypes.func.isRequired,
  productError: PropTypes.string.isRequired,

  startDate: PropTypes.object.isRequired,
  onStartDateChange: PropTypes.func.isRequired,

  endDate: PropTypes.object.isRequired,
  onEndDateChange: PropTypes.func.isRequired,

  operationsType: PropTypes.string.isRequired,
  onOperationsTypeChange: PropTypes.func.isRequired,

  onGenerateReportClicked: PropTypes.func.isRequired
};

export default PAuditForm;