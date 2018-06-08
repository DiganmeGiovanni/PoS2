import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../../components/paginated_table/Paginator';
import TextFormatter from '../../../services/TextFormatter';
import moment from 'moment';
import 'moment/locale/es';
import { Link } from "react-router-dom";

moment.locale('es');

const PurchasesTable = ({ purchases, activePage, totalPages, navCb}) => {
  const makeTableBody = () => {
    if (purchases.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            <i>No hay compras registradas</i>
          </td>
        </tr>
      );
    }

    return purchases.map(purchase => (
      <tr key={`purchase-${ purchase.id }`}>
        <td>{ purchase.id }</td>
        <td>{ moment(purchase.date).format('YYYY, MMMM DD') }</td>
        <td>{ moment(purchase.date).fromNow(true) }</td>
        <td>{ purchase.provider_name }</td>
        <td className="text-right">
          { TextFormatter.asMoney(purchase.investment) }
        </td>
        <td className="text-right">
          { TextFormatter.asMoney(purchase.reinvestment) }
        </td>
        <td className="text-right">
          { TextFormatter
              .asMoney(purchase.investment + purchase.reinvestment)
          }
        </td>
        <td className="text-center">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Link
            to={`/purchase/${ purchase.id }`}
            title="Ver contenido"
            className="btn btn-sm btn-default"
          >
            <span className="glyphicon glyphicon-eye-open" />
          </Link>
        </td>
      </tr>
    ))
  };

  return (
    <div className="row">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Fecha relativa</th>
            <th>Proveedor</th>
            <th className="text-right">Pago como inversión</th>
            <th className="text-right">Pago como reinversión</th>
            <th className="text-right">Costo total</th>
            <th>&nbsp;</th>
          </tr>
          </thead>
          <tbody>{ makeTableBody() }</tbody>
        </table>

        <Paginator
          activePage={ activePage }
          totalPages={ totalPages }
          navCallback={ navCb }
        />
      </div>
    </div>
  );
};

PurchasesTable.propTypes = {
  purchases: PropTypes.array.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCb: PropTypes.func.isRequired,
};

export default PurchasesTable;
