import React from 'react'
import PropTypes from 'prop-types';
import ProductService from '../../../services/ProductService';
import TextFormatter from "../../../services/TextFormatter";
import {Link} from "react-router-dom";
import 'moment/locale/es';

const moment = require('moment');
moment.locale('es');

class SalesHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sales: []
    }
  }

  componentDidMount() {
    let productId = this.props.productId;
    ProductService.salesHistory(productId, response => {
      this.setState({ sales: response[0] });
    })
  }

  renderSales() {
    if (this.state.sales.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            <i>Sin registros para mostrar</i>
          </td>
        </tr>
      );
    }

    return this.state.sales.map((sale, index) => {
      return (
        <tr key={`purchase-${ index }`}>
          <td>{ sale.self_consumption ? 'Si' : 'No' }</td>
          <td>{ moment(sale.date).format('YYYY-MM-DD hh:mm a') }</td>
          <td className="text-right">{ TextFormatter.asMoney(sale.price) }</td>
          <td className="text-center">
            <Link
              to={`/sale/${ sale.sale_id }`}
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
              <th>Autoconsumo?</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            { this.renderSales() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

SalesHistory.propTypes = {
  productId: PropTypes.string.isRequired
};

export default SalesHistory;
