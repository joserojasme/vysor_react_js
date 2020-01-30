const initialState = {
    openCamposFiltros: false,
    listaDetalleFacturas: [],
    openModalProductosFactura: [],
}

function facturasStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_CAMPOS_FILTROS': {
            return {
                ...state,
                openCamposFiltros: action.payload.item
            }
        }
        case 'SET_DETALLE_FACTURAS': {
            return {
                ...state,
                listaDetalleFacturas: action.payload.item
            }
        }
        case 'SET_OPEN_MODAL_PRODUCTOS_FACTURA': {
            return {
                ...state,
                openModalProductosFactura: action.payload.item
            }
        }
        default:
            return state
    }
}

export default facturasStore;