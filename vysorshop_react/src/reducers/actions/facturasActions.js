export function SetCamposFiltros(item) {
    return {
        type: 'SET_CAMPOS_FILTROS',
        payload: {
            item
        }
    }
}

export function SetDetalleFacturas(item) {
    return {
        type: 'SET_DETALLE_FACTURAS',
        payload: {
            item
        }
    }
}

export function SetOpenModalProductosFactura(item) {
    return {
        type: 'SET_OPEN_MODAL_PRODUCTOS_FACTURA',
        payload: {
            item
        }
    }
}