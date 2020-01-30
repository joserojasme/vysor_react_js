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
import Add from '@material-ui/icons/Add';
import Update from '@material-ui/icons/Update';
import { connect } from 'react-redux';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import { SetDetalleListaPrecios, SetModalActualizarListaPrecios, SetDatosListaPrecios, SetModalAgregarProductosListaPrecios } from '../../../reducers/actions/listaPreciosActions';
import { Consultar, Eliminar } from '../../../api/apiListaPrecios';

function createData( id, nombre, fechaCreacion, usuario) {
    return {  id, nombre,fechaCreacion, usuario };
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

class Detalle extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'id',
        page: 0,
        rowsPerPage: 5,
        idListaPrecios:''
    };

    componentDidMount() {
        this.Consultar();
    }

    Consultar = () =>{
        Consultar(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaListaPrecios(result.data);
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando la lista de precios, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    llenarListaListaPrecios = (data) => {
        let listaPrecios = [];
        data.map(item => {
            let fechaCreacion = item.fechaCreacion.substring(0, 10);
            listaPrecios.push(createData(item.id, item.nombre, fechaCreacion,  item.usuario))
        })
        this.props.setDetalleListaPrecios(listaPrecios)
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleClickDelete = (event, idListaPrecios) => {
        this.setState({idListaPrecios:idListaPrecios},()=>{
            modal = { open: true, text: `¿Seguro desea eliminar?`, onClick: this.handleClickConfirmarDelete }
            this.props.setConfirmacionModalState(modal);
        })
        
    };

    handleClickConfirmarDelete = () => {
        Eliminar(this.state.idListaPrecios,this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.props.setConfirmacionModalState({open:false});
                this.Consultar();
            } else {
                modal = {
                    open: true, text: `Ocurrió un error eliminando la lista de precios, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    handleClickUpdate = (event, id) => {
        const {listaPrecios} = this.props;
        let listaPrecio = listaPrecios.filter(item => item.id == id)
        this.props.setDatosListaPrecios(listaPrecio[0]);
        this.props.setModalActualizarListaPrecios(true);
    };

    handleClickAdd = (event, id) => {
        const {listaPrecios} = this.props;
        let listaPrecio = listaPrecios.filter(item => item.id == id)
        this.props.setDatosListaPrecios(listaPrecio[0]);
        this.props.setModalAgregarProductosListaPrecios(true);
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, listaPrecios } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, listaPrecios.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <TablaToolbar />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={listaPrecios.length}
                        />
                        <TableBody>
                            {stableSort(listaPrecios, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={n.id}
                                        >
                                            <TableCell align="left">
                                                <div className="form-row">
                                                    <div className="form-row col-md-4 d-flex justify-content-between">
                                                        <div className="form-group col-xl-1 mr-4">
                                                            <DeleteForever onClick={event => this.handleClickDelete(event, n.id)} />
                                                        </div>
                                                        <div className="form-group col-xl-1">
                                                            <Update onClick={event => this.handleClickUpdate(event, n.id)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">{n.id}</TableCell>
                                            <TableCell align="center">{n.nombre}</TableCell>
                                            <TableCell align="center">{n.fechaCreacion}</TableCell>
                                            <TableCell align="center">{n.usuario}</TableCell>
                                            <TableCell align="center">
                                                
                                                            <Add onClick={event => this.handleClickAdd(event, n.id)} />
                                                      
                                            </TableCell>
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
                    count={listaPrecios.length}
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

Detalle.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
        listaPrecios: state.listaPreciosStore.listaDetalleListaPrecios
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
    setModalActualizarListaPrecios: (item) => dispatch(SetModalActualizarListaPrecios(item)),
    setDatosListaPrecios: (item) => dispatch(SetDatosListaPrecios(item)),
    setModalAgregarProductosListaPrecios: (item) => dispatch(SetModalAgregarProductosListaPrecios(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Detalle));