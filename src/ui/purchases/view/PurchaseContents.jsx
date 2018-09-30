import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const PurchaseContents = ({ contents, isLoadingProducts,
                            onFilterProductChange,
                            onFilterQuantityChange,
                            onFilterSoldChange,
                            onFilterStockChange,
                            onFilterUnitCostChange,
                            onFilterCostChange
                          }) => {
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

    return contents.map((product, idx) => (
      <tr key={`pc-${ idx }`}>
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
        <th>
          <label className="control-label">Producto</label>
          <input type="text" className='form-control' onChange={ onFilterProductChange }/>
        </th>
        <th className="text-right" style={{ width: '106px'}}>
          <label className="control-label">Cantidad</label>
          <input type="text" className='form-control' onChange={ onFilterQuantityChange }/>
        </th>
        <th>
          <label className="control-label">Unidad</label>
          <input type="text" className='form-control' disabled/>
        </th>
        <th className="text-right" style={{ width: '106px'}}>
          <label className="control-label">Vendido</label>
          <input type="text" className='form-control' onChange={ onFilterSoldChange }/>
        </th>
        <th className="text-right" style={{ width: '200px'}}>
          <label className="control-label">En stock (Esta compra)</label>
          <input type="text" className='form-control' onChange={ onFilterStockChange }/>
        </th>
        <th className="text-right">
          <label className="control-label">Costo unitario</label>
          <input type="text" className='form-control' onChange={ onFilterUnitCostChange }/>
        </th>
        <th className="text-right">
          <label className="control-label">Costo</label>
          <input type="text" className='form-control' onChange={ onFilterCostChange }/>
        </th>
      </tr>
      </thead>
      <tbody>{ makeTableBody() }</tbody>
    </table>
  )
};

PurchaseContents.propTypes = {
  contents: PropTypes.array.isRequired,
  isLoadingProducts: PropTypes.bool.isRequired,

  onFilterProductChange: PropTypes.func.isRequired,
  onFilterQuantityChange: PropTypes.func.isRequired,
  onFilterSoldChange: PropTypes.func.isRequired,
  onFilterStockChange: PropTypes.func.isRequired,
  onFilterUnitCostChange: PropTypes.func.isRequired,
  onFilterCostChange: PropTypes.func.isRequired,
};

export default PurchaseContents;
