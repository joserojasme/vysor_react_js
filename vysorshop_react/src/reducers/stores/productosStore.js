const initialState = {
    openModalCamposProductos: false,
    openModalFiltroProductos: false,
    listaDetalleProductos: [],
    datosProductos:{},
    openModalActualizarProductos: false,
}

function ProductosStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_DETALLE_PRODUCTOS': {
            return {
                ...state,
                listaDetalleProductos: action.payload.item
            }
        }

        case 'SET_MODAL_CAMPOS_PRODUCTOS': {
            return {
                ...state,
                openModalCamposProductos: action.payload.item
            }
        }
        case 'SET_MODAL_FILTRO_PRODUCTOS': {
            return {
                ...state,
                openModalFiltroProductos: action.payload.item
            }
        }
        case 'SET_DATOS_PRODUCTOS': {
            return {
                ...state,
                datosProductos: action.payload.item
            }
        }
        case 'SET_MODAL_ACTUALIZAR_PRODUCTOS': {
            return {
                ...state,
                openModalActualizarProductos: action.payload.item
            }
        }
        
        default:
            return state
    }
}

export default ProductosStore;