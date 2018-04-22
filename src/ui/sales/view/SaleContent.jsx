import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const SaleContent = ({ contents, isLoadingProducts }) => {
  const makeTableBody = () => {
    if (isLoadingProducts) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            <i>Espere un momento por favor ...</i>
          </td>
        </tr>
      )
    }

    return contents.map((product, idx) => (
      <tr key={ idx }>
        <td>{ product.name }</td>
        <td className="text-right">{ product.quantity }</td>
        <td>{ product.measurement_unit_name }</td>
        <td className="text-right">
          { TextFormatter.asMoney(product.price) }
        </td>
        <td className="text-right">
          { TextFormatter.asMoney(product.total) }
        </td>
      </tr>
    ));
  };

  return (
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
      <tbody>{ makeTableBody() }</tbody>
    </table>
  );
};

SaleContent.propTypes = {
  contents: PropTypes.array.isRequired,
  isLoadingProducts: PropTypes.bool.isRequired
};

export default SaleContent;
