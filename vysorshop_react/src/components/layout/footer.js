import React, { Component } from 'react';

const style = {
    footer: {
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#f2f2f2 ',
        color: 'black',
        textAlign: 'center',
        fontFamily:'Quicksand',
        
    }
}

class Footer extends Component {
    render() {
        let year = new Date().getFullYear();
        return (
            <div style={style.footer}>
                <p>© {year} by VYSORSHOP Todos los derechos reservados</p>
            </div>
        )
    }
}

export default Footer;