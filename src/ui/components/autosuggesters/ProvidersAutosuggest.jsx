import React from 'react';
import PropTypes from 'prop-types';
import FGAutosuggest from "./FGAutosuggest";
import ProvidersService from "../../../services/ProvidersService";

class ProvidersAutosuggest extends React.Component {
  constructor(props) {
    super(props);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

    this.state = { value: '', suggestions: [] };
  }

  // noinspection JSMethodCanBeStatic
  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  onSuggestionsFetchRequested({ value }) {
    ProvidersService.find(value, 5, suggestions => {
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
        label="Proveedor"
        errMessage={ this.props.errMessage }
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onProviderSelected }
        getSugValue={ this.getSuggestionValue }
        renderSug={ this.renderSuggestion }
      />
    );
  }
}

ProvidersAutosuggest.propTypes = {
  onProviderSelected: PropTypes.func.isRequired,
  errMessage: PropTypes.string
};

ProvidersAutosuggest.defaultProps = {
  errMessage: null
};

export default ProvidersAutosuggest;