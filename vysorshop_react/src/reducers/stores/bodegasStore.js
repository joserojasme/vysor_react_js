const initialState = {
    openModalDetalleBodega: false,
    listaDetalleBodega: [],
}

function bodegasStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_DETALLE_BODEGA': {
            return {
                ...state,
                listaDetalleBodega: action.payload.item
            }
        }

        case 'SET_MODAL_ADD_DETALLE_BODEGA': {
            return {
                ...state,
                openModalDetalleBodega: action.payload.item
            }
        }
        default:
            return state
    }
}

export default bodegasStore;