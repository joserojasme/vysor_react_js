export function SetDetalleProductos(item) {
    return {
        type: 'SET_DETALLE_PRODUCTOS',
        payload: {
            item
        }
    }
}

export function SetModalAddCamposProductos(item) {
    return {
        type: 'SET_MODAL_CAMPOS_PRODUCTOS',
        payload: {
            item
        }
    }
}

export function SetModalAddFiltroProductos(item) {
    return {
        type: 'SET_MODAL_FILTRO_PRODUCTOS',
        payload: {
            item
        }
    }
}

export function SetDatosProductos(item) {
    return {
        type: 'SET_DATOS_PRODUCTOS',
        payload: {
            item
        }
    }
}

export function SetModalActualizarProductos(item) {
    return {
        type: 'SET_MODAL_ACTUALIZAR_PRODUCTOS',
        payload: {
            item
        }
    }
}
