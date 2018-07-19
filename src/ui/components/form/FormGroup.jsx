import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({ label, id, name, type, errMessage, handleChange, addOnStart, addOnEnd, inpProps }) => {
  const makeInput = () => {
    if (typeof addOnEnd !== 'undefined' || typeof addOnStart !== 'undefined') {
      return (
        <div className="input-group">
          { typeof addOnStart !== 'undefined' ? <div className='input-group-addon'>{ addOnStart }</div> : '' }

          <input
            id={ inpId }
            name={ name }
            type={ type }
            className='form-control'
            onChange={ handleChange }
            { ...inpProps }
          />

          { typeof addOnEnd !== 'undefined' ? <div className='input-group-addon'>{ addOnEnd }</div> : '' }
        </div>
      )
    } else {
      return <input
        id={ inpId }
        name={ name }
        type={ type }
        className='form-control'
        onChange={ handleChange }
        { ...inpProps }
      />
    }
  };

  let inpId = id;
  if (id !== null) {
    inpId = `inp-${name}`;
  }

  const lbl = <label className={'control-label'} htmlFor="inpId">{label}</label>;
  const inp = makeInput();
  const helpBlock = errMessage !== null && errMessage !== ''
    ? <span className={'help-block'}>{errMessage}</span>
    : null;

  let fgClass = 'form-group ';
  fgClass += errMessage !== null && errMessage !== ''
    ? 'has-error'
    : '';
  return (
    <div className={ fgClass }>
      {lbl}
      {inp}

      {helpBlock}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  errMessage: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  inpProps: PropTypes.object,
  addOnStart: PropTypes.string,
  addOnEnd: PropTypes.string
};

FormGroup.defaultProps = {
  id: null,
  errMessage: null,
};

export default FormGroup;
