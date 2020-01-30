import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import React from 'react';
import { connect } from 'react-redux';
import { Consultar, Insertar } from '../../../api/apiListaPrecios';
import { SetDetalleListaPrecios, SetModalAddCamposListaPrecios } from '../../../reducers/actions/listaPreciosActions';
import { SetConfirmacionModalState, SetSpinnerModal } from '../../../reducers/actions/utilsActions';
import { handleKeyPressTextoNumeros } from '../../../utils/funcionesUtiles';
import LabelTitulos from '../../layout/labelTitulos';
import './styles.css';

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
    return { id, nombre,fechaCreacion,  usuario };
}

let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let modal = {};

class Crear extends React.Component {
    state = {
        nombre:'',
        errorNombre: false,
        usuario:''
    };

    handleCloseAgregar = () => {
        if (!this.validarCamposObligatorios()) {
            return;
        }
        this.setState({ usuario: this.props.userAttributes["custom:username"] }, () => {
            Insertar(this.state, this.props.setSpinnerModal).then(result=>{
                if (result.status == 200) {
                    this.refrescarListaPreciosDetalle();
                }else{
                    modal = {
                        open: true, text: `Ocurrió un error guardando la lista de precios, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                        onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                    }
                    this.props.setConfirmacionModalState(modal);
                }
            })
         })
    };

    refrescarListaPreciosDetalle = () =>{
        Consultar(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaListaPrecios(result.data);
            }else{
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
        this.props.setDetalleListaPrecios(listaPrecios);
        this.limpiarEstado();
        this.props.setModalAddCamposListaPrecios(false);
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleKeyPressTextoNumeros = (event) => {
        if (!handleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    limpiarEstado = () => {
        this.setState({
            nombre:'',
        errorNombre: false,
        usuario:''
        }, () => {
            this.props.setModalAddCamposListaPrecios(false);
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

    handleChange = (event) =>{
        let value = event.target.value;

        this.setState({ errorNombre: false,[event.target.id]: value });
    }

    render() {
        const { nombre, errorNombre } = this.state;
        const { open, } = this.props;

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
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto='Crear nueva lista de precios' /></DialogTitle>
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
                                            value={nombre}
                                            error={errorNombre}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button style={styles.buttonAdd} onClick={this.handleCloseAgregar} name="txtAgregar" color="primary">Guardar</Button>
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
        open: state.listaPreciosStore.openModalCamposListaPrecios,
        userAttributes: state.utilsStore.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setModalAddCamposListaPrecios: (item) => dispatch(SetModalAddCamposListaPrecios(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(Crear));