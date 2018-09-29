import React from 'react';
import PropTypes from 'prop-types';

const ButtonSave = props => {
  const renderLabel = () => {
    if (props.saving) {
      return <span className="fas fa-spin fa-spinner"/>
    } else {
      return <span>{ props.label }</span>
    }
  };

  return (
    <button
      className="btn btn-success"
      onClick={ props.onClick }
      disabled={ props.saving }
    >
      { renderLabel() }
    </button>
  );
};

ButtonSave.propTypes = {
  label: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ButtonSave;
