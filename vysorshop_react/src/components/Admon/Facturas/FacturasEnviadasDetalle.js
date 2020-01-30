import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React from 'react';
import EnhancedTableHead from './TablaEncabezado';
import TablaToolbar from './TablaToolBar';
import { connect } from 'react-redux';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Update from '@material-ui/icons/AspectRatio';
import { SetOpenModalProductosFactura, SetDetalleFacturas } from '../../../reducers/actions/facturasActions';
import DetalleProductosFactura from './DetalleProductosFactura';
import { Modificar } from '../../../api/apiFacturas';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

let modal;

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
    footerTabla:{
        backgroundColor: '#128BCC',
        color: 'white' 
    }
});

class EnhancedTable extends React.Component {
    state = {
        order: 'desc',
        orderBy: 'fecha',
        selected: [],
        page: 0,
        rowsPerPage: 5,
        dataProductosFactura: [],
        idfactura:0
    };

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

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleClickAnular = (event, idfactura) => {
        this.setState({idfactura:idfactura},()=>{
            modal = { open: true, text: `¿Seguro desea anular la factura?`, onClick: this.handleClickConfirmarAnulacion }
            this.props.setConfirmacionModalState(modal);
        })
    }

    handleClickConfirmarAnulacion = () =>{
        const { facturasEnviadas } = this.props;
        const {idfactura} = this.state;
        this.props.setDetalleFacturas([]);
        Modificar(idfactura,this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                let facturas = facturasEnviadas;
                debugger;
                facturas.map(item=>{
                    if(item.idfactura == idfactura){
                        debugger;
                        item.estado = 2;
                    }
                })
                debugger;
                this.props.setDetalleFacturas(facturas);
                this.props.setConfirmacionModalState({open:false});
            } else {
                modal = {
                    open: true, text: `Ocurrió un error anulando la factura, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    handleClickVer = (event, facturaDetail) => {
        this.setState({dataProductosFactura: facturaDetail},()=>{
            this.props.setOpenModalProductosFactura(true);
        })
    }

    render() {
        const { classes,facturasEnviadas } = this.props;
        const { order, orderBy, selected, rowsPerPage, page, dataProductosFactura } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, facturasEnviadas.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <TablaToolbar numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} id="detalleFactura" aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={facturasEnviadas.length}
                        />
                        <TableBody>
                            {stableSort(facturasEnviadas, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}
                                            style={n.estado !== 1 ? {background:"#ffdfd4"} : null}
                                        >
                                            <TableCell>
                                            {n.estado == 1 &&
                                                <DeleteForever onClick={event => this.handleClickAnular(event, n.idfactura)} />
                                            }
                                            <Update onClick={event => this.handleClickVer(event, n.facturaDetail)} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.idTransacction}
                                            </TableCell>
                                            <TableCell align="left">{n.prefijo}</TableCell>
                                            <TableCell align="left">{n.fecha}</TableCell>
                                            <TableCell align="left">{n.cliente.toUpperCase()}</TableCell>
                                            <TableCell align="left">{n.tipoPago}</TableCell>
                                            <TableCell align="left">${n.totalIva}</TableCell>
                                            <TableCell align="left">${n.totalBruto}</TableCell>
                                            <TableCell align="left">${n.totalNeto}</TableCell>
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
                    count={facturasEnviadas.length}
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
                {dataProductosFactura.length > 0 &&
                    <DetalleProductosFactura dataProductosFactura={dataProductosFactura}/>
                }
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
        facturasEnviadas: state.facturasStore.listaDetalleFacturas
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setOpenModalProductosFactura: (item) => dispatch(SetOpenModalProductosFactura(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleFacturas: (item) => dispatch(SetDetalleFacturas(item)),
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(EnhancedTable));