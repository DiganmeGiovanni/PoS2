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
              href={'/providers'}
              to={'/providers'}
              active={location.pathname === '/providers'}
            >
              Proveedores
            </NavItem>
            <NavDropdown title="Inventario" id="nav-inventory">
              <MenuItem
                componentClass={Link}
                href={'/products'}
                to={'/products'}
                active={location.pathname === '/products'}
              >
                Productos
              </MenuItem>
              <MenuItem divider />
              <MenuItem
                componentClass={Link}
                href={'/brands'}
                to={'/brands'}
                active={location.pathname === '/brands'}
              >
                Marcas
              </MenuItem>
              <MenuItem
                componentClass={Link}
                href={'/measurement_units'}
                to={'/measurement_units'}
                active={location.pathname === '/measurement_units'}
              >
                Unidades de medida
              </MenuItem>
            </NavDropdown>
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
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default PNavbar;
