import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

const rows = [
  { id: 'idTransacction', numeric: true, disablePadding: true, label: 'Transaccion' },
  { id: 'prefijo', numeric: true, disablePadding: true, label: 'Factura' },
  { id: 'fecha', numeric: true, disablePadding: true, label: 'Fecha y hora' },
  { id: 'cliente', numeric: true, disablePadding: false, label: 'Cliente' },
  { id: 'tipoPago', numeric: true, disablePadding: true, label: 'Tipo de pago' },
  { id: 'totalIva', numeric: true, disablePadding: false, label: 'Valor iva' },
  { id: 'totalBruto', numeric: true, disablePadding: false, label: 'Valor bruto' },
  { id: 'totalNeto', numeric: true, disablePadding: false, label: 'Total neto' },
];

class TablaEncabezado extends React.Component {
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

TablaEncabezado.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default TablaEncabezado;