const initialState = {
    modal: { open: false },
    spinnerModal: false,
    openModalCodigoVerificacion: false,
    snackbar: { open: false },
    loading: false,
    userAttributes: {},
    userGrupo: [],
}

function utilsStore(state = initialState, action) {
    switch (action.type) {
        case 'SET_MODAL_CONFIRMACION_STATE': {
            return {
                ...state,
                modal: action.payload.item
            }
        }
        case 'SET_SPINNER_MODAL': {
            return {
                ...state,
                spinnerModal: action.payload.item
            }
        }
        case 'SET_MODAL_CODIGO_VERIFICACION': {
            return {
                ...state,
                openModalCodigoVerificacion: action.payload.item
            }
        }
        case 'SET_SNACKBAR_STATE': {
            return {
                ...state,
                snackbar: action.payload.item
            }
        }
        case 'SET_LOADING_VALUE': {
            return {
                ...state,
                loading: action.payload.item
            }
        }
        case 'SET_USER_ATTRIBUTES': {
            return {
                ...state,
                userAttributes: action.payload.item
            }
        }
        case 'SET_USER_GROUP': {
            return {
                ...state,
                userGrupo: action.payload.item
            }
        }
        case 'LOGOUT': {
            return initialState
        }
        default:
            return state
    }
}

export default utilsStore;