import React, { Component } from 'react';
import Customers from '../static/images/customers.png';
import Products from '../static/images/products.png';
import PriceList from '../static/images/priceList.png';
import Factura from '../static/images/factura.png';
import { Link } from 'react-router-dom';

const Styles = {
    rootLogo: {
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxHeight: '6em',
    },
    logo: {
        maxHeight: 'inherit',
    },
}

class Bodegas extends Component {
    render() {

        return (
            <div className="form-row">
                <div className="form-row col-md-12 d-flex justify-content-between">
                    <Link style={{ textDecoration: 'none' }} key={0} to={{
                        pathname: '/clientes',
                    }}>
                        <div className="form-group col-md-12 col-xl-3">
                            <div style={Styles.rootLogo} ><img style={Styles.logo} src={Customers} /></div>
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} key={0} to={{
                        pathname: '/productos',
                    }}>
                        <div className="form-group col-md-12 col-xl-3">
                            <div style={Styles.rootLogo} > <img style={Styles.logo} src={Products} /></div>
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} key={0} to={{
                        pathname: '/lista_precios',
                    }}>
                        <div className="form-group col-md-12 col-xl-3">
                            <div style={Styles.rootLogo} ><img style={Styles.logo} src={PriceList} /></div>
                        </div>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} key={0} to={{
                        pathname: '/facturas',
                    }}>
                        <div className="form-group col-md-12 col-xl-3">
                            <div style={Styles.rootLogo} ><img style={Styles.logo} src={Factura} /></div>
                        </div>
                    </Link>
                </div>

            </div>
        )
    }
}


export default Bodegas;