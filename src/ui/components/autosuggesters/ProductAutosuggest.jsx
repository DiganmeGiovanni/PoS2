import React from 'react';
import PropTypes from "prop-types";
import ProductService from "../../../services/ProductService";
import FGAutosuggest from "./FGAutosuggest";

class ProductAutosuggest extends React.Component {
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
    ProductService.find(value, 5, suggestions => {
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
        label="Producto"
        errMessage={ this.props.errMessage }
        suggestions={ this.state.suggestions }
        onSugFetchRequested={ this.onSuggestionsFetchRequested }
        onSugClearRequested={ this.onSuggestionsClearRequested }
        onSugSelected={ this.props.onProductSelected }
        getSugValue={ this.getSuggestionValue }
        renderSug={ this.renderSuggestion }
      />
    )
  }
}

ProductAutosuggest.propTypes = {
  onProductSelected: PropTypes.func.isRequired,
  errMessage: PropTypes.string,
};

ProductAutosuggest.defaultProps = {
  errMessage: null
};

export default ProductAutosuggest;