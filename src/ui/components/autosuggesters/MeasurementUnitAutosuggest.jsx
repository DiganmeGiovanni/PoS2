import React from 'react';
import PropTypes from 'prop-types';
import MeasurementUnitService from '../../../services/MeasurementUnitService';
import FGAutosuggest from './FGAutosuggest';

class MeasurementUnitAutosuggest extends React.Component {
  constructor() {
    super();
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

    this.state = { value: '', suggestions: [] };
  }

  // noinspection JSMethodCanBeStatic
  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  onSuggestionsFetchRequested({ value }) {
    MeasurementUnitService.find(value, 5, suggestions => {
      this.setState({ suggestions: suggestions });
    });
  }

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  // noinspection JSMethodCanBeStatic
  renderSuggestion(suggestion) {
    return (
      <div className="suggestion-item">
        { suggestion.name }
      </div>
    )
  }

  render() {
    return (
      <FGAutosuggest
        label="Unidad de medida"
        errMessage={ this.props.errMessage }
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onSuggestionSelected }
        getSugValue={ this.getSuggestionValue }
        renderSug={ this.renderSuggestion }
      />
    )
  }
}

MeasurementUnitAutosuggest.propTypes = {
  onSuggestionSelected: PropTypes.func.isRequired,
  errMessage: PropTypes.string,
};

MeasurementUnitAutosuggest.defaultProps = {
  errMessage: null
};

export default MeasurementUnitAutosuggest