import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../../components/paginated_table/Paginator';
import TextFormatter from '../../../services/TextFormatter';
import moment from 'moment';
import 'moment/locale/es';
import { Link } from "react-router-dom";
import DateFormatter from "../../../services/DateFormatter";

const DatePicker = require('react-datetime');
moment.locale('es');

const SalesTable = ({ sales, activePage, totalPages, navCb,
                      onFilterIdChange,
                      filterId,
                      onFilterDateChange,
                      filterDate,
                      onFilterTotalChange,
                      filterTotal
                    }) => {

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

    return sales.map(sale => {
      const saleMoment = moment(sale.date).local(true);

      return <tr key={`sale-${ sale.id }`}>
        <td>{ sale.id }</td>
        <td>{ saleMoment.format('DD MMMM, YYYY') }</td>
        <td>{ saleMoment.fromNow(true) }</td>
        <td className="text-right">
          { TextFormatter.asMoney(sale.total) }
        </td>
        <td className="text-right">
          <Link
            to={`/sale/${ sale.id }`}
            title="Ver contenido"
            className="btn btn-sm btn-default"
          >
            <span className="glyphicon glyphicon-eye-open"/>
          </Link>
          <span>&nbsp;&nbsp;</span>
          <Link
            to={`/sale/${ sale.id }/update`}
            title="Modificar venta"
            className="btn btn-sm btn-default"
          >
            <span className="glyphicon glyphicon-pencil"/>
          </Link>
        </td>
      </tr>
    })
  };

  return (
    <div className="row padding-top-8">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
          <tr>
            <th>
              <label className="control-label">#</label>
              <input type="text"
                     className="form-control"
                     onChange={ onFilterIdChange }
                     value={ filterId }
              />
            </th>
            <th>
              <label className="control-label">Fecha</label>
              <DatePicker
                dateFormat="YYYY, MMMM DD"
                timeFormat={ false }
                locale="es"
                viewMode="years"
                closeOnSelect={ true }
                closeOnTab={ true }
                onChange={ onFilterDateChange }
                value={ filterDate }
              />
            </th>
            <th>
              <label className="control-label">Fecha relativa</label>
              <input type="text" className="form-control" disabled/>
            </th>
            <th className="text-right">
              <label className="control-label">Total</label>
              <input type="text"
                     className="form-control"
                     onChange={ onFilterTotalChange }
                     value={ filterTotal }
              />
            </th>
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

  onFilterIdChange: PropTypes.func.isRequired,
  onFilterDateChange: PropTypes.func.isRequired,
  onFilterTotalChange: PropTypes.func.isRequired
};

export default SalesTable;
