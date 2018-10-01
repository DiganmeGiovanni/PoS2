import React from 'react';
import PropTypes from 'prop-types';
import LabelValue from "../../components/LabelValue";
import TextFormatter from "../../../services/TextFormatter";

const EarningsDetails = props => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Ventas y ganancias</div>
      </div>
      <div className="panel-body">
        <div className="row text-center">
          <LabelValue
            label="Total vendido"
            value={ TextFormatter.asMoney(props.totalSold) }
          />

          <LabelValue
            label="Total ganancias"
            value={ TextFormatter.asMoney(props.totalEarnings) }
          />

          <LabelValue
            label="Total autoconsumo"
            value={ TextFormatter.asMoney(props.totalSelfConsumption) }
          />
        </div>

        <div className="row">
          <div className="col-xs-12 padding-top-16">
            <table className="table table-bordered table-striped table-compat">
              <thead>
              <tr>
                <th>Producto</th>
                <th>Fecha de compra</th>
                <th>Cantidad comprada</th>
                <th>Unidad</th>
                <th>Costo C/U</th>
                <th>Costo total</th>
                <th>Cantidad vendida</th>
                <th>Ganancias</th>
              </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

EarningsDetails.propTypes = {
  totalSold: PropTypes.number.isRequired,
  totalEarnings: PropTypes.number.isRequired,
  totalSelfConsumption: PropTypes.number.isRequired,

  details: PropTypes.array.isRequired
};

export default EarningsDetails;