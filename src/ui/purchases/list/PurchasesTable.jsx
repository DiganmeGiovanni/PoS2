import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../../components/paginated_table/Paginator';
import TextFormatter from '../../../services/TextFormatter';
import moment from 'moment';
import { Link } from "react-router-dom";

const DatePicker = require('react-datetime');
import 'moment/locale/es';
moment.locale('es');

const PurchasesTable = ({ purchases, activePage, totalPages, navCb,
                          onFilterDateChange,
                          onFilterProviderChange }) => {
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

    return purchases.map(purchase => {
      let date = new Date(purchase.date);

      return <tr key={`purchase-${ purchase.id }`}>
        <td>{purchase.id}</td>
        <td>{moment(date).format('YYYY, MMMM DD')}</td>
        <td>{moment(date).fromNow(true)}</td>
        <td>{purchase.provider_name}</td>
        <td className="text-right">
          {TextFormatter.asMoney(purchase.investment)}
        </td>
        <td className="text-right">
          {TextFormatter.asMoney(purchase.reinvestment)}
        </td>
        <td className="text-right">
          {TextFormatter
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
            <span className="glyphicon glyphicon-eye-open"/>
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
            <th style={{ width: '75px' }}>
              <label className="control-label">#</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
              />
            </th>
            <th>
              <label className="control-label">
                Fecha
              </label>
              <DatePicker
                dateFormat="DD MMMM, YYYY"
                timeFormat={ false }
                locale="es"
                viewMode="years"
                closeOnSelect={ true }
                closeOnTab={ true }
                onChange={ onFilterDateChange }
              />
            </th>
            <th>
              <label className="control-label">
                Fecha relativa
              </label>
              <DatePicker
                dateFormat="DD MMMM, YYYY"
                timeFormat={ false }
                locale="es"
                viewMode="years"
                closeOnSelect={ true }
                closeOnTab={ true }
                onChange={ onFilterDateChange }
              />
            </th>
            <th>
              <label className="control-label">Proveedor</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Inversión</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Reinversión</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Costo total</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
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

PurchasesTable.propTypes = {
  purchases: PropTypes.array.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCb: PropTypes.func.isRequired,

  onFilterDateChange: PropTypes.func.isRequired,
  onFilterProviderChange: PropTypes.func.isRequired
};

export default PurchasesTable;
