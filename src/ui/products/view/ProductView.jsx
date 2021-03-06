import React from 'react';
import LabelValue from '../../components/LabelValue';
import ProductService from '../../../services/ProductService';
import GoBackTitle from '../../components/GoBackTitle';
import PurchasesHistory from './PurchasesHistory';
import SalesHistory from './SalesHistory';

const moment = require('moment');
import 'moment/locale/es';
moment.locale('es');

class ProductView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.match.params.productId,
      product: { id: null, name: '' },
      purchasePrices: [],
      salePrices: []
    }
  }

  componentDidMount() {
    document.title = 'Detalles de producto';
    ProductService.findOne(this.state.productId).then(product => {
      ProductService.purchasePrices(this.state.productId).then(pPrices => {
        ProductService.salePrices(this.state.productId).then(sPrices => {
          this.setState({
            product: product,
            purchasePrices: pPrices,
            salePrices: sPrices
          });
        });
      });
    });
  }

  renderDetails() {
    if (this.state.product.id === null) {
      return '';
    }

    return (
      <div className="panel panel-default margin-top-32">
        <div className="panel-heading">
          <h5 className="panel-title">Detalles</h5>
        </div>
        <div className="panel-body">
          <div className="row">
            <LabelValue
              label='Descripción'
              value={ this.state.product.description }
              clazz='col-sm-6'
            />

            <LabelValue
              label='Código'
              value={ this.state.product.code }
              clazz='col-sm-3'
            />
            <LabelValue
              label='Marca'
              value={ this.state.product.brand.name }
              clazz='col-sm-3'
            />
          </div>

          <div className="row padding-top-16">
            <LabelValue
              label='Unidad de medida'
              value={ this.state.product.measurementUnit.name }
              clazz='col-sm-3'
            />

            <LabelValue
              label='Stock mínimo'
              value={ this.state.product.minimalExistences }
              clazz='col-sm-3'
            />

            <LabelValue
              label='Fecha de registro'
              value={ moment(this.state.product.createdAt).format('YYYY-MM-DD hh:mm a') }
              clazz='col-sm-3'
            />

            <LabelValue
              label='Última modificación'
              value={ moment(this.state.product.updatedAt).format('YYYY-MM-DD hh:mm a') }
              clazz='col-sm-3'
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <GoBackTitle title="Detalles de producto"/>
        <h3 className="margin-top-4">{ this.state.product.name }</h3>

        { this.renderDetails() }
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h5 className="panel-title">Historial de compras</h5>
              </div>
              <div className="panel-body">
                <PurchasesHistory productId={ this.state.productId }/>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h5 className="panel-title">Historial de ventas</h5>
              </div>
              <div className="panel-body" style={{ maxHeight: '500px', overflowY: 'auto'}}>
                <SalesHistory productId={ this.state.productId }/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductView;
