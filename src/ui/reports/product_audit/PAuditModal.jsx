import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import SaleView from "../../sales/view/SaleView";
import PurchaseView from "../../purchases/view/PurchaseView";

const PAuditModal = props => {
  let match = { params: {}};
  if (props.operationType === '1') {
    match.params.purchaseId = props.operationId;
  } else {
    match.params.saleId = props.operationId;
  }

  const renderContent = () => {
    if (props.operationType === '1') {
      return <PurchaseView match={ match } embeddedMode={ true } />;
    } else if (props.operationType === '2') {
      return <SaleView match={ match } embeddedMode={ true }/>
    } else {
      return '';
    }
  };

  return (
    <Modal show={ props.show } onHide={ props.onClose } bsSize="large">
      <Modal.Body>
        { renderContent() }
      </Modal.Body>
    </Modal>
  );
};

PAuditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  operationType: PropTypes.string.isRequired,
  operationId: PropTypes.number.isRequired
};

export default PAuditModal;