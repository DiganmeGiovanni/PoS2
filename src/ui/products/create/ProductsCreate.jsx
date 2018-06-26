import React from 'react';
import ProductForm from '../ProductForm';
import ProductCreateStore from './ProductCreateStore';
import PoSActions from '../../PoSActions';

class ProductsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = ProductCreateStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar producto';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.products.create.setRedirectAsCompleted();
      this.props.history.push('/products');
    }
  }

  componentWillMount() {
    ProductCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ProductCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(ProductCreateStore.getState());
  }

  static onBrandChange(e, { suggestion }) {
    PoSActions.products.create.onBrandChange(suggestion);
  }

  static onMeasurementUnitChange(e, { suggestion }) {
    PoSActions.products.create.onMeasurementUnitChange(suggestion);
  }

  static onNameChange(e) {
    PoSActions.products.create.onNameChange(e.target.value);
  }

  static onCodeChange(e) {
    PoSActions.products.create.onCodeChange(e.target.value);
  }

  static onDescriptionChange(e) {
    PoSActions.products.create.onDescriptionChange(e.target.value);
  }

  static onMinExistencesChange(e) {
    PoSActions.products.create.onMinExistencesChange(e.target.value);
  }

  static onSaveClicked(e) {
    e.preventDefault();
    PoSActions.products.create.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Nuevo producto</h1>
          <br />
          <br />

          <ProductForm
            brandErr={ this.state.product.brand.errMessage }
            onBrandChange={ ProductsCreate.onBrandChange }
            measurementUnitErr={ this.state.product.measurementUnit.errMessage }
            onMeasurementUnitChange={ ProductsCreate.onMeasurementUnitChange }
            name={ this.state.product.name.value }
            nameErr={ this.state.product.name.errMessage }
            onNameChange={ ProductsCreate.onNameChange }
            code={ this.state.product.code.value }
            codeErr={ this.state.product.code.errMessage }
            onCodeChange={ ProductsCreate.onCodeChange }
            description={ this.state.product.description.value }
            descriptionErr={ this.state.product.description.errMessage }
            onDescriptionChange={ ProductsCreate.onDescriptionChange }
            minExistences={ this.state.product.minExistences.value }
            minExistencesErr={ this.state.product.minExistences.errMessage }
            onMinExistencesChange={ ProductsCreate.onMinExistencesChange }
            onSaveClicked={ ProductsCreate.onSaveClicked }/>
        </div>
      </div>
    )
  }
}

export default ProductsCreate;
