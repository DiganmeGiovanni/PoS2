import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const SaleContents = ({ contents, total }) => {

  const renderContents = () => {
    if (contents.length > 0) {
      return contents.map((content, idx) => (
        <tr key={`sale-content-${ idx }`}>
          <td>{content.product.name}</td>
          <td>{content.selfConsumption ? 'Si' : 'No'}</td>
          <td className="text-right">{content.quantity}</td>
          <td>{content.product.measurementUnit.name}</td>
          <td className="text-right" style={{ width: '105px' }}>
            {TextFormatter.asMoney(content.price)}
          </td>
          <td className="text-right" style={{ width: '105px' }}>
            {TextFormatter.asMoney(content.price * content.quantity)}
          </td>
        </tr>
      ))
    } else {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            <i>Sin contenido agregado</i>
          </td>
        </tr>
      )
    }
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Contenido de la venta</div>
      </div>
      <div className="panel-body">
        {/* TODO Show global error */}

        <table className="table table-striped">
          <thead>
          <tr>
            <th>Producto</th>
            <th>¿Autoconsumo?</th>
            <th className="text-right">Cantidad</th>
            <th>Unidad</th>
            <th className="text-right">Precio c/u</th>
            <th className="text-right">Precio</th>
          </tr>
          </thead>
          <tbody>
            { renderContents() }
          </tbody>
          <tfoot>
          <tr>
            <td className="text-right" colSpan="6">
              <b>{ TextFormatter.asMoney(total) }</b>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
};

SaleContents.propTypes = {
  contents: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

export default SaleContents;
