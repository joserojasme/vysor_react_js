import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import Select from 'react-select';
import { SetDetalleClientes, SetModalAddCamposClientes } from '../../../reducers/actions/clientesActions';
import { SetDetalleListaPrecios } from '../../../reducers/actions/listaPreciosActions';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import LabelTitulos from '../../layout/labelTitulos';
import { handleKeyPressTextoNumeroGuion, handleKeyPressTexto, handleKeyPressTextoNumeros } from '../../../utils/funcionesUtiles';
import './styles.css';
import { InsertarCliente,ConsultarCliente } from '../../../api/apiClientes';
import { Consultar } from '../../../api/apiListaPrecios';

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

function createData(id, identificacion, nombre, direccion, telefono, referenciaNombre, email,idListaPrecios, fechaCreacion, usuario) {
    return { id, identificacion, nombre, direccion, telefono, referenciaNombre, email, idListaPrecios, fechaCreacion,  usuario };
}

let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let modal = {};

class CamposClientes extends React.Component {
    state = {
        identificacion: "",
        nombre: "",
        direccion: "",
        telefono: "",
        referenciaNombre: "",
        email: "",
        usuario: "",
        idListaPrecios: "",
        listaPreciosSelect: [],
        errorEmail: false,
        errorIdentificacion: false,
        errorNombre: false,
        errorDireccion: false,
        errorTelefono: false,
        errorIdListaPrecios: false,
    };

    componentDidMount() {
        Consultar(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.props.setDetalleListaPrecios(result.data);
                let listaPrecios = [];
                this.props.listaPrecios.map((item) => {
                    listaPrecios.push({ "value": item.id, "label": item.nombre });
                })
                this.setState({ listaPreciosSelect: listaPrecios, usuario: this.props.userAttributes["custom:username"] }, () => { })
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando las listas de precios. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    handleCloseAgregar = () => {
        if (!this.validarCamposObligatorios()) {
            return;
        }
        
        InsertarCliente(this.state, this.props.setSpinnerModal).then(result=>{
            if (result.status == 200) {
                this.refrescarClientesDetalle();
            }else{
                modal = {
                    open: true, text: `Ocurrió un error guardando el cliente, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    };

    refrescarClientesDetalle = () =>{
        ConsultarCliente(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaClientes(result.data);
            }else{
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
        this.props.setDetalleClientes(documentosEnviados);
        this.limpiarEstado();
        this.props.setModalAddCamposClientes(false);
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleChange = (event) => {
        let value = event.target.value;

        this.setState({ errorEmail: false, errorIdentificacion: false, errorNombre: false, errorDireccion: false, errorTelefono: false, errorIdListaPrecios: false, })
        if ([event.target.id] == 'email') {
            if (!regEmail.test(value)) {
                this.setState({ [event.target.id]: value, errorEmail: true }, () => { })
                return;
            } else {
                this.setState({ [event.target.id]: value, errorEmail: false }, () => { })
                return;
            }
        }

        this.setState({ [event.target.id]: value }, () => { })
    }

    handleKeyPressTextoNumeroGuion = (event) => {
        if (!handleKeyPressTextoNumeroGuion(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressTexto = (event) => {
        if (!handleKeyPressTexto(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressTextoNumeros = (event) => {
        if (!handleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    limpiarEstado = () => {
        this.setState({
            identificacion: "",
            nombre: "",
            direccion: "",
            telefono: "",
            referenciaNombre: "",
            email: "",
            usuario: "",
            idListaPrecios: 0,
            errorEmail: false,
            errorIdentificacion: false,
            errorNombre: false,
            errorDireccion: false,
            errorTelefono: false,
            errorIdListaPrecios: false,
        }, () => {
            this.props.setModalAddCamposClientes(false);
        })
    }

    handleChangeListaPrecio = (selectedOption) => {
        this.setState({ idListaPrecios: selectedOption.value }, () => { })
    }

    validarCamposObligatorios = () => {
        let sw = 0;
        if (this.state.identificacion.length === 0) {
            sw += 1;
            this.setState({ errorIdentificacion: true })
        }

        if (this.state.nombre.length === 0) {
            sw += 1;
            this.setState({ errorNombre: true })
        }

        if (this.state.direccion.length === 0) {
            sw += 1;
            this.setState({ errorDireccion: true })
        }

        if (this.state.telefono.length === 0) {
            sw += 1;
            this.setState({ errorTelefono: true })
        }

        if (this.state.idListaPrecios.length === 0) {
            sw += 1;
            this.setState({ errorIdListaPrecios: true })
        }

        if (this.state.email.length > 0) {
            if (!regEmail.test(this.state.email)) {
                sw += 1;
                this.setState({ errorEmail: true })
            }
        }

        if (sw > 0) {
            return false;
        }
        return true;
    }

    render() {
        const { identificacion, nombre, direccion, telefono, referenciaNombre, email, listaPreciosSelect
            , errorEmail, errorIdentificacion, errorNombre, errorDireccion, errorTelefono,errorIdListaPrecios } = this.state;
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
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto='Crear nuevo cliente' /></DialogTitle>
                        <DialogContent>
                            <div className="form-row">
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="identificacion"
                                            label="Documento cliente *"
                                            onKeyPress={this.handleKeyPressTextoNumeroGuion}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={identificacion}
                                            error={errorIdentificacion}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            margin="dense"
                                            id="nombre"
                                            label="Nombre *"
                                            onKeyPress={this.handleKeyPressTexto}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={nombre}
                                            error={errorNombre}
                                        />
                                    </div>
                                </div>
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-6">
                                        <TextField
                                            margin="dense"
                                            id="referenciaNombre"
                                            label="Apodo"
                                            onKeyPress={this.handleKeyPressTexto}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={referenciaNombre}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-6 mt-2">
                                        <Select
                                            onChange={this.handleChangeListaPrecio.bind(this)}
                                            options={listaPreciosSelect}
                                            placeholder='Listas de precios *'
                                            styles={customStyles}
                                        />
                                    </div>
                                </div>
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-md-12 col-xl-4">
                                        <TextField
                                            margin="dense"
                                            id="direccion"
                                            label="Dirección *"
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={direccion}
                                            error={errorDireccion}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-4">
                                        <TextField
                                            margin="dense"
                                            id="telefono"
                                            label="Teléfono *"
                                            onKeyPress={this.handleKeyPressTextoNumeros}
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={telefono}
                                            error={errorTelefono}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 col-xl-4">
                                        <TextField
                                            margin="dense"
                                            id="email"
                                            label="E-mail"
                                            fullWidth
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            value={email}
                                            error={errorEmail}
                                        />
                                    </div>
                                </div>
                                <div className="form-row col-md-12 d-flex justify-content-center">
                                    <div className="form-group col-md-12 col-xl-12">
                                        <label className='errorListaPrecios' style={errorIdListaPrecios ? null :{display:'none'}}>La lista de precios no puede estar vacía</label>
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
        open: state.clientesStore.openModalCamposClientes,
        userAttributes: state.utilsStore.userAttributes,
        datosCliente: state.clientesStore.datosCliente,
        listaPrecios: state.listaPreciosStore.listaDetalleListaPrecios
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setModalAddCamposClientes: (item) => dispatch(SetModalAddCamposClientes(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleClientes: (item) => dispatch(SetDetalleClientes(item)),
    setDetalleListaPrecios: (item) => dispatch(SetDetalleListaPrecios(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(CamposClientes));