import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

const rows = [
  { id: 'identificacion', numeric: true, disablePadding: true, label: 'Identificación' },
  { id: 'nombre', numeric: true, disablePadding: true, label: 'Nombre' },
  { id: 'direccion', numeric: true, disablePadding: false, label: 'Dirección' },
  { id: 'telefono', numeric: true, disablePadding: true, label: 'Telefóno' },
  { id: 'referenciaNombre', numeric: true, disablePadding: false, label: 'Nombre referencia' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'idListaPrecios', numeric: true, disablePadding: false, label: 'Lista precio' },
  { id: 'fechaCreacion', numeric: true, disablePadding: false, label: 'Fecha creado' },
  { id: 'usuario', numeric: true, disablePadding: false, label: 'Usuario creación' },
];

class TablaEncabezado extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell>
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'center' : 'center'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Ordenar"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

TablaEncabezado.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default TablaEncabezado;