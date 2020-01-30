export function SetDetalleBodega(item) {
    return {
        type: 'SET_DETALLE_BODEGA',
        payload: {
            item
        }
    }
}

export function SetModalAddDetalleBodega(item) {
    return {
        type: 'SET_MODAL_ADD_DETALLE_BODEGA',
        payload: {
            item
        }
    }
}
