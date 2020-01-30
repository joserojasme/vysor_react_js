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
import DeleteForever from '@material-ui/icons/DeleteForever';
import Update from '@material-ui/icons/Update';
import { connect } from 'react-redux';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import { SetDetalleClientes, SetModalActualizarClientes, SetDatosClientes } from '../../../reducers/actions/clientesActions';
import { ConsultarCliente, EliminarCliente } from '../../../api/apiClientes';

function createData(id, identificacion, nombre, direccion, telefono, referenciaNombre, email,idListaPrecios, fechaCreacion, usuario) {
    return { id, identificacion, nombre, direccion, telefono, referenciaNombre, email, idListaPrecios, fechaCreacion,  usuario };
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

let modal = {};

class EnhancedTable extends React.Component {
    state = {
        order: 'desc',
        orderBy: 'fechaCreacion',
        page: 0,
        rowsPerPage: 5,
        idCliente:''
    };

    componentDidMount() {
        this.ConsultarClientes();
    }

    ConsultarClientes = () =>{
        ConsultarCliente(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaClientes(result.data);
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando los clientes, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    llenarListaClientes = (data) => {
        let documentosEnviados = [];
        data.map(item => {
            let fechaCreacion = item.fechaCreacion.substring(0, 10);
            documentosEnviados.push(createData(item.id, item.identificacion, item.nombre, item.direccion, item.telefono, item.referenciaNombre
                , item.email, item.idListaPrecios, fechaCreacion,  item.usuario))
        })
        this.props.setDetalleClientes(documentosEnviados)
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleClickDelete = (event, idCliente) => {
        this.setState({idCliente:idCliente},()=>{
            modal = { open: true, text: `¿Seguro desea eliminar el cliente?`, onClick: this.handleClickConfirmarDelete }
            this.props.setConfirmacionModalState(modal);
        })
        
    };

    handleClickConfirmarDelete = () => {
        EliminarCliente(this.state.idCliente,this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.props.setConfirmacionModalState({open:false});
                this.ConsultarClientes();
            } else {
                modal = {
                    open: true, text: `Ocurrió un error eliminando el cliente, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    handleClickUpdate = (event, id) => {
        const {clientes} = this.props;
        let cliente = clientes.filter(item => item.id == id)
        this.props.setDatosClientes(cliente[0]);
        this.props.setModalActualizarClientes(true);
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, clientes } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, clientes.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <TablaToolbar />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={clientes.length}
                        />
                        <TableBody>
                            {stableSort(clientes, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={n.id}
                                        >
                                            <TableCell>
                                                <div className="form-row">
                                                    <div className="form-row col-md-12 d-flex justify-content-between">
                                                        <div className="form-group col-xl-3 mr-4">
                                                            <DeleteForever onClick={event => this.handleClickDelete(event, n.id)} />
                                                        </div>
                                                        <div className="form-group col-xl-3">
                                                            <Update onClick={event => this.handleClickUpdate(event, n.id)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.identificacion}
                                            </TableCell>
                                            <TableCell align="left">{n.nombre}</TableCell>
                                            <TableCell align="left">{n.direccion}</TableCell>
                                            <TableCell align="left">{n.telefono}</TableCell>
                                            <TableCell align="left">{n.referenciaNombre}</TableCell>
                                            <TableCell align="left">{n.email}</TableCell>
                                            <TableCell align="left">{n.idListaPrecios}</TableCell>
                                            <TableCell align="left">{n.fechaCreacion}</TableCell>
                                            <TableCell align="left">{n.usuario}</TableCell>
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
                    count={clientes.length}
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
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
        clientes: state.clientesStore.listaDetalleClientes
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleClientes: (item) => dispatch(SetDetalleClientes(item)),
    setModalActualizarClientes: (item) => dispatch(SetModalActualizarClientes(item)),
    setDatosClientes: (item) => dispatch(SetDatosClientes(item)),
    
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));