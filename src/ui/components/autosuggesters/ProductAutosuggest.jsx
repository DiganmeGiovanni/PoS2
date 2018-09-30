import React from 'react';
import PropTypes from "prop-types";
import ProductService from "../../../services/ProductService";
import TBAutosuggest from './TBAutosuggest';

class ProductAutosuggest extends React.Component {
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
        getSugValue={ ProductAutosuggest.getSuggestionValue }
        renderSug={ ProductAutosuggest.renderSuggestion }
        value={ this.props.value }
        onValueChange={ this.props.onValueChange }
        error={ this.props.error }
      />
    )
  }
}

ProductAutosuggest.propTypes = {
  onProductSelected: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default ProductAutosuggest;
