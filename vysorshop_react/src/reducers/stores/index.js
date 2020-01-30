import bodegasStore from './bodegasStore';
import productosStore from './productosStore';
import utilsStore from './utilsStore';
import clientesStore from './clientesStore';
import listaPreciosStore from './listaPreciosStore';
import facturasStore from './facturasStore';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    utilsStore,
    bodegasStore,
    productosStore,
    clientesStore,
    listaPreciosStore,
    facturasStore
})

export default rootReducer;