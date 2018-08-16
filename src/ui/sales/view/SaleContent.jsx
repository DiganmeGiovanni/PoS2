import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const SaleContent = ({ contents, isLoadingProducts,
                       onFilterByProductChange,
                       onFilterBySelfConsumptionChange,
                       onFilterByQuantityChange,
                       onFilterByMUnitChange,
                       onFilterByUnitPriceChange,
                       onFilterByPriceChange
                   }) => {
  const makeTableBody = () => {
    if (isLoadingProducts) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            <i>Espere un momento por favor ...</i>
          </td>
        </tr>
      )
    }

    return contents.map((product, idx) => (
      <tr key={ idx }>
        <td>{ product.name }</td>
        <td>{ product.self_consumption ? 'Si' : 'No' }</td>
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
        <th>
          <label className="control-label">Producto</label>
          <input type="text" className='form-control' onChange={ onFilterByProductChange }/>
        </th>
        <th>
          <label className="control-label">¿Autoconsumo?</label>
          <select onChange={ onFilterBySelfConsumptionChange } className="form-control">
            <option value="">Todos</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </th>
        <th className="text-right">
          <label className="control-label">Cantidad</label>
          <input type="text" className='form-control' onChange={ onFilterByQuantityChange }/>
        </th>
        <th>
          <label className="control-label">Unidad</label>
          <input type="text" className='form-control' onChange={ onFilterByMUnitChange }/>
        </th>
        <th className="text-right">
          <label className="control-label">Precio unitario</label>
          <input type="text" className='form-control' onChange={ onFilterByUnitPriceChange }/>
        </th>
        <th className="text-right">
          <label className="control-label">Precio</label>
          <input type="text" className='form-control' onChange={ onFilterByPriceChange }/>
        </th>
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
