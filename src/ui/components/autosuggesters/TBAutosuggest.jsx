import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

class TBAutosuggest extends React.Component {
  constructor(props) {
    super(props);

  }

  renderLabel() {
    let inpId = '';
    if (this.props.inpId !== null) {
      inpId = this.props.inpId
    }

    return (
      <label htmlFor={ inpId } className="control-label">
        { this.props.label }
      </label>
    )
  }

  render() {
    return (
      <div className="form-group">
        { this.renderLabel() }

        <Autosuggest
          suggestions={ this.props.suggestions }
          onSuggestionsFetchRequested={ this.props.onSugFetchRequested }
          onSuggestionsClearRequested={ this.props.onSugClearRequested }
          onSuggestionSelected={ this.props.onSugSelected }
          getSuggestionValue={ this.props.getSugValue }
          renderSuggestion={ this.props.renderSug }

          inputProps={{
            className: 'form-control',
            placeholder: 'Comience a escribir para búscar',
            value: this.props.value,
            onChange: this.props.onValueChange
          }}
        />
      </div>
    )
  }
}

TBAutosuggest.propTypes = {
  inpId: PropTypes.string,
  label: PropTypes.string.isRequired,

  // Autosuggest specific callbacks
  suggestions: PropTypes.array.isRequired,
  onSugFetchRequested: PropTypes.func.isRequired,
  onSugClearRequested: PropTypes.func.isRequired,
  onSugSelected: PropTypes.func.isRequired,
  getSugValue: PropTypes.func.isRequired,
  renderSug: PropTypes.func.isRequired,

  // Custom prop to keep input value synced with
  // another components
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

TBAutosuggest.defaultProps = {
  id: null
};

export default TBAutosuggest;
