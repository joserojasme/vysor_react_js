const initialState = {
    openModalCamposListaPrecios: false,
    openModalFiltroListaPrecios: false,
    listaDetalleListaPrecios: [],
    datosListaPrecio:{},
    openModalActualizarListaPrecios: false,
    openModalAgregarProductosListaPrecios: false,
}

function ListaPreciosStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_DETALLE_LISTA_PRECIOS': {
            return {
                ...state,
                listaDetalleListaPrecios: action.payload.item
            }
        }

        case 'SET_MODAL_CAMPOS_LISTA_PRECIOS': {
            return {
                ...state,
                openModalCamposListaPrecios: action.payload.item
            }
        }
        case 'SET_MODAL_FILTRO_LISTA_PRECIOS': {
            return {
                ...state,
                openModalFiltroListaPrecios: action.payload.item
            }
        }
        case 'SET_DATOS_LISTA_PRECIOS': {
            return {
                ...state,
                datosListaPrecio: action.payload.item
            }
        }
        case 'SET_MODAL_ACTUALIZAR_LISTA_PRECIOS': {
            return {
                ...state,
                openModalActualizarListaPrecios: action.payload.item
            }
        }
        case 'SET_MODAL_AGREGAR_PRODUCTOS_LISTA_PRECIOS': {
            return {
                ...state,
                openModalAgregarProductosListaPrecios: action.payload.item
            }
        }
        default:
            return state
    }
}

export default ListaPreciosStore;