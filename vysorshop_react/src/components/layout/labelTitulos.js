import React , {Component} from 'react';

const style = {
    labelEncabezado: {
        left: 0,
        top:0,
        bottom: 0,
        width: '100%',
        color: '#128BCC',
        textAlign: 'center',
        fontFamily:'Lora',
        margin:0,
        padding:0,
        fontSize:'2rem'
    },
    label: {
        left: 0,
        top:0,
        bottom: 0,
        width: '100%',
        color: '#128BCC',
        textAlign: 'center',
        fontFamily:'Lora',
        margin:0,
        padding:0,
    }
}

class Label extends Component{
    render(){
        const {texto, tipo} = this.props
        return(
            <label style={tipo == 'encabezado' ? style.labelEncabezado : style.label}>{texto}</label>
        )
    }
}

export default Label;