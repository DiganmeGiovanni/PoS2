import React from 'react';
import ProductService from '../../../services/ProductService';
import TextFormatter from '../../../services/TextFormatter';

const moment = require('moment');
import 'moment/locale/es';
moment.locale('es')

class ProductView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.match.params.productId,
      product: { name: '' },
      purchasePrices: []
    }
  }

  componentDidMount() {
    document.title = 'Detalles de producto';
    ProductService.findOne(this.state.productId).then(product => {
      ProductService.purchasePrices(this.state.productId).then(pPrices => {
        this.setState({
          product: product,
          purchasePrices: pPrices
        });

        console.log(this.state)
      });
    });
  }

  renderPurchasePricesRows() {
    return this.state.purchasePrices.map(pPrice => (
      <tr>
        <td>{ moment(pPrice.date).format('YYYY-MM-DD hh:mm a') }</td>
        <td className="text-right">
          { TextFormatter.asMoney(pPrice.price) }
        </td>
      </tr>
    ))
  }

  render() {
    return (
      <div className="container">
        <h1>Detalles de producto</h1>
        <h3 className="margin-top-4">{ this.state.product.name }</h3>

        <div className="row margin-top-32">
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="panel-title">Historial de precios de compra</div>
              </div>
              <div className="panel-body">
                <table className="table table-striped">
                  <thead>
                  <tr>
                    <th>Fecha</th>
                    <th className="text-right">Precio</th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.renderPurchasePricesRows() }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductView;
