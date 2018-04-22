import React from 'react';
import BrandsForm from './BrandsForm';
import { Brand } from '../../model/entities';

class BrandsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      brand: Brand.build(),
    };
  }

  componentDidMount() {
    document.title = 'Registrar marca';
  }

  onSubmit(brand, history) {
    brand.save().then(() => {
      this.setState({
        brand,
      });

      history.push('/brands');
    });
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Nueva marca</h1>
          <br />

          <BrandsForm
            onSubmit={this.onSubmit}
            brand={this.state.brand}
          />
        </div>
      </div>
    );
  }
}

export default BrandsCreate;
