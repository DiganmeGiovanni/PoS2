import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import TextFormatter from "../../../services/TextFormatter";

const EarningsPricesModal = props => {
  const renderContents = () => {
    return props.salePrices.map((salePrice, idx) => {
      return (
        <tr key={`sold-price-${ idx }`}>
          <td className="text-right">{ salePrice.quantity }</td>
          <td className="text-right">{ TextFormatter.asMoney(salePrice.price) }</td>
          <td className="text-right">{ TextFormatter.asMoney(salePrice.price * salePrice.quantity) }</td>
        </tr>
      )
    });
  };

  return (
    <Modal show={ props.show } onHide={ props.onClose }>
      <Modal.Header>
        <Modal.Title>
          Precios de venta
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-bordered table-striped table-compat">
          <thead>
          <tr>
            <th className="text-right">Cantidad vendida</th>
            <th className="text-right">Precio C/U</th>
            <th className="text-right">Total</th>
          </tr>
          </thead>
          <tbody>
          { renderContents() }
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

EarningsPricesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  salePrices: PropTypes.array.isRequired
};

export default EarningsPricesModal;