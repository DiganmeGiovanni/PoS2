import React from 'react';
import PropTypes from 'prop-types';
import Paginator from '../../components/paginated_table/Paginator';
import { Link } from 'react-router-dom';

const MUnitsTable = ({ mUnits, activePage, totalPages, navCallback, filterId, onFilterIdChange,
                        filterName, onFilterNameChange, filterAbbr, onFilterAbbrChange }) => {
  const makeTableBody = () => {
    if (mUnits.length === 0) {
      return (
        <tr>
          <td colSpan={4} className={'text-center'}>
            <i>No hay unidades para mostrar</i>
          </td>
        </tr>
      );
    }

    return mUnits.map(mUnit => (
      <tr key={mUnit.id}>
        <td>{mUnit.id}</td>
        <td>{mUnit.abbreviation}</td>
        <td>{mUnit.name}</td>
        <td className="text-right">
          <Link
            to={`/measurement_unit/${ mUnit.id }/update`}
            title="Modificar unidad"
            className="btn btn-sm btn-default"
          >
            <span className="glyphicon glyphicon-pencil" />
          </Link>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="row">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <label className="control-label">#</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterIdChange }
                  value={ filterId }
                />
              </th>
              <th>
                <label className="control-label">Abreviatura</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterAbbrChange }
                  value={ filterAbbr }
                />
              </th>
              <th>
                <label className="control-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterNameChange }
                  value={ filterName }
                />
              </th>
              <th/>
            </tr>
          </thead>
          <tbody>{makeTableBody()}</tbody>
        </table>

        <Paginator
          activePage={activePage}
          totalPages={totalPages}
          navCallback={navCallback}
        />
      </div>
    </div>
  );
};

MUnitsTable.propTypes = {
  mUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
  filterId: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  filterAbbr: PropTypes.string.isRequired,
  onFilterIdChange: PropTypes.func.isRequired,
  onFilterNameChange: PropTypes.func.isRequired,
  onFilterAbbrChange: PropTypes.func.isRequired
};

export default MUnitsTable;
