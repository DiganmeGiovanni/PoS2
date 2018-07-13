import React from 'react';
import PropTypes from 'prop-types';
import MeasurementUnitService from '../../../services/MeasurementUnitService';
import TBAutosuggest from './TBAutosuggest';

class MeasurementUnitAutosuggest extends React.Component {
  constructor() {
    super();
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

    this.state = { value: '', suggestions: [] };
  }

  static getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  static renderSuggestion(suggestion) {
    return (
      <div className="suggestion-item">
        { suggestion.name }
      </div>
    )
  }

  onSuggestionsFetchRequested({ value }) {
    MeasurementUnitService.find(value, 5, suggestions => {
      this.setState({ suggestions: suggestions });
    });
  }

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  render() {
    return (
      <TBAutosuggest
        label="Unidad de medida"
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onMeasurementUnitSelected }
        getSugValue={ MeasurementUnitAutosuggest.getSuggestionValue }
        renderSug={ MeasurementUnitAutosuggest.renderSuggestion }
        value={ this.props.value }
        onValueChange={ this.props.onValueChange }
        error={ this.props.error }
      />
    );
  }
}

MeasurementUnitAutosuggest.propTypes = {
  onMeasurementUnitSelected: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default MeasurementUnitAutosuggest
