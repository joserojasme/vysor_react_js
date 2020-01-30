
export function SetConfirmacionModalState(item) {
    return {
        type: 'SET_MODAL_CONFIRMACION_STATE',
        payload: {
            item
        }
    }
}

export function SetSpinnerModal(item) {
    return {
        type: 'SET_SPINNER_MODAL',
        payload: {
            item
        }
    }
}

export function SetModalCodigoConfirmacion(item) {
    return {
        type: 'SET_MODAL_CODIGO_VERIFICACION',
        payload: {
            item
        }
    }
}

export function SetSnackBarState(item) {
    return {
        type: 'SET_SNACKBAR_STATE',
        payload: {
            item
        }
    }
}


export function SetLoadingValue(item) {
    return {
        type: 'SET_LOADING_VALUE',
        payload: {
            item
        }
    }
}

export function SetUserAttributes(item) {
    return {
        type: 'SET_USER_ATTRIBUTES',
        payload: {
            item
        }
    }
}

export function SetUserGroup(item) {
    return {
        type: 'SET_USER_GROUP',
        payload: {
            item
        }
    }
}

export function Logout() {
    return {
        type: 'LOGOUT',
    }
}



