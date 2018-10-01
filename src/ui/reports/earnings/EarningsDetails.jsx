import React from 'react';
import PropTypes from 'prop-types';
import LabelValue from "../../components/LabelValue";
import TextFormatter from "../../../services/TextFormatter";
import moment from "moment";

const EarningsDetails = props => {
  const renderContents = () => {
    if (props.details.length === 0) {
      return (
        <tr className="text-center">
          <td colSpan="8">
            <i>Haga click en "Generar reporte" para visualizar el reporte</i>
          </td>
        </tr>
      );
    } else {
      return props.details.map((purchasedProduct, idx) => {
        let fDate = moment(purchasedProduct.date).format('YYYY MMM DD');

        return (
          <tr key={`purchased-product-${ idx }`}>
            <td>{ purchasedProduct.product_name }</td>
            <td>{ fDate }</td>
            <td className="text-right">{ purchasedProduct.quantity }</td>
            <td>{ purchasedProduct.measurement_unit_name }</td>
            <td className="text-right">{ TextFormatter.asMoney(purchasedProduct.price) }</td>
            <td className="text-right">{ TextFormatter.asMoney(purchasedProduct.price * purchasedProduct.quantity) }</td>
            <td className="text-right">{ purchasedProduct.soldQuantity }</td>
            <td className="text-right">{ TextFormatter.asMoney(purchasedProduct.soldEarnings) }</td>
          </tr>
        )
      })
    }
  };

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
                <th className="text-right">Cantidad comprada</th>
                <th>Unidad</th>
                <th className="text-right">Costo C/U</th>
                <th className="text-right">Costo total</th>
                <th className="text-right">Cantidad vendida</th>
                <th className="text-right">Ganancias</th>
              </tr>
              </thead>
              <tbody>
              { renderContents() }
              </tbody>
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