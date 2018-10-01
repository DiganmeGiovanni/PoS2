import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
  MenuItem,
} from 'react-bootstrap';

class PNavbar extends React.Component {
  render() {
    return (
      <Navbar
        // fixedTop={ true }
        inverse={ true }
      >
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/brands'} className={'navbar-brand'}>
              PoS
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem
              componentClass={ Link }
              href={'/products'}
              to={'/products'}
              active={location.pathname === '/products'}
            >
              Inventario
            </NavItem>
            <NavItem
              componentClass={Link}
              href={'/brands'}
              to={'/brands'}
              active={location.pathname === '/brands'}
            >
              Marcas
            </NavItem>
            <NavItem
              componentClass={Link}
              href={'/measurement_units'}
              to={'/measurement_units'}
              active={location.pathname === '/measurement_units'}
            >
              Unidades de medida
            </NavItem>
            <NavItem
              componentClass={ Link }
              href={'/providers'}
              to={'/providers'}
              active={location.pathname === '/providers'}
            >
              Proveedores
            </NavItem>
            <NavItem
              componentClass={ Link }
              href={'/purchases'}
              to={'/purchases'}
              active={location.pathname === '/purchases'}
            >Compras</NavItem>
            <NavItem
              componentClass={ Link }
              href={'/sales'}
              to={'/sales'}
              active={location.pathname === '/sales'}
            >Ventas</NavItem>

            <NavDropdown id="nav-reportes" title="Reportes">
              <MenuItem
                componentClass={ Link }
                href={'/reports/product/audit'}
                to={'/reports/product/audit'}
                active={ location.pathname.endsWith('/product/audit')}
              >Auditar producto</MenuItem>
              <MenuItem
                componentClass={ Link }
                href={'/reports/earnings'}
                to={'/reports/earnings'}
                active={ location.pathname.endsWith('/reports/earnings')}
              >Ventas y ganancias</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default PNavbar;
