import React from 'react';
import PropTypes from 'prop-types';

const LabelValue = ({ label, value, clazz }) => {
  return (
    <div className={ clazz }>
      <label>{ label }</label>
      <br/>
      <span>{ value }</span>
    </div>
  )
};

LabelValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,

  clazz: PropTypes.string,
};

LabelValue.defaultProps = {
  clazz: 'col-sm-4'
};

export default LabelValue;
