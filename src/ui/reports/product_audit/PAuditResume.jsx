import React from 'react';
import PropTypes from 'prop-types';
import LabelValue from '../../components/LabelValue';
import TextFormatter from "../../../services/TextFormatter";

const PAuditResume = props => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">Resumen de operaciones en el periodo</div>
      </div>
      <div className="panel-body">
        <div className="row">
          <LabelValue
            label="Total comprado"
            value={ TextFormatter.asMoney(props.purchasesTotal) }
            clazz="col-sm-6 col-md-3"
          />

          <LabelValue
            label="Total vendido"
            value={ TextFormatter.asMoney(props.salesTotal) }
            clazz="col-sm-6 col-md-3"
          />

          <LabelValue
            label="Ganancias"
            value={ TextFormatter.asMoney(props.gain) }
            clazz="col-sm-6 col-md-3"
          />
        </div>
      </div>
    </div>
  );
};

PAuditResume.propTypes = {
  purchasesTotal: PropTypes.number.isRequired,
  salesTotal: PropTypes.number.isRequired,
  gain: PropTypes.number.isRequired
};

export default PAuditResume;