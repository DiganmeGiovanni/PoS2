import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../../components/paginated_table/Paginator';
import TextFormatter from '../../../services/TextFormatter';
import moment from 'moment';
import 'moment/locale/es';
import { Link } from "react-router-dom";

moment.locale('es');

const SalesTable = ({ sales, activePage, totalPages, navCb}) => {
  const makeTableBody = () => {
    if (sales.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            <i>No hay ventas registradas</i>
          </td>
        </tr>
      );
    }

    return sales.map(sale => (
      <tr key={`sale-${ sale.id }`}>
        <td>{ sale.id }</td>
        <td>{ moment(sale.date).format('YYYY, MMMM DD') }</td>
        <td>{ moment(sale.date).fromNow(true) }</td>
        <td className="text-right">
          { TextFormatter.asMoney(sale.total) }
        </td>
        <td className="text-center">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Link
            to={`/sale/${ sale.id }`}
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
            <th className="text-right">Total</th>
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

SalesTable.propTypes = {
  sales: PropTypes.array.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCb: PropTypes.func.isRequired,
};

export default SalesTable;
