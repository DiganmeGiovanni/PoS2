import React from 'react';
import { Product } from '../../model/entities';
import ProductsForm from './ProductsForm';

class ProductsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      product: Product.build(),
    };
  }

  componentDidMount() {
    document.title = 'Registrar producto';
  }

  onSubmit(product, history) {
    product.save().then(() => {
      this.setState({ product: product });
      history.push('/products')
    });
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Nuevo producto</h1>
          <br />
          <br />

          <ProductsForm
            onSubmit={this.onSubmit}
            product={this.state.product}
          />
        </div>
      </div>
    )
  }
}

export default ProductsCreate;
