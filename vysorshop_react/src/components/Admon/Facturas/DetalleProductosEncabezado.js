import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

const rows = [
  { id: 'producto', numeric: true, disablePadding: true, label: 'Producto' },
  { id: 'precio', numeric: true, disablePadding: true, label: 'Precio' },
  { id: 'cantidad', numeric: true, disablePadding: true, label: 'Cantidad' },
  { id: 'iva', numeric: true, disablePadding: false, label: 'Iva' },
  { id: 'valorTotalIva', numeric: true, disablePadding: true, label: 'Valor IVA' },
  { id: 'precioBruto', numeric: true, disablePadding: false, label: 'Valor bruto' },
  { id: 'precioTotal', numeric: true, disablePadding: false, label: 'Valor total' },
];

class DetalleProductosEncabezado extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy} = this.props;

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

DetalleProductosEncabezado.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default DetalleProductosEncabezado;