import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { SetSpinnerModal,SetConfirmacionModalState } from '../../../reducers/actions/utilsActions';
import { SetCamposFiltros, SetDetalleFacturas } from '../../../reducers/actions/facturasActions';
import LabelTitulos from '../../layout/labelTitulos';
import './styles.css';
import { Consultar } from '../../../api/apiFacturas';
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
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
  }

let counter = 0;
function createData(idTransacction, prefijo, fecha, cliente, tipoPago, totalIva, totalBruto, totalNeto, estado, facturaDetail, idfactura) {
    counter += 1;
    return { id: counter, idTransacction, prefijo, fecha, cliente, tipoPago, totalIva, totalBruto, totalNeto, estado, facturaDetail: facturaDetail, idfactura };
}

class CamposFiltros extends React.Component {
    state = {
        Inicio: '',
        Fin: '',
    };

    componentDidMount() {
        this.setState({ Inicio: this.obtenerPrimerDiaMes(), Fin: this.obtenerDiaActual() })
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

    handleCloseConsultar = () => {
        this.props.setDetalleFacturas([]);
        let modal = {};
        this.setState({ Fin: `${this.state.Fin} 23:59:59` }, () => {
            Consultar(this.state, this.props.setSpinnerModal).then(result => {
                if (result.status === 200) {
                    this.llenarListaResultado(result.data);
                } else {
                    modal = {
                        open: true, text: `Ocurrió un error consultando las facturas, por favor intente nuevamente. Si el error persiste, por favor contacte con soporte.`,
                        onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                    }
                    this.props.setConfirmacionModalState(modal);
                }
            })
        })


    };

    llenarListaResultado = (data) => {
        let documentosEnviados = [];
        data.map(item => {
            let fechaEmision = `${item.facturaHeader.fecha.substring(0, 10)} ${item.facturaHeader.fecha.substring(11, 16)}`;
            documentosEnviados.push(createData(item.facturaHeader.idTransacction,
            `${item.facturaHeader.prefijo}${item.facturaHeader.numero}`, 
            fechaEmision, item.facturaHeader.cliente, item.facturaHeader.tipoPago == 0 ? 'DEBITO' : 'CREDITO',
             ccyFormatTotales(item.facturaHeader.totalIva), ccyFormatTotales(item.facturaHeader.totalBruto),
              ccyFormatTotales(item.facturaHeader.totalNeto), item.facturaHeader.estado, item.facturaDetail,
              item.facturaHeader.idfactura))
        })
        this.props.setDetalleFacturas(documentosEnviados)
        this.limpiarEstado();
    }

    handleClose = () => {
        this.limpiarEstado();
    };

    handleChange = (event) => {
        let value = event.target.value;
        if ([event.target.id] == 'Inicio') {
            if (value < '2019-10-01') return;

            if (value > this.state.Fin) return;
        }

        if ([event.target.id] == 'Fin') {
            if (value < this.state.Inicio) return;
        }
        this.setState({ [event.target.id]: value }, () => { })
    }

    limpiarEstado = () => {
        this.setState({ Inicio: this.obtenerPrimerDiaMes(), Fin: this.obtenerDiaActual() }, () => {
            this.props.setCamposFiltros(false);
        })
    }

    render() {
        const { Inicio, Fin } = this.state;
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
                            <div className="form-row mt-3">
                                <div className="form-row col-md-12 d-flex justify-content-between">
                                    <div className="form-group col-xl-6">
                                        <small className="text-muted">Fecha incial</small>
                                        <input type="date" id="Inicio" min="2019-05-01" max={Fin} value={Inicio} onChange={this.handleChange} className="form-control" required />
                                    </div>
                                    <div className="form-group col-xl-6">
                                        <small className="text-muted" >Fecha final</small>
                                        <input type="date" id="Fin" min={Inicio} max={Fin} value={Fin} onChange={this.handleChange} className="form-control" required />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button style={styles.buttonAdd} onClick={this.handleCloseConsultar} name="txtAgregar" color="primary">Consultar</Button>
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
        open: state.facturasStore.openCamposFiltros,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setCamposFiltros: (item) => dispatch(SetCamposFiltros(item)),
    setDetalleFacturas: (item) => dispatch(SetDetalleFacturas(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CamposFiltros);