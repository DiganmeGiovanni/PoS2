import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../components/paginated_table/Paginator';

const ProvidersTable = ({ providers, activePage, totalPages, navCallback }) => {
  const makeTableBody = () => {
    if (providers.length === 0) {
      return (
        <tr>
          <td colSpan={2} className={'text-center'}>
            <i>No hay provedores para mostrar</i>
          </td>
        </tr>
      );
    }

    return providers.map(provider => (
      <tr key={provider.id}>
        <td>{provider.id}</td>
        <td>{provider.name}</td>
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

ProvidersTable.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
};

export default ProvidersTable;
