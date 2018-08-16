import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../../components/paginated_table/Paginator';
import TextFormatter from '../../../services/TextFormatter';
import moment from 'moment';
import { Link } from "react-router-dom";

const DatePicker = require('react-datetime');
import 'moment/locale/es';
import DateFormatter from "../../../services/DateFormatter";
moment.locale('es');

const PurchasesTable = ({ purchases, activePage, totalPages, navCb,
                          onFilterIdChange,
                          filterId,
                          onFilterDateChange,
                          filterDate,
                          onFilterProviderChange,
                          filterProvider,
                          onFilterInvestmentChange,
                          filterInvestment,
                          onFilterReinvestmentChange,
                          filterReinvestment,
                          onFilterTotalChange,
                          filterTotal,
                        }) => {
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
      const date = DateFormatter.parse(purchase.date);
      const purchaseMoment = moment(date);
      purchaseMoment.add(-5, 'hours');

      return <tr key={`purchase-${ purchase.id }`}>
        <td>{purchase.id}</td>
        <td>{ purchaseMoment.format('YYYY, MMMM DD') }</td>
        <td>{ purchaseMoment.fromNow(true) }</td>
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
        <td className="text-right" style={{ width: '100px' }}>
          <Link
            to={`/purchase/${ purchase.id }`}
            title="Ver contenido"
            className="btn btn-sm btn-default"
          >
            <span className="glyphicon glyphicon-eye-open"/>
          </Link>
          <span>&nbsp;&nbsp;</span>
          <Link
            to={`/purchase/${ purchase.id }/update`}
            title="Modificar compra"
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
            <th style={{ width: '75px' }}>
              <label className="control-label">#</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterIdChange }
                value={ filterId }
              />
            </th>
            <th>
              <label className="control-label">
                Fecha
              </label>
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
              <label className="control-label">
                Fecha relativa
              </label>
              <input
                type="text"
                className="form-control"
                disabled
              />
            </th>
            <th>
              <label className="control-label">Proveedor</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterProviderChange }
                value={ filterProvider }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Inversión</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterInvestmentChange }
                value={ filterInvestment }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Reinversión</label>
              <input
                type="text"
                className="form-control"
                onChange={ onFilterReinvestmentChange }
                value={ filterReinvestment }
              />
            </th>
            <th className="text-right">
              <label className="control-label">Costo total</label>
              <input
                type="text"
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

PurchasesTable.propTypes = {
  purchases: PropTypes.array.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCb: PropTypes.func.isRequired,

  onFilterIdChange: PropTypes.func.isRequired,
  onFilterDateChange: PropTypes.func.isRequired,
  onFilterProviderChange: PropTypes.func.isRequired,
  onFilterInvestmentChange: PropTypes.func.isRequired,
  onFilterReinvestmentChange: PropTypes.func.isRequired,
  onFilterTotalChange: PropTypes.func.isRequired,
};

export default PurchasesTable;
