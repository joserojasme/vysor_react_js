import React, { Component, Fragment } from 'react';
import LabelTitulos from '../../components/layout/labelTitulos';
import LogoPortal from '../../static/images/logoVysorshop.png';
import './styles.css';
import { Link } from 'react-router-dom'
import { SetLoadingValue, SetSnackBarState, SetConfirmacionModalState } from '../../reducers/actions/utilsActions';
import { connect } from 'react-redux';
import { ForgotPassword, ForgotPasswordSubmit } from './auth/amplifyAuth';
import SnackBarMensajes from '../modals/snackBarMensajes';
import ConfirmacionModal from '../modals/confirmacionModal';
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

class RecordarPassword extends Component {
    state = {
        username: '',
        newPassword: '',
        code: '',
        codeSent: false,
        buttonText: 'Enviar código',
        redirect: false,
    }

    handleClick = () => {
        this.props.setConfirmacionModalState({ 'open': false });
    }

    handleChange = (event) => {
        let value = event.target.value;
        if (event.target.id == 'username') {
            value = value.toUpperCase();
        }

        this.setState({
            [event.target.id]: value
        })
    }

    handleCambiarPassword = async (event) => {
        var sw = true;
        let allState = this.state;
        if (this.state.codeSent) {
            Object.keys(this.state).map(
                function (key) {
                    if (key == 'redirect' || key == 'codeSent') return
                    var item = allState[key];
                    if (item == '') sw = false;
                });
        } else {
            Object.keys(this.state).map(
                function (key) {
                    if (key == 'username') {
                        var item = allState[key];
                        if (item == '') sw = false;
                    }
                });
        }

        if (sw) {
            const { username, code, newPassword, codeSent } = this.state;
            event.preventDefault();
            if (codeSent) {
                ForgotPasswordSubmit(username, code, newPassword, this.props.setLoadingValue).then(result => { this.validarRespuestaCambioPassword(result) })
            } else {
                ForgotPassword(username,this.props.setLoadingValue).then(result => { this.validarRespuestaEnvioCodigo(result) })
            }
        } else {
            return
        }
    }

    validarRespuestaCambioPassword = (result) => {
        if (result.code == undefined) {
            this.props.setSnackBarState({ open: true, message: 'Cambio realizado. Inicie sesión' })
            this.setState({ redirect: true })
        } else {
            let mensaje = '';
            switch (result.code) {
                case 'ExpiredCodeException':
                    mensaje = 'El código ya expiró, por favor solicite un nuevo código';
                    break;
                case 'CodeMismatchException':
                    mensaje = 'El código es incorrecto';
                    break;
                case 'UserNotFoundException':
                    mensaje = 'Lo sentimos, el usuario no fue encontrado';
                    break;
                case 'NetworkError':
                    mensaje = 'Lo sentimos, parece que no tienes internet.'
                    break;
                case 'InvalidParameterException':
                    mensaje = 'Lo sentimos, la contraseña ingresada no es correcta. Debe tener una lóngitud mínina de 8 carácteres y contener letras minúsculas, mayúsculas y al menos un número';
                    break;
                case 'InvalidPasswordException':
                    mensaje = 'Lo sentimos, la contraseña ingresada no es correcta. Debe tener una lóngitud mínina de 8 carácteres y contener letras minúsculas, mayúsculas y al menos un número';
                    break;
                default:
                    mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
                    break;
            }
            this.setState({ newPassword: '' }, () => {
                let modal = { open: true, text: mensaje, onClick:this.handleClick }
                this.props.setConfirmacionModalState(modal);
            })

        }
    }

    validarRespuestaEnvioCodigo = (result) => {
        if (result.code == undefined) {
            this.setState({ codeSent: true, buttonText: 'CAMBIAR CONTRASEÑA' }, () => {
                this.props.setSnackBarState({ open: true, message: 'Por favor ingrese los nuevos datos' })
            })
        } else {
            let mensaje = '';
            switch (result.code) {
                case 'UserNotFoundException':
                    mensaje = 'Lo sentimos, el usuario no fue encontrado';
                    break;
                case 'NetworkError':
                    mensaje = 'Lo sentimos, parece que no tienes internet.'
                    break;
                case 'InvalidParameterException':
                    mensaje = `Lo sentimos, el usuario debió activarse antes`;
                    break;
                default:
                    mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
                    break;
            }
            let modal = { open: true, text: mensaje, onClick:this.handleClick }
            this.props.setConfirmacionModalState(modal);
        }
    }

    render() {
        const { username, newPassword, code, codeSent, buttonText, redirect } = this.state;
        const { loading } = this.props;
        
        if (redirect) return <Redirect to={{ pathname: '/' }} />

        return (
            <div className="body">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card card-signin my-5">
                                <div className="card-body">
                                    <div style={Styles.rootLogo} ><img style={Styles.logo} src={LogoPortal} /></div>
                                    <form className="form-signin" autoComplete="off">
                                        <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: '1rem' }}><small className="text-muted">{message}</small></div>
                                        <div className="form-label-group">
                                            <input type="text" id="username" className="form-control" value={username} placeholder="username" onChange={this.handleChange} required autofocus readOnly={codeSent} />
                                            <label for="username">Nombre de usuario</label>
                                        </div>
                                        {codeSent &&
                                            <Fragment>
                                                <div className="form-label-group">
                                                    <input type="text" id="code" className="form-control" value={code} placeholder="código" onChange={this.handleChange} required={codeSent} />
                                                    <label for="code">Código verificación</label>
                                                </div>
                                                <div className="form-label-group">
                                                    <input type="password" id="newPassword" className="form-control" value={newPassword} placeholder="Nueva contraseña" onChange={this.handleChange} required={codeSent} />
                                                    <label for="newPassword">Nueva contraseña</label>
                                                    <small className="text-muted">Debe tener: 8 o más carácteres, minúsculas, mayúsculas y números</small>
                                                </div>
                                            </Fragment>
                                        }
                                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleCambiarPassword} disabled={loading}>
                                            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {buttonText}
                                        </button>
                                        <hr className="my-2" />
                                        <Link style={{ textDecoration: 'none' }} to={{
                                            pathname: '/login',
                                            state: {}
                                        }}>
                                            <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: '1rem' }}><small className="text-muted">Volver al login</small></div>
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmacionModal />
                <SnackBarMensajes />
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    return {
        loading: state.utilsStore.loading
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLoadingValue : (item)=>dispatch(SetLoadingValue(item)),
    setConfirmacionModalState : (item) =>dispatch(SetConfirmacionModalState(item)),
    setSnackBarState : (item)=>dispatch(SetSnackBarState(item))
})

export default connect(mapStateToProps,mapDispatchToProps)(RecordarPassword);

const message = "Por favor ingrese su nombre de usuario y le enviaremos a su correo electrónico el código para realizar el cambio de contraseña. Recuerde revisar la carpeta de spam";
