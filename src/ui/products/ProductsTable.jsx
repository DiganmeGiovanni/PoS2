import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './../components/paginated_table/Paginator';
import { Link } from "react-router-dom";

const ProductsTable = ({ products, activePage, totalPages, navCallback }) => {
  const makeTableBody = () => {
    if (products.length === 0) {
      return (
        <tr>
          <td colSpan={7} className={'text-center'}>
            <i>No hay productos para mostrar</i>
          </td>
        </tr>
      );
    }

    return products.map(product => (
      <tr key={`product-model-${ product.id }`}>
        <td>{ product.code }</td>
        <td>{ product.name }</td>
        <td>{ product.brand_name }</td>
        <td>{ product.measurement_unit_name }</td>
        <td className="text-right">{ product.minimal_existences }</td>
        <td className="text-right">{ product.stock }</td>
        <td className="text-right">{ product.sold }</td>
        <td className="text-center">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <Link to={`/purchase_prices/${ product.id }`}
                title="Precios de compra"
                className="btn btn-sm btn-default text-center hidden"
          >
            <span className="glyphicon glyphicon-usd"/>
          </Link>
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
              <th>Código</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Unidad de medida</th>
              <th className="text-right">Stock mínimo</th>
              <th className="text-right">Stock</th>
              <th className="text-right">Cantidad vendida</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>{ makeTableBody() }</tbody>
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

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
};

export default ProductsTable;
