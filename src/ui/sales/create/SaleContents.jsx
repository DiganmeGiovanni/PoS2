import React from 'react';
import PropTypes from 'prop-types';
import TextFormatter from '../../../services/TextFormatter';

const SaleContents = ({ contents, total, error, onContentDeleteClicked }) => {

  const renderError = () => {
    if (error !== null) {
      return (
        <div className="alert alert-danger margin-bottom-16">
          <span className="fa fa-warning"/>
          <span>&nbsp;&nbsp;</span>
          <span>{ error }</span>
        </div>
      )
    }

    return '';
  };

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
          <td className="text-center">
            <button className="btn btn-sm btn-default"
                    onClick={() => { onContentDeleteClicked(idx) }}
            >
              <span className="glyphicon glyphicon-trash color-red"/>
            </button>
          </td>
        </tr>
      ))
    } else {
      return (
        <tr>
          <td colSpan="7" className="text-center">
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
        { renderError() }

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr>
              <th>Producto</th>
              <th>¿Autoconsumo?</th>
              <th className="text-right">Cantidad</th>
              <th>Unidad</th>
              <th className="text-right">Precio c/u</th>
              <th className="text-right">Precio</th>
              <th/>
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
              <td>&nbsp;</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
};

SaleContents.propTypes = {
  contents: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  error: PropTypes.string,
  onContentDeleteClicked: PropTypes.func.isRequired
};

export default SaleContents;
