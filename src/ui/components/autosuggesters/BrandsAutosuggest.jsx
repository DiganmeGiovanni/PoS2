import React from 'react';
import PropTypes from 'prop-types';
import BrandsService from '../../../services/BrandsService';
import FGAutosuggest from './FGAutosuggest';

class BrandsAutosuggest extends React.Component {
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
    BrandsService.find(value, 5, suggestions => {
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
        label="Marca"
        errMessage={ this.props.errMessage }
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onBrandSelected }
        getSugValue={ this.getSuggestionValue }
        renderSug={ this.renderSuggestion }
      />
    )
  }
}

BrandsAutosuggest.propTypes = {
  onBrandSelected: PropTypes.func.isRequired,
  errMessage: PropTypes.string,
};

BrandsAutosuggest.defaultProps = {
  errMessage: null
};

export default BrandsAutosuggest