import React, { Component } from 'react';
import LabelTitulos from '../../components/layout/labelTitulos';
import LogoVysor from '../../static/images/logoVysorshop.png';
import './styles.css';
import { Link } from 'react-router-dom'
import { SetModalCodigoConfirmacion, SetSnackBarState, SetConfirmacionModalState, SetLoadingValue, SetUserAttributes } from '../../reducers/actions/utilsActions';
import { connect } from 'react-redux';
import { SignIn, GetUserData } from './auth/amplifyAuth';
import SnackBarMensajes from '../modals/snackBarMensajes';
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

class Login extends Component {
    state = {
        username: '',
        password: '',
        usernameCodigoVerificacion: '',
        redirect: false
    }

    componentWillMount() {
        GetUserData().then(result => {
            if (result != 'not authenticated') {
                this.setState({ redirect: true })
            }
        })
    }

    componentDidMount() {
        this.props.setModalCodigoConfirmacion(false);
        this.props.setConfirmacionModalState({ open: false });
        this.props.setLoadingValue(false);
    }

    handleChange = (event) => {
        let value = event.target.value;
        if (event.target.id == 'username') {
            value = value.toUpperCase();
            this.setState({ usernameCodigoVerificacion: value });
        }

        this.setState({
            [event.target.id]: value
        })
    }

    handleLogin = async (event) => {
        var sw = true;
        let allState = this.state;

        Object.keys(this.state).map(
            function (key) {
                if (key == 'redirect') return
                var item = allState[key];
                if (item == '') sw = false;
            });

        if (sw) {
            event.preventDefault();
            SignIn({ ...this.state }, this.props.setLoadingValue).then((result) => {
                this.validarRespuestaSignIn(result)
            })
        } else {
            return
        }
    }

    validarRespuestaSignIn = (result) => {
        if (result == 'SUCCESS') {
            GetUserData().then(result => {
                let fechaExpiracionToken = result.signInUserSession.idToken.payload.exp;
                localStorage.setItem("fechaActual", fechaExpiracionToken);
                this.setState({ redirect: true })
            })
            return;
        }

        switch (result) {
            case 'UserNotConfirmedException':
                this.setState({ username: '', password: '' }, () => { this.props.setModalCodigoConfirmacion(true) })
                break;
            case 'PasswordResetRequiredException':
                //Que hacer en caso de que cognito resetee la contraseña dle usuario y deba cambiarse
                break;
            case 'NotAuthorizedException':
                this.setState({ password: '' }, () => { this.props.setSnackBarState({ open: true, message: 'Usuario o contraseña incorrectos' }) })
                break;
            case 'UserNotFoundException':
                this.setState({ username: '', password: '' }, () => { this.props.setSnackBarState({ open: true, message: 'El ususario no existe' }) })
                break;
            default:

                break;
        }
    }

    render() {
        const { username, password, usernameCodigoVerificacion, redirect } = this.state;
        const { loading } = this.props;
        if (redirect) return <Redirect to={{ pathname: '/home' }} />

        return (
            <div className="body">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card card-signin my-5">
                                <div className="card-body">
                                    <div style={Styles.rootLogo} ><img style={Styles.logo} src={LogoVysor} /></div>
                                    <form className="form-signin mt-3" autoComplete="off">
                                        <div className="form-label-group">
                                            <input type="text" id="username" className="form-control" value={username} placeholder="username" onChange={this.handleChange} required />
                                            <label htmlFor="username">Nombre de usuario</label>
                                        </div>
                                        <div className="form-label-group">
                                            <input type="password" id="password" className="form-control" value={password} placeholder="Contraseña" onChange={this.handleChange} required />
                                            <label htmlFor="password">Contraseña</label>
                                        </div>
                                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleLogin} disabled={loading}>
                                            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            Ingresar
                                        </button>
                                        <hr className="my-2" />
                                        <Link style={{ textDecoration: 'none' }} to={{
                                            pathname: '/recordar_password',
                                        }}>
                                            <div style={{ alignItems: 'center', textAlign: 'center' }}><small className="text-muted">Olvidé mi contraseña</small></div>
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CodigoVerificacionModal username={usernameCodigoVerificacion} />
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
    setLoadingValue: (item) => dispatch(SetLoadingValue(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setSnackBarState: (item) => dispatch(SetSnackBarState(item)),
    setModalCodigoConfirmacion: (item) => dispatch(SetModalCodigoConfirmacion(item)),
    setUserAttributes: (item) => dispatch(SetUserAttributes(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);