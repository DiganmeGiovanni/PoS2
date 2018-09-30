import React from 'react'
import PropTypes from 'prop-types';
import ProductService from '../../../services/ProductService';
import TextFormatter from "../../../services/TextFormatter";
import {Link} from "react-router-dom";
import 'moment/locale/es';

const moment = require('moment');
moment.locale('es');

class PurchasesHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purchases: []
    }
  }

  componentDidMount() {
    let productId = this.props.productId;
    ProductService.purchasesHistory(productId, response => {
      this.setState({ purchases: response[0] });
    })
  }

  renderPurchases() {
    if (this.state.purchases.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            <i>Sin registros para mostrar</i>
          </td>
        </tr>
      );
    }

    return this.state.purchases.map((purchase, index) => {
      return (
        <tr key={`purchase-${ index }`}>
          <td>{ purchase.provider_name }</td>
          <td>{ moment(purchase.date).format('YYYY-MM-DD hh:mm a') }</td>
          <td className="text-right">{ TextFormatter.asMoney(purchase.price) }</td>
          <td className="text-center">
            <Link
              to={`/purchase/${ purchase.purchase_id }`}
              title="Ver contenido"
              className="btn btn-sm btn-default"
            >
              <span className="glyphicon glyphicon-eye-open"/>
            </Link>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            { this.renderPurchases() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

PurchasesHistory.propTypes = {
  productId: PropTypes.string.isRequired
};

export default PurchasesHistory;
