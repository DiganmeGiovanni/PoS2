import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const PurchaseContents = ({ contents, total, totalPaid, onTotalPaidChange, error,
                            onDeleteClicked, onEditClicked }) => {
  const renderContents = () => {
    if (contents.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            <i>Sin productos</i>
          </td>
        </tr>
      )
    } else {
      return contents.map((inOrder, idx) => {
        return (
          <tr key={`in_order-${ idx }`}>
            <td>{ inOrder.product.value.name }</td>
            <td className="text-right">{ inOrder.quantity.value }</td>
            <td>{ inOrder.product.value.measurementUnit.abbreviation }</td>
            <td className='text-right' style={{ width: '100px' }}>
              { TextFormatter.asMoney(inOrder.price.value) }
            </td>
            <td className='text-right' style={{ width: '130px' }}>
              { TextFormatter.asMoney( inOrder.cost.value )}
            </td>
            <td className="text-right" style={{ width: '100px' }}>
              { TextFormatter.asMoney( inOrder.cost.value * inOrder.quantity.value) }
            </td>
            <td className='text-right' style={{ width: '100px' }}>
              <button className='btn btn-sm btn-default'
                      onClick={ () => { onEditClicked(idx) }}>
                <span className="glyphicon glyphicon-pencil"/>
              </button>
              <span>&nbsp;&nbsp;</span>
              <button className="btn btn-sm btn-default color-red"
                      onClick={ () => { onDeleteClicked(idx) }}>
                <span className="glyphicon glyphicon-trash"/>
              </button>
            </td>
          </tr>
        );
      });
    }
  };
  
  const renderError = () => {
    if (error === '') {
      return '';
    } else {
      return (
        <div className="alert alert-danger">
          <p>{ error }</p>
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

        <table className="table table-striped table-compat">
          <thead>
          <tr>
            <th>Producto</th>
            <th className="text-right">Cantidad</th>
            <th className="text-center">Unidad</th>
            <th className="text-right">Precio</th>
            <th className="text-right">Costo unitario</th>
            <th className="text-right">Costo</th>
            <th/>
          </tr>
          </thead>
          <tbody>{ renderContents() }</tbody>
          <tfoot>
          <tr>
            <td/>
            <td/>
            <td/>
            <td className="text-right" colSpan="2">
              <b>Costo total:</b>
            </td>
            <td className="text-right text-bold">
              <b>{ TextFormatter.asMoney(total) }</b>
            </td>
            <td/>
          </tr>
          <tr>
            <td/>
            <td/>
            <td/>
            <td className="text-right" colSpan="2">
              <b>Total pagado:</b>
            </td>
            <td className="text-right" style={{ width: '104px'}}>
              <input
                type="text"
                className="form-control"
                onChange={ onTotalPaidChange }
                value={ totalPaid }
                style={{
                  margin: '0',
                  textAlign: 'right'
                }}
              />
            </td>
            <td/>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
};

PurchaseContents.propTypes = {
  contents: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  totalPaid: PropTypes.string.isRequired,
  onTotalPaidChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
  onEditClicked: PropTypes.func.isRequired
};

export default PurchaseContents;
