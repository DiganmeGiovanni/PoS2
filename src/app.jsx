import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import BrandsList from './ui/brands/BrandsList';
import BrandsCreate from './ui/brands/BrandsCreate';
import MUnitsList from './ui/m_unit/MUnitsList';
import MUnitsCreate from './ui/m_unit/MUnitsCreate';
import ProductsList from './ui/products/ProductsList';
import ProductsCreate from './ui/products/ProductsCreate';
import ProvidersList from './ui/providers/ProvidersList';
import ProvidersCreate from './ui/providers/ProvidersCreate';
import PurchasePricesList from './ui/purchase_prices/PurchasePricesList';
import PurchasePricesCreate from './ui/purchase_prices/PurchasePricesCreate'
import Navbar from './ui/components/navbar/PNavbar';
import PurchasesList from "./ui/purchases/list/PurchasesList";
import PurchasesCreate from "./ui/purchases/PurchasesCreate";
import PurchaseView from "./ui/purchases/view/PurchaseView";
import SalesList from "./ui/sales/list/SalesList";
import CreateSale from "./ui/sales/create/CreateSale";
import SaleView from "./ui/sales/view/SaleView";
import Welcome from "./ui/home/Welcome";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="main-background">
          <Navbar />

          {/* Routes */}
          <Route
            exact
            path={'/'}
            component={Welcome}
            data={{ title: 'Punto de venta' }}
          />

          <Route
            exact
            path={'/brands'}
            component={BrandsList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/brands/create'}
            component={BrandsCreate}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/measurement_units'}
            component={MUnitsList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/measurement_units/create'}
            component={MUnitsCreate}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/products'}
            component={ProductsList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/products/create'}
            component={ProductsCreate}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/purchase_prices/:pModelId'}
            component={PurchasePricesList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/purchase_prices/:pModelId/create'}
            component={PurchasePricesCreate}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/providers'}
            component={ProvidersList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/providers/create'}
            component={ProvidersCreate}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/purchases'}
            component={PurchasesList}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/purchase/:purchaseId'}
            component={PurchaseView}
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/purchases/create'}
            component={PurchasesCreate}
            data={{ title: 'Punto de venta' }}
          />

          <Route
            exact
            path={'/sales'}
            component={ SalesList }
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/sale/:saleId'}
            component={ SaleView }
            data={{ title: 'Punto de venta' }}
          />
          <Route
            exact
            path={'/sales/create'}
            component={ CreateSale }
            data={{ title: 'Punto de venta' }}
          />
        </div>
      </Router>
    );
  }
}
