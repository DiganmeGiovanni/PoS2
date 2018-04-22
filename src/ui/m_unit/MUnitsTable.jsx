import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../components/paginated_table/Paginator';

const MUnitsTable = ({ mUnits, activePage, totalPages, navCallback }) => {
  const makeTableBody = () => {
    if (mUnits.length === 0) {
      return (
        <tr>
          <td colSpan={3} className={'text-center'}>
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
      </tr>
    ));
  };

  return (
    <div className="row">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Abreviatura</th>
              <th>Nombre</th>
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
};

export default MUnitsTable;
