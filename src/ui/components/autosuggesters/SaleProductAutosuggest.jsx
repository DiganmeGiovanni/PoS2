import React from 'react';
import TBAutosuggest from './TBAutosuggest';
import PropTypes from "prop-types";
import ProductService from "../../../services/ProductService";

class SaleProductAutosuggest extends React.Component {
  constructor() {
    super();
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

    this.state = { suggestions: [] };
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
    ProductService.find(value, 5, suggestions => {
      this.setState({ suggestions: suggestions });
    });
  }

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  render() {
    return (
      <TBAutosuggest
        label="Producto"
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onProductSelected }
        getSugValue={ SaleProductAutosuggest.getSuggestionValue }
        renderSug={ SaleProductAutosuggest.renderSuggestion }
        value={ this.props.value }
        onValueChange={ this.props.onValueChange }
      />
    )
  }
}

SaleProductAutosuggest.propTypes = {
  onProductSelected: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default SaleProductAutosuggest;
