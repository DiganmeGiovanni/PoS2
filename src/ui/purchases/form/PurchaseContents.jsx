import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from "../../../services/TextFormatter";

const PurchaseContents = ({ contents, totalCost, errMessage }) => {

  const renderContents = () => {
    if (contents.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            <i>Sin productos</i>
          </td>
        </tr>
      );
    } else {
      return contents.map((inOrder, idx) => {
        return (
          <tr key={`in_order-${ idx }`}>
            <td>{ inOrder.provider.name }</td>
            <td>{ inOrder.product.name }</td>
            <td className="text-right">{ inOrder.quantity }</td>
            <td className="text-center">Pieza</td>
            <td className="text-right">
              { TextFormatter.asMoney(inOrder.price) }
            </td>
            <td className="text-right">
              { TextFormatter.asMoney(inOrder.cost) }
            </td>
            <td className="text-right">
              { TextFormatter.asMoney(inOrder.cost * inOrder.quantity) }
            </td>
          </tr>
        );
      })
    }
  };

  const renderError = () => {
    if (errMessage === '') {
      return '';
    } else {
      return (
        <div className="alert alert-danger">
          <p>{ errMessage }</p>
        </div>
      )
    }
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4 className="panel-title">Productos en la compra</h4>
      </div>
      <div className="panel-body">
        { renderError() }

        <table className="table table-striped">
          <thead>
          <tr>
            <th>Proveedor</th>
            <th>Producto</th>
            <th className="text-right">Cantidad</th>
            <th className="text-center">Unidad</th>
            <th className="text-right">Precio</th>
            <th className="text-right">Costo C/U</th>
            <th className="text-right">Costo</th>
          </tr>
          </thead>
          <tbody>{ renderContents() }</tbody>
          <tfoot>
          <tr>
            <td/>
            <td/>
            <td/>
            <td/>
            <td/>
            <td/>
            <td className="text-right text-bold">
              <b>{ TextFormatter.asMoney(totalCost) }</b>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
};

PurchaseContents.propTypes = {
  contents: PropTypes.array.isRequired,
  totalCost: PropTypes.number.isRequired,
  errMessage: PropTypes.string.isRequired
};

export default PurchaseContents;
