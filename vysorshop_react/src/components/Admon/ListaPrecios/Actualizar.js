import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { SetDetalleListaPrecios, SetModalActualizarListaPrecios, SetDatosListaPrecios } from '../../../reducers/actions/listaPreciosActions';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import LabelTitulos from '../../layout/labelTitulos';
import {  handleKeyPressTextoNumeros } from '../../../utils/funcionesUtiles';
import './styles.css';
import { Actualizar, Consultar } from '../../../api/apiListaPrecios';

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

function createData(id, nombre, fechaCreacion, usuario) {
    return { id, nombre, fechaCreacion, usuario };
}

let modal = {};

class CActualizar extends React.Component {
    state = {
        id: '',
        nombre: "",
        usuario: "",
        errorNombre: false,
        estadoActualizacion: false
    };

    handleCloseActualizar = () => {
        const { id } = this.props.datosListaPrecio;
        if (this.state.estadoActualizacion) {
            this.setState({ id: id, usuario: this.props.userAttributes["custom:username"] }, () => {
                if (!this.validarCamposObligatorios()) {
                    return;
                }

                Actualizar(this.state, this.props.setSpinnerModal).then(result => {
                    if (result.status == 200) {
                        this.refrescarListaPreciosDetalle();
                    } else {
                        modal = {
                            open: true, text: `Ocurrió un error actualizando la lista de precios, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                            onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                        }
                        this.props.setConfirmacionModalState(modal);
                    }
                })
            })

        } else {
            this.limpiarEstado();
            this.props.setModalActualizarListaPrecios(false);
        }
    };

    refrescarListaPreciosDetalle = () => {
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
            listaPrecios.push(createData(item.id, item.nombre, fechaCreacion, item.usuario))
        })
        this.props.setDetalleListaPrecios(listaPrecios)
        this.limpiarEstado();
        this.props.setModalActualizarListaPrecios(false);
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({  ...this.props.datosListaPrecio,estadoActualizacion: true, errorNombre: false,[event.target.id]: value }, () => {
        this.props.setDatosListaPrecios(this.state);
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
            nombre: "",
            usuario: "",
            errorNombre: false,
            estadoActualizacion: false
        }, () => {
            this.props.setModalActualizarListaPrecios(false);
        })
    }

    validarCamposObligatorios = () => {
        let sw = 0;

        if (this.state.nombre.length === 0) {
            sw += 1;
            this.setState({ errorNombre: true })
        }

        if (sw > 0) {
            return false;
        }
        return true;
    }

    render() {
        const { errorNombre } = this.state;
        const { open, datosListaPrecio, } = this.props;
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
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto='Actualizar lista de precio' /></DialogTitle>
                        <DialogContent>
                            <div className="form-row">
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-12">
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="nombre"
                                            label="Nombre lista *"
                                            onKeyPress={this.handleKeyPressTextoNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={datosListaPrecio.nombre}
                                            error={errorNombre}

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
        open: state.listaPreciosStore.openModalActualizarListaPrecios,
        userAttributes: state.utilsStore.userAttributes,
        datosListaPrecio: state.listaPreciosStore.datosListaPrecio,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setModalActualizarListaPrecios: (item) => dispatch(SetModalActualizarListaPrecios(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
    setDatosListaPrecios: (item) => dispatch(SetDatosListaPrecios(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(CActualizar));