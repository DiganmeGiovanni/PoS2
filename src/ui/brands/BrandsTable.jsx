import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../components/paginated_table/Paginator';

const BrandsTable = ({ brands, activePage, totalPages, navCallback }) => {
  const makeTableBody = () => {
    if (brands.length === 0) {
      return (
        <tr>
          <td colSpan={2} className={'text-center'}>
            <i>No hay marcas para mostrar</i>
          </td>
        </tr>
      );
    }

    return brands.map(brand => (
      <tr key={brand.id}>
        <td>{brand.id}</td>
        <td>{brand.name}</td>
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

BrandsTable.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
};

export default BrandsTable;
