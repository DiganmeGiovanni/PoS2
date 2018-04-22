import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

class FGAutosuggest extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = { value: '' }
  }

  onChange(evt, { newValue }) {
    this.setState({ value: newValue })
  }

  renderLabel() {
    let id = '';
    if (this.props.id !== null) {
      id = `inp-${id}`;
    }

    return (
      <label htmlFor={ id } className="control-label">
        { this.props.label }
      </label>
    )
  }

  renderError() {
    if (this.props.errMessage == null) {
      return '';
    }

    return (
      <div className="help-block">{ this.props.errMessage }</div>
    )
  }

  render() {
    let fgClass = this.props.errMessage === null
      ? 'form-group'
      : 'form-group has-error';

    return (
      <div className={ fgClass }>
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
            value: this.state.value,
            onChange: this.onChange
          }}
        />

        { this.renderError() }
      </div>
    )
  }
}

FGAutosuggest.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  errMessage: PropTypes.string,
  suggestions: PropTypes.array.isRequired,
  onSugFetchRequested: PropTypes.func.isRequired,
  onSugClearRequested: PropTypes.func.isRequired,
  onSugSelected: PropTypes.func.isRequired,
  getSugValue: PropTypes.func.isRequired,
  renderSug: PropTypes.func.isRequired,
};

FGAutosuggest.defaultProps = {
  id: null,
  errMessage: null,
};

export default FGAutosuggest;
