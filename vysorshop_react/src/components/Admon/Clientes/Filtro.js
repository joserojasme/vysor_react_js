import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { SetDetalleClientes,SetModalAddFiltroClientes } from '../../../reducers/actions/clientesActions';
import { SetSpinnerModal, SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import LabelTitulos from '../../layout/labelTitulos';
import { handleKeyPressTextoNumeroGuion } from '../../../utils/funcionesUtiles';
import '../styles.css';
import { consultarClienteBy } from '../../../api/apiClientes';
import { numberFormat } from '../../../utils/funcionesUtiles';

const styles = {
    buttonAdd: {
        fontWeight: 'bold',
        backgroundColor: '#128BCC',
        color: 'white',
    }
}

function ccyFormatTotales(num) {
    num = parseFloat(num);
    return numberFormat(num);
}

let counter = 0;
function createData(tipoDocumento, prefijo, numeroDocumento, idAdquirente, nombreAdquirente, fechaEmision, valorFactura, estadoDocumento) {
    counter += 1;
    return { id: counter, tipoDocumento, prefijo, numeroDocumento, idAdquirente, nombreAdquirente, fechaEmision, valorFactura,estadoDocumento };
}

class CamposFiltros extends React.Component {
    state = {
        fechaEmisionInicio: '',
        fechaEmisionFin: '',
        identificacionAdquirente: '',
        codigoEmisor: '',
    };

    componentDidMount() {
        this.setState({ fechaEmisionInicio: this.obtenerPrimerDiaMes(),fechaEmisionFin: this.obtenerDiaActual() })
    }

    obtenerPrimerDiaMes = () => {
        var date = new Date();
        var firstday = new Date(date.getFullYear(), date.getMonth(), '01').toISOString().split('T')[0];
        return firstday;
    }

    obtenerDiaActual = () => {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
        return today;
    }

    handleCloseAgregar = () => {
        this.props.setFacturasEnviadas([]);
        let modal = {};
        this.setState({ codigoEmisor: this.props.userAttributes.codigoEmisor }, () => {
            consultarClienteBy(this.state, this.props.setSpinnerModal).then(result => {
                if (result.data.length > 0) {
                    this.llenarListaResultado(result.data);
                } else {
                    modal = {
                        open: true, text: `Ocurrió un error consultando los documentos enviados, por favor intente nuevamente. Si el error persiste, por favor contacte con soporte.`,
                        onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                    }
                    this.props.setConfirmacionModalState(modal);
                }
            })
        })


    };

    llenarListaResultado = (data) => {
        const { tiposDocumentos } = this.props;
        let documentosEnviados = [];
        data.map(item => {
            let jsonDocumento = JSON.parse(item.jsonDocumento);
            let tipoDocumento = tiposDocumentos.filter(item => jsonDocumento.tipo == item.idTipo)
            let nombreAdquirente = `${jsonDocumento.nombresAdquiriente} ${jsonDocumento.primerApellido} ${jsonDocumento.segundoApellido}`;
            let fechaEmision = jsonDocumento.fechaEmision.substring(0, 10);
            let estado = this.codigosEstado(item.estadoDocumento);
            documentosEnviados.push(createData(tipoDocumento[0].nombre, item.prefijoDocumento, item.numeroDocumento
                , item.identificacionAdquirente, nombreAdquirente, fechaEmision, ccyFormatTotales(jsonDocumento.valorNeto), estado))
        })
        this.props.setFacturasEnviadas(documentosEnviados)
        this.limpiarEstado();
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleChange = (event) => {
        let value = event.target.value;
        if([event.target.id] == 'fechaEmisionInicio'){
            if(value < '2019-05-01')return;

            if(value > this.state.fechaEmisionFin)return;
        }

        if([event.target.id] == 'fechaEmisionFin'){
            if(value < this.state.fechaEmisionInicio)return;
        }
        this.setState({ [event.target.id]: value }, () => { })
    }

    handleKeyPressTextoNumeroGuion = (event) => {
        if (!handleKeyPressTextoNumeroGuion(event)) {
            event.preventDefault();
        }
    }

    limpiarEstado = () => {
        this.setState({ fechaEmisionInicio: this.obtenerPrimerDiaMes(), fechaEmisionFin: this.obtenerDiaActual(), identificacionAdquirente: '' }, () => {
            this.props.setOpenModalFiltroFactura(false);
        })
    }

    codigosEstado = (codigo) =>{
        let mensaje;
        switch (codigo) {
            case '000':
                mensaje = 'Pendiente';
                break;
            case '001':
                mensaje = 'Error';
                break;
            case '002':
                mensaje = 'Enviado adquirente';
                break;
            case '003':
                mensaje = 'Enviado adquirente';
                break;
            case '006':
                mensaje = 'Aprobado por adquirente';
                break;
            case '00401':
                mensaje = 'Error';
                break;
            case '702':
                mensaje = 'Error';
                break;
            case '703':
                mensaje = 'Saldo insuficiente';
                break;
            case '00402':
                mensaje = 'Error en DIAN';
                break;
            case '00403':
                mensaje = 'Rechazado por DIAN';
                break;
            case '00404':
                mensaje = 'Documento se encuentra en domina';
                break;
            case '00406':
                mensaje = 'Error enviando E-mail.';
                break;
            default:
                mensaje = 'Desconocido';
                break;
        }
        return mensaje;
    }

    render() {
        const { fechaEmisionInicio, fechaEmisionFin, identificacionAdquirente } = this.state;
        const { open } = this.props;

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    scroll='paper'
                >
                    <form>
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto='Filtrar búsqueda' /></DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="identificacionAdquirente"
                                label="Identificación adquirente"
                                onKeyPress={this.handleKeyPressTextoNumeroGuion}
                                fullWidth
                                onChange={this.handleChange}
                                autoComplete="off"
                                value={identificacionAdquirente}
                            />
                            <div className="form-row mt-3">
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-xl-6">
                                        <small className="text-muted">Fecha incial</small>
                                        <input type="date" id="fechaEmisionInicio" min="2019-05-01" max={fechaEmisionFin} value={fechaEmisionInicio} onChange={this.handleChange} className="form-control" required />
                                    </div>
                                    <div className="form-group col-xl-6">
                                        <small className="text-muted" >Fecha final</small>
                                        <input type="date" id="fechaEmisionFin" min={fechaEmisionInicio} max={fechaEmisionFin} value={fechaEmisionFin} onChange={this.handleChange} className="form-control" required />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button style={styles.buttonAdd} onClick={this.handleCloseAgregar} name="txtAgregar" color="primary">Consultar</Button>
                            <Button style={styles.buttonAdd} onClick={this.handleClose} name="Cerrar" color="primary">Cerrar</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        open: state.clientesStore.openModalFiltrosFactura,
        userAttributes: state.clientesStore.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setModalAddFiltroClientes: (item) => dispatch(SetModalAddFiltroClientes(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setDetalleClientes: (item) => dispatch(SetDetalleClientes(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CamposFiltros);