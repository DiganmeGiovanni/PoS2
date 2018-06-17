import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const PurchaseContents = ({ contents, isLoadingProducts }) => {
  const makeTableBody = () => {
    if (isLoadingProducts) {
      return (
        <tr>
          <td colSpan="8" className="text-center">
            <i>Espere un momento por favor ...</i>
          </td>
        </tr>
      )
    }

    return contents.map(product => (
      <tr key={`pc-${ product.purchase_price_id }-${ product.existence_id }`}>
        <td>{ product.provider_name }</td>
        <td>{ product.product_name }</td>
        <td className="text-right">{ product.quantity }</td>
        <td>{ product.measurement_unit }</td>
        <td className="text-right">{ product.sold }</td>
        <td className="text-right">{ product.stock }</td>
        <td className="text-right">
          { TextFormatter.asMoney(product.cost) }
        </td>
        <td className="text-right">
          { TextFormatter.asMoney(product.total) }
        </td>
      </tr>
    ))
  };

  return (
    <table className="table table-striped">
      <thead>
      <tr>
        <th>Proveedor</th>
        <th>Producto</th>
        <th className="text-right">Cantidad</th>
        <th>Unidad</th>
        <th className="text-right">Vendido</th>
        <th className="text-right">En stock (Esta compra)</th>
        <th className="text-right">Costo unitario</th>
        <th className="text-right">Costo</th>
      </tr>
      </thead>
      <tbody>{ makeTableBody() }</tbody>
    </table>
  )
};

PurchaseContents.propTypes = {
  contents: PropTypes.array.isRequired,
  isLoadingProducts: PropTypes.bool.isRequired
};

export default PurchaseContents;
