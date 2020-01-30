const initialState = {
    openModalCamposClientes: false,
    openModalFiltroClientes: false,
    listaDetalleClientes: [],
    datosCliente:{},
    openModalActualizarClientes: false,
}

function clientesStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_DETALLE_CLIENTES': {
            return {
                ...state,
                listaDetalleClientes: action.payload.item
            }
        }

        case 'SET_MODAL_CAMPOS_CLIENTES': {
            return {
                ...state,
                openModalCamposClientes: action.payload.item
            }
        }
        case 'SET_MODAL_FILTRO_CLIENTES': {
            return {
                ...state,
                openModalFiltroClientes: action.payload.item
            }
        }
        case 'SET_DATOS_CLIENTES': {
            return {
                ...state,
                datosCliente: action.payload.item
            }
        }
        case 'SET_MODAL_ACTUALIZAR_CLIENTES': {
            return {
                ...state,
                openModalActualizarClientes: action.payload.item
            }
        }
        
        default:
            return state
    }
}

export default clientesStore;