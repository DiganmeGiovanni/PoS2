import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const SaleContent = ({ contents, total, errMessage }) => {
  const renderContents = () => {
    if (contents.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            <i>Sin productos agregados</i>
          </td>
        </tr>
      );
    } else {
      return contents.map((inOrder, idx) => (
        <tr key={`in-sale-${ idx }`}>
          <td>{ inOrder.product.name }</td>
          <td className="text-right">{ inOrder.quantity }</td>
          <td>Pieza</td>
          <td className="text-right">
            { TextFormatter.asMoney(inOrder.price) }
          </td>
          <td className="text-right">
            { TextFormatter.asMoney(inOrder.price * inOrder.quantity) }
          </td>
        </tr>
      ))
    }
  };

  const renderError = () => {
    if (errMessage === '') {
      return '';
    }

    return (
      <div className="alert alert-danger">
        <p>{ errMessage }</p>
      </div>
    )
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4 className="panel-title">Productos en la venta</h4>
      </div>
      <div className="panel-body">
        { renderError() }

        <table className="table table-striped">
          <thead>
          <tr>
            <th>Producto</th>
            <th className="text-right">Cantidad</th>
            <th>Unidad</th>
            <th className="text-right">Precio C/U</th>
            <th className="text-right">Precio</th>
          </tr>
          </thead>
          <tbody>{ renderContents() }</tbody>
          <tfoot>
          <tr>
            <td/>
            <td/>
            <td/>
            <td/>
            <td className="text-right text-bold">
              <b>{ TextFormatter.asMoney(total) }</b>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

SaleContent.propTypes = {
  contents: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  errMessage: PropTypes.string.isRequired
};

export default SaleContent;
