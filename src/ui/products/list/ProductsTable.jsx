import React from 'react';
import PropTypes from 'prop-types';
import Paginator from '../../components/paginated_table/Paginator';
import { Link } from "react-router-dom";

const ProductsTable = ({ products, activePage, totalPages, navCallback,
                         onFilterCodeChange,
                         filterCode,
                         onFilterNameChange,
                         filterName,
                         onFilterBrandChange,
                         filterBrand,
                         onFilterMeasurementUnitChange,
                         filterMeasurementUnit
                      }) => {
  const makeTableBody = () => {
    if (products.length === 0) {
      return (
        <tr>
          <td colSpan={8} className={'text-center'}>
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
        <td className="text-right" style={{ minWidth: '120px'}}>
          <Link to={`/products/view/${ product.id }`}
                title="Detalles"
                className="btn btn-sm btn-default text-center"
          >
            <span className="glyphicon glyphicon-eye-open"/>
          </Link>
          <span>&nbsp;&nbsp;&nbsp;</span>

          <Link to={`/product/${ product.id }/update`}
                title="Modificar"
                className="btn btn-sm btn-default text-center"
          >
            <span className="glyphicon glyphicon-pencil"/>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <div className="row padding-top-8">
      <div className="col-xs-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <label className="control-label">Código</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterCodeChange }
                  value={ filterCode }
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
              <th>
                <label className="control-label">Marca</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterBrandChange }
                  value={ filterBrand }
                />
              </th>
              <th>
                <label className="control-label">Unidad</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={ onFilterMeasurementUnitChange }
                  value={ filterMeasurementUnit }
                />
              </th>
              <th className="text-right" style={{ width: '11%'}}>
                <label className="control-label">Stock mínimo</label>
                <input type="text" className="form-control" disabled/>
              </th>
              <th className="text-right" style={{ width: '11%'}}>
                <label className="control-label">Stock</label>
                <input type="text" className="form-control" disabled/>
              </th>
              <th className="text-right" style={{ width: '11%'}}>
                <label className="control-label">Vendidos</label>
                <input type="text" className="form-control" disabled/>
              </th>
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

  onFilterCodeChange: PropTypes.func.isRequired,
  filterCode: PropTypes.string.isRequired,
  onFilterNameChange: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
  onFilterBrandChange: PropTypes.func.isRequired,
  filterBrand: PropTypes.string.isRequired,
  onFilterMeasurementUnitChange: PropTypes.func.isRequired,
  filterMeasurementUnit: PropTypes.string.isRequired
};

export default ProductsTable;
