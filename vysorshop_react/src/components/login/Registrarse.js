import React, { Component, Fragment } from 'react';
import LogoVysorshop from '../../static/images/logoVysorshop.png';
import './styles.css';
import { Link } from 'react-router-dom'
import { SignUp } from './auth/amplifyAuth';
import { SetModalCodigoConfirmacion, SetConfirmacionModalState, SetLoadingValue } from '../../reducers/actions/utilsActions';
import { connect } from 'react-redux';
import ConfirmacionModal from '../modals/confirmacionModal';
import CodigoVerificacionModal from './CodigoVerificacion';
import { Redirect } from 'react-router';

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

let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Login extends Component {
    state = {
        username: '',
        password: '',
        phone_number: '',
        fullname: '',
        userid: '',
        email: '',
        usernameCodigoVerificacion: '',
        redirect:false
    }

    componentWillMount(){
        if(this.props.userGrupo[0]!="Administrador"){
            this.setState({redirect:true})
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        if (event.target.id == 'fullname' || event.target.id == 'username') {
            value = value.toUpperCase();
        }
        this.setState({
            [event.target.id]: value
        })
        if (event.target.id == 'username') {
            this.setState({ usernameCodigoVerificacion: value });
        }
    }

    handleRegistrarse = async (event) => {
        var sw = true;
        let allState = this.state;

        if (regEmail.test(this.state.email) == false) {
            sw = false;
            this.setState({ email: '' });
        }

        Object.keys(this.state).map(
            function (key) {
                if(key=='redirect')return
                var item = allState[key];
                if (item == '') sw = false;
            });

        if (sw) {
            event.preventDefault();
            let phonenumber = `+57${this.state.phone_number}`;
            this.setState({ phone_number: phonenumber }, () => {
                SignUp({ ...this.state }, this.props.setLoadingValue).then((result) => this.validarRespuestaRegistro(result))
            })
        } else {
            return
        }
    }

    validarRespuestaRegistro = (result) => {
        if (result.code == undefined) {
            this.setState({
                username: '',
                password: '',
                phone_number: '',
                fullname: '',
                userid: '',
                email: '',
            }, () => { this.props.setModalCodigoConfirmacion(true) })
        } else {
            let mensaje = '';
            switch (result.code) {
                case 'InvalidPasswordException':
                    mensaje = 'Lo sentimos, la contraseña ingresada no es correcta. Debe tener una lóngitud mínina de 8 carácteres y contener letras minúsculas, mayúsculas y al menos un número';
                    break;
                case 'NetworkError':
                    mensaje = 'Lo sentimos, parece que no tienes internet.'
                    break;
                case 'InvalidParameterException':
                    mensaje = `Lo sentimos, parece que ingresaste un dato de manera incorrecta: ${result.message}`;
                    break;
                default:
                    mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
                    break;
            }
            let phonenumber = this.state.phone_number.substring(3, this.state.phone_number.length);
            this.setState({ phone_number: phonenumber, password: '' }, () => {
                let modal = { open: true, text: mensaje, onClick: this.handleClick }
                this.props.setConfirmacionModalState(modal);
            })
        }
    }

    handleClick = () => {
        this.props.setConfirmacionModalState({ 'open': false });
    }

    render() {
        const { username, password, phone_number, fullname, userid, email, usernameCodigoVerificacion,redirect } = this.state;
        if(redirect)return <Redirect to={{pathname: '/factura'}} />
        const { loading } = this.props;
        return (
            <Fragment>
                <div className="body">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                                <div className="card card-signin my-5">
                                    <div className="card-body">
                                        <div style={Styles.rootLogo} ><img style={Styles.logo} src={LogoVysorshop} /></div>
                                        <form className="form-signin" autoComplete="off">
                                        <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: '1rem' }}><small className="text-muted">{message}</small></div>
                                            <div className="form-label-group">
                                                <input type="text" id="fullname" value={fullname} className="form-control" placeholder="Nombre" onChange={this.handleChange} required />
                                                <label for="fullname">Nombre</label>
                                            </div>
                                            <div className="form-label-group">
                                                <input type="text" id="phone_number" value={phone_number} className="form-control" placeholder="Celular" onChange={this.handleChange} required />
                                                <label for="phone_number">Número celular</label>
                                            </div>
                                            <div className="form-label-group">
                                                <input type="text" id="userid" value={userid} className="form-control" placeholder="documento" onChange={this.handleChange} required />
                                                <label for="userid">Cédula ó Nit</label>
                                            </div>
                                            <div className="form-label-group">
                                                <input type="email" id="email" value={email} className="form-control" placeholder="correo" onChange={this.handleChange} required />
                                                <label for="email">E-Mail</label>
                                                <small className="text-muted">ejemplo@dominio.com</small>
                                            </div>
                                            <hr className="my-4" />
                                            <div className="form-label-group">
                                                <input type="text" id="username" value={username} className="form-control" placeholder="Email address" onChange={this.handleChange} required />
                                                <label for="username">Nombre de usuario</label>
                                            </div>
                                            <div className="form-label-group">
                                                <input type="password" id="password" value={password} className="form-control" placeholder="Contraseña" onChange={this.handleChange} required />
                                                <label for="password">Contraseña</label>
                                                <small className="text-muted">Debe tener: 8 o más carácteres, minúsculas, mayúsculas y números</small>
                                            </div>
                                            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleRegistrarse} >
                                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                Registrar usuario</button>
                                            <hr className="my-1" />
                                            <Link to={{
                                                pathname: '/login',
                                                state: {}
                                            }}>
                                                <div style={{ alignItems: 'center', textAlign: 'center', display:'none' }}><small className="text-muted">Ya tengo una cuenta</small></div>
                                            </Link>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmacionModal />
                <CodigoVerificacionModal username={usernameCodigoVerificacion} />
            </Fragment>
        )
    }
}

function mapStateToProps(state, props) {
    return {
        loading: state.utilsStore.loading,
        userGrupo: state.utilsStore.userGrupo
    }
}

const mapDispatchToProps = (dispatch) => ({
    setModalCodigoConfirmacion: (item) => dispatch(SetModalCodigoConfirmacion(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setLoadingValue: (item) => dispatch(SetLoadingValue(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Login);

const message = "Registrar nuevo usuario";