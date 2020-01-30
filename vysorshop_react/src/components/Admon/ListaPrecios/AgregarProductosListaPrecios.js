import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Update from '@material-ui/icons/Update';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Consultar as ConsultarProductos } from '../../../api/apiProductos';
import { ConsultarBy as ConsultarProductosListaPrecios, Insertar as InsertarProductosListaPrecios, Actualizar as ActualizarProductosListaPrecios } from '../../../api/apiProductosListaPrecios';
import { SetModalAgregarProductosListaPrecios } from '../../../reducers/actions/listaPreciosActions';
import { SetConfirmacionModalState, SetSpinnerModal } from '../../../reducers/actions/utilsActions';
import { handleKeyPressNumeros } from '../../../utils/funcionesUtiles';
import LabelTitulos from '../../layout/labelTitulos';
import './styles.css';

const styles = {
    buttonAdd: {
        fontWeight: 'bold',
        backgroundColor: '#128BCC',
        color: 'white',
    },
    table: {
        minWidth: 650,
    },
}

const customStyles = {
    input: styles => {
        return {
            ...styles,
            height: '2.25rem'
        };
    },
}

function createData(id, codigo, plu, nombre, costo, fechaCreacion, usuario) {
    return { id, codigo, plu, nombre, costo, fechaCreacion, usuario };
}

function createDataLista(id, idProducto, idListaPrecio, precio, idEstado, fechaCreacion, fechaActualizacion, usuario, iva) {
    return { id, idProducto, idListaPrecio, precio, idEstado, fechaCreacion, fechaActualizacion, usuario, iva };
}

let modal = {};

class AgregarProductosListaPrecios extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idProducto: null,
            idListaPrecio: null,
            precio: null,
            iva: 19,
            productosSelect: [],
            productosListaPrecios: [],
            isUpdate: false,
            nombreProducto:null,
            id:null
        }
    }

    componentWillMount() {
        this.ConsultarProductos();
        this.ConsultarProductosListaPrecios();
    }

    ConsultarProductos = () => {
        ConsultarProductos(this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaProductos(result.data);
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando los producto, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
    }

    llenarListaProductos = (data) => {
        const { userAttributes } = this.props;
        let productos = [];
        data.map(item => {
            let fechaCreacion = item.fechaCreacion.substring(0, 10);
            productos.push(createData(item.id, item.codigo, item.plu, item.nombre, item.costo, fechaCreacion, item.usuario))
        })
        let listaPrecios = [];
        productos.map((item) => {
            listaPrecios.push({ "value": item.id, "label": item.nombre });
        })
        this.setState({ productosSelect: listaPrecios, usuario: userAttributes["custom:username"] }, () => { })
    }

    ConsultarProductosListaPrecios = () => {
        const { datosListaPrecio } = this.props;
        ConsultarProductosListaPrecios(datosListaPrecio.id, this.props.setSpinnerModal).then(result => {
            if (result.status == 200) {
                this.llenarListaProductosListaPrecios(result.data);
            } else {
                modal = {
                    open: true, text: `Ocurrió un error consultando los productos por lista de precios, por favor intente de nuevo. Si el error persiste, por favor contacte con soporte.`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
            }
        })
        this.setState({isUpdate: false,nombreProducto:null, idProducto:null, precio:''})
    }

    llenarListaProductosListaPrecios = (data) => {
        let productos = [];
        data.map(item => {
            productos.push(createDataLista(item.id, item.idProducto, item.idListaPrecio, item.precio, item.idEstado, item.fechaCreacion, item.fechaActualizacion, item.usuario, item.iva))
        })

        this.setState({ productosListaPrecios: productos }, () => { })
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value });
    }

    handleClose = () => {
        this.props.setModalAgregarProductosListaPrecios(false);
    };

    handleChangeProducto = (selectedOption) => {
        this.setState({ idProducto: selectedOption.value }, () => { })
    }

    handleKeyPressNumeros = (event) => {
        if (!handleKeyPressNumeros(event)) {
            event.preventDefault();
        }
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { userAttributes, datosListaPrecio, setSpinnerModal } = this.props;
        const { idProducto, precio, iva, isUpdate, id } = this.state;

        if(!isUpdate){
            if (idProducto === null || precio === null || precio === '' || iva === '') {
                modal = {
                    open: true, text: `Debe ingresar todos los datos`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
                return;
            }
    
            let productoListaPrecioObject = new Object({
                idProducto: idProducto,
                idListaPrecio: datosListaPrecio.id,
                precio: precio,
                iva: iva,
                usuario: userAttributes["custom:username"]
            })
    
            InsertarProductosListaPrecios(JSON.stringify(productoListaPrecioObject), setSpinnerModal).then(result => {
                if (result.status == 200) {
                    this.ConsultarProductosListaPrecios();
                } else {
                    modal = {
                        open: true, text: `No se pudo guardar el nuevo precio para el producto. Verifique si el precio para el producto ya existe en esta lista de precios.`,
                        onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                    }
                    this.props.setConfirmacionModalState(modal);
                }
            })
        }else{
            if (precio === null || precio === '' || iva === '') {
                modal = {
                    open: true, text: `Debe ingresar todos los datos`,
                    onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                }
                this.props.setConfirmacionModalState(modal);
                return;
            }
    
            let productoListaPrecioObject = new Object({
                idProducto: idProducto,
                idListaPrecio: datosListaPrecio.id,
                precio: precio,
                iva: iva,
                usuario: userAttributes["custom:username"],
                id:id
            })
    
            ActualizarProductosListaPrecios(productoListaPrecioObject, setSpinnerModal).then(result => {
                if (result.status == 200) {
                    this.ConsultarProductosListaPrecios();
                } else {
                    modal = {
                        open: true, text: `No se pudo actualizar el nuevo precio para el producto.`,
                        onClick: () => { this.props.setConfirmacionModalState({ open: false }) }
                    }
                    this.props.setConfirmacionModalState(modal);
                }
            })
        }
        

    };

    NombreProducto = (idProducto) => {
        const { productosSelect } = this.state;
        let nombreProducto = productosSelect.filter(item => {
            return item.value == idProducto
        })
        return nombreProducto[0].label;
    }

    handleClickUpdate = (productoListaPrecios) => {
        productoListaPrecios = JSON.parse(productoListaPrecios);
        this.setState({
            nombreProducto: this.NombreProducto(productoListaPrecios.idProducto), isUpdate:true,
            precio:productoListaPrecios.precio, iva: productoListaPrecios.iva, idProducto: productoListaPrecios.idProducto, id:productoListaPrecios.id
        })
    }

    render() {
        const { precio, iva, productosSelect, productosListaPrecios, isUpdate, nombreProducto } = this.state;
        const { open, datosListaPrecio } = this.props;

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    scroll='paper'
                    fullScreen={isWidthUp('md', this.props.width) ? false : true}
                    fullWidth={isWidthUp('xl', this.props.width) ? false : true}
                    maxWidth='md'
                >
                    <form>
                        <DialogTitle id="form-dialog-title"><LabelTitulos texto={`Agregar productos a lista de precios ${datosListaPrecio.nombre}`} /></DialogTitle>
                        <DialogContent>
                            <form onSubmit={this.handleClickGuardar}>
                                <div className="form-row">
                                    <div className="form-row col-md-12 d-flex justify-content-between">
                                        <div className="form-group col-md-12 col-xl-6">
                                            {!isUpdate &&
                                                <Select
                                                    onChange={this.handleChangeProducto.bind(this)}
                                                    options={productosSelect}
                                                    placeholder='Producto *'
                                                    styles={customStyles}
                                                    className='mt-2'
                                                />
                                            }

                                            {isUpdate &&
                                                <TextField
                                                required
                                                    margin="dense"
                                                    id="nombreProducto"
                                                    label="Producto"
                                                    fullWidth
                                                    inputProps={{
                                                        readOnly: true,
                                                    }}
                                                    autoComplete="off"
                                                    value={nombreProducto}
                                            />
                                            }

                                        </div>
                                        <div className="form-group col-md-12 col-xl-3">
                                            <TextField
                                                required
                                                margin="dense"
                                                id="precio"
                                                label="Precio"
                                                onKeyPress={this.handleKeyPressNumeros}
                                                fullWidth
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                                value={precio}
                                            />
                                        </div>
                                        <div className="form-group col-md-12 col-xl-3">
                                            <TextField
                                                required
                                                margin="dense"
                                                id="iva"
                                                label="Iva"
                                                onKeyPress={this.handleKeyPressNumeros}
                                                fullWidth
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                                value={iva}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row mb-2">
                                    <Button type='submit' style={styles.buttonAdd} color="primary">Guardar</Button>
                                </div>
                            </form>
                            {productosListaPrecios.length > 0 &&
                                productosSelect.length > 0 &&
                                <div className="form-row mb-5">
                                    <Table className={styles.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Producto</TableCell>
                                                <TableCell align="right">Precio</TableCell>
                                                <TableCell align="right">Iva</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {productosListaPrecios.map(row => (
                                                <TableRow key={row.name}>
                                                    <TableCell align="left">
                                                        <div className="form-row">
                                                            <div className="form-row col-md-4 d-flex justify-content-between">
                                                                <div className="form-group col-xl-1">
                                                                    <Update onClick={event => this.handleClickUpdate(JSON.stringify(row))} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{this.NombreProducto(row.idProducto)}</TableCell>
                                                    <TableCell align="right">${row.precio}</TableCell>
                                                    <TableCell align="right">{row.iva} %</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button style={styles.buttonAdd} onClick={this.handleClose} color="primary">Cerrar modal</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        open: state.listaPreciosStore.openModalAgregarProductosListaPrecios,
        userAttributes: state.utilsStore.userAttributes,
        datosListaPrecio: state.listaPreciosStore.datosListaPrecio,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setModalAgregarProductosListaPrecios: (item) => dispatch(SetModalAgregarProductosListaPrecios(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(AgregarProductosListaPrecios));