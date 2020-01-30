import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { connect } from 'react-redux';
import { numberFormat } from '../../../utils/funcionesUtiles';
import EnhancedTableHead from './DetalleProductosEncabezado';
import './styles.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { SetOpenModalProductosFactura } from '../../../reducers/actions/facturasActions';

function ccyFormatTotales(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    footerTabla: {
        backgroundColor: '#128BCC',
        color: 'white'
    }
});

class DetalleProductosFactura extends React.Component {
    state = {
        order: 'desc',
        orderBy: 'producto',
        selected: [],
        page: 0,
        rowsPerPage: 5,
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleClose = () =>{
        this.props.setOpenModalProductosFactura(false);
    }

    render() {
        const { open, dataProductosFactura, classes } = this.props;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataProductosFactura.length - page * rowsPerPage);
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    scroll='paper'
                    fullScreen={false}
                    fullWidth={true}
                    maxWidth='xl'
                >
                    <Paper className={classes.root}>
                        <div className={classes.tableWrapper}>
                            <Table className={classes.table} id="detalleProductos" aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={dataProductosFactura.length}
                                />
                                <TableBody>
                                    {stableSort(dataProductosFactura, getSorting(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map(n => {
                                            const isSelected = this.isSelected(n.idfacturaDetalle);
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    tabIndex={-1}
                                                    key={n.idfacturaDetalle}
                                                    selected={isSelected}
                                                >
                                                    <TableCell>
                                                   
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        {n.producto}
                                                    </TableCell>
                                                    <TableCell align="left">{ccyFormatTotales(n.precio)}</TableCell>
                                                    <TableCell align="left">{n.cantidad}</TableCell>
                                                    <TableCell align="left">{n.iva}%</TableCell>
                                                    <TableCell align="left">${ccyFormatTotales(n.valorTotalIva)}</TableCell>
                                                    <TableCell align="left">${ccyFormatTotales(n.precioBruto)}</TableCell>
                                                    <TableCell align="left">${ccyFormatTotales(n.precioTotal)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 49 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <TablePagination
                            className={classes.footerTabla}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={dataProductosFactura.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'Página anterior',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Página siguiente',
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                </Dialog>
            </div>
        );
    }
}

DetalleProductosFactura.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
        open: state.facturasStore.openModalProductosFactura,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setOpenModalProductosFactura: (item) => dispatch(SetOpenModalProductosFactura(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetalleProductosFactura));