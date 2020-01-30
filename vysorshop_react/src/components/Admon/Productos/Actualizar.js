import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { SetDetalleProductos, SetModalActualizarProductos, SetDatosProductos } from '../../../reducers/actions/productosActions';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import LabelTitulos from '../../layout/labelTitulos';
import { handleKeyPressTextoNumeros } from '../../../utils/funcionesUtiles';
import './styles.css';
import { Actualizar, Consultar } from '../../../api/apiProductos';

const styles = {
    buttonAdd: {
        fontWeight: 'bold',
        backgroundColor: '#128BCC',
        color: 'white',
    }
}

const customStyles = {
    input: styles => {
        return {
            ...styles,
            height: '2.25rem'
        };
    }
}

function createData(id, codigo, plu, nombre, costo, fechaCreacion, usuario) {
    return { id, codigo, plu, nombre, costo, fechaCreacion, usuario };
}

let modal = {};

class CActualizar extends React.Component {
    state = {
        id: '',
        codigo: '',
        plu: '',
        nombre: '',
        costo: '',
        errorCodigo: false,
        errorPlu: false,
        errorNombre: false,
        errorCosto: false,
        usuario: "",
        estadoActualizacion: false
    };

    handleCloseActualizar = () => {
        const { id } = this.props.datosProductos;
        if (this.state.estadoActualizacion) {
            this.setState({ id: id, usuario: this.props.userAttributes["custom:username"] }, () => {
                if (!this.validarCamposObligatorios()) {
                    return;
                }

                Actualizar(this.state, this.props.setSpinnerModal).then(result => {
                    if (result.status == 200) {
                        this.refrescarProductosDetalle();
                    } else {
                        modal = {
                            open: true, text: `Ocurrió un error actualizando el producto, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                            onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                        }
                        this.props.setConfirmacionModalState(modal);
                    }
                })
            })

        } else {
            this.limpiarEstado();
            this.props.setModalActualizarProductos(false);
        }
    };

    refrescarProductosDetalle = () => {
        Consultar(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaProductos(result.data);
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando los productos, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    llenarListaProductos = (data) => {
        let productos = [];
        data.map(item => {
            let fechaCreacion = item.fechaCreacion.substring(0, 10);
            productos.push(createData(item.id, item.codigo, item.plu, item.nombre, item.costo, fechaCreacion, item.usuario))
        })
        this.props.setDetalleProductos(productos)
        this.limpiarEstado();
        this.props.setModalActualizarProductos(false);
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ ...this.props.datosProductos, estadoActualizacion: true, errorCodigo: false, errorPlu: false, errorNombre: false, errorCosto: false, [event.target.id]: value }, () => {
            this.props.setDatosProductos(this.state);
        })
    }

    handleKeyPressTextoNumeros = (event) => {
        if (!handleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    limpiarEstado = () => {
        this.setState({
            id: '',
            codigo: '',
            plu: '',
            nombre: '',
            costo: '',
            errorCodigo: false,
            errorPlu: false,
            errorNombre: false,
            errorCosto: false,
            usuario: "",
            estadoActualizacion: false
        }, () => {
            this.props.setModalActualizarProductos(false);
        })
    }

    validarCamposObligatorios = () => {
        let sw = 0;

        if (this.state.nombre.length === 0) {
            sw += 1;
            this.setState({ errorNombre: true })
        }

        if (this.state.codigo.length === 0) {
            sw += 1;
            this.setState({ errorCodigo: true })
        }

        if (this.state.costo.length === 0) {
            sw += 1;
            this.setState({ errorCosto: true })
        }

        if (sw > 0) {
            return false;
        }
        return true;
    }

    render() {
        const { errorCodigo, errorPlu, errorNombre, errorCosto } = this.state;
        const { open, datosProductos } = this.props;
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    scroll='paper'
                    fullScreen={isWidthUp('md', this.props.width) ? false : true}
                >
                    <form>
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto='Actualizar producto' /></DialogTitle>
                        <DialogContent>
                            <div className="form-row">
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            inputProps={{
                                                readOnly: true,
                                            }}
                                            margin="dense"
                                            id="codigo"
                                            label="Código *"
                                            onKeyPress={this.handleKeyPressTextoNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={datosProductos.codigo}
                                            error={errorCodigo}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="plu"
                                            label="PLU"
                                            onKeyPress={this.handleKeyPressTextoNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={datosProductos.plu}
                                            error={errorPlu}
                                        />
                                    </div>
                                </div>
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            margin="dense"
                                            id="nombre"
                                            label="Nombre *"
                                            onKeyPress={this.handleKeyPressTextoNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={datosProductos.nombre}
                                            error={errorNombre}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            margin="dense"
                                            id="costo"
                                            label="Valor compra *"
                                            onKeyPress={this.handleKeyPressNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={datosProductos.costo}
                                            error={errorCosto}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button style={styles.buttonAdd} onClick={this.handleCloseActualizar} name="txtAgregar" color="primary">Actualizar</Button>
                            <Button style={styles.buttonAdd} onClick={this.handleClose} name="Cerrar" color="primary">Cancelar</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        open: state.productosStore.openModalActualizarProductos,
        userAttributes: state.utilsStore.userAttributes,
        datosProductos: state.productosStore.datosProductos,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setModalActualizarProductos: (item) => dispatch(SetModalActualizarProductos(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleProductos: (item) => dispatch(SetDetalleProductos(item)),
    setDetalleProductos: (item) => dispatch(SetDetalleProductos(item)),
    setDatosProductos: (item) => dispatch(SetDatosProductos(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(CActualizar));