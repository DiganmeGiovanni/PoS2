/**
 * @typedef {object} PAuditOperation
 * @property {number} operation_id
 * @property {string} type
 * @property {Date} date
 * @property {number} quantity
 * @property {string} unit
 * @property {number} unit_price
 * @property {number} price
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from "../../../services/TextFormatter";
import DateFormatter from "../../../services/DateFormatter";

const PAuditOperations = props => {
  const renderOperations = () => {
    if (props.operations.length === 0) {
      return <tr>
        <td colSpan="6" className="text-center">
          <i>Haga click en 'Generar reporte' para auditar el producto</i>
        </td>
      </tr>
    }

    return props.operations.map((operation, index) => {
      return (
        <tr key={`operation-${ index }`}>
          <td>
            <span className={`label label-${ operation.type === 'Venta' ? 'success' : 'default' }`}>
              { operation.type }
            </span>
          </td>
          <td>{ DateFormatter.forHumans(operation.date, false) }</td>
          <td className="text-right">{ operation.quantity }</td>
          <td>{ operation.unit }</td>
          <td className="text-right">
            { TextFormatter.asMoney(operation.unit_price) }
          </td>
          <td className="text-right">
            { TextFormatter.asMoney(operation.price) }
          </td>
          <td className="text-center">
            <button className="btn btn-sm btn-default"
                    onClick={ () => props.onViewDetailsClicked(
                      operation.type === 'Compra' ? '1' : '2',
                      operation.operation_id
                    )}
            >
              <span className="glyphicon glyphicon-eye-open"/>
            </button>
          </td>
        </tr>
      )
    });
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Operaciones</div>
      </div>
      <div className="panel-body">
        <table className="table table-striped table-bordered table-compat">
          <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th className="text-right">Cantidad</th>
            <th>Unidad</th>
            <th className="text-right">Precio unitario</th>
            <th className="text-right">Precio</th>
            <th/>
          </tr>
          </thead>
          <tbody>{ renderOperations() }</tbody>
        </table>
      </div>
    </div>
  );
};

PAuditOperations.propTypes = {
  operations: PropTypes.array.isRequired,
  onViewDetailsClicked: PropTypes.func.isRequired
};

export default PAuditOperations;