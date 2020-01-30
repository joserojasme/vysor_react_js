import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListPriceIcon from '@material-ui/icons/List';
import Invoice from '@material-ui/icons/Assignment';
import ListItemText from '@material-ui/core/ListItemText';
import NuevoUsuarioIcon from '@material-ui/icons/AssignmentInd';
import Bodegas from '@material-ui/icons/Store';
import Clientes from '@material-ui/icons/Person';
import Proveedores from '@material-ui/icons/PersonAdd';
import Productos from '@material-ui/icons/Poll';

class MenuAdmon extends Component {
  render() {
    return (
      <List>

        <Link style={{ textDecoration: 'none' }} key={1} to={{
          pathname: '/productos',
        }}>
          <ListItem button key={1}>
            <ListItemIcon><Productos /></ListItemIcon>
            <ListItemText primary='Productos' />
          </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} key={1} to={{
          pathname: '/clientes',
        }}>
          <ListItem button key={1}>
            <ListItemIcon><Clientes /></ListItemIcon>
            <ListItemText primary='Clientes' />
          </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} key={1} to={{
          pathname: '/lista_precios',
        }}>
          <ListItem button key={1}>
            <ListItemIcon><ListPriceIcon /></ListItemIcon>
            <ListItemText primary='Lista de precios' />
          </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} key={1} to={{
          pathname: '/facturas',
        }}>
          <ListItem button key={1}>
            <ListItemIcon><Invoice /></ListItemIcon>
            <ListItemText primary='Facturas' />
          </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} key={1} to={{
          pathname: '/registrarse',
        }}>
          <ListItem button key={1}>
            <ListItemIcon><NuevoUsuarioIcon /></ListItemIcon>
            <ListItemText primary='Nuevo usuario' />
          </ListItem>
        </Link>
      </List>
    )
  }
}

export default MenuAdmon;

