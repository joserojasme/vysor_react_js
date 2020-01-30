import React, { Component } from 'react';
import LogoVysorshop from '../../static/images/logoVysorshop.png';
import './styles.css';
import { SetLoadingValue, SetSnackBarState, SetConfirmacionModalState } from '../../reducers/actions/utilsActions';
import { connect } from 'react-redux';
import { ChangePassword } from './auth/amplifyAuth';
import SnackBarMensajes from '../modals/snackBarMensajes';
import ConfirmacionModal from '../modals/confirmacionModal';

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

class CambiarPassword extends Component {
    state = {
        newPassword: '',
        oldPassword: '',
    }

    handleClick = () => {
        this.props.setConfirmacionModalState({ 'open': false });
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({
            [event.target.id]: value
        })
    }

    handleCambiarPassword = async (event) => {
        var sw = true;
        let allState = this.state;

        Object.keys(this.state).map(
            function (key) {
                    var item = allState[key];
                    if (item == '') sw = false;
            });

        if (sw) {
            const { oldPassword,  newPassword, } = this.state;
            event.preventDefault();
            ChangePassword(oldPassword, newPassword, this.props.setLoadingValue).then(result => { this.validarRespuestaCambioPassword(result) })
        } else {
            return
        }
    }

    validarRespuestaCambioPassword = (result) => {
        if (result.code == undefined) {
            this.props.setSnackBarState({ open: true, message: 'Cambio realizado correctamente' })
            this.setState({ oldPassword: '', newPassword:'' })
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
                    mensaje = 'Lo sentimos, la nueva contraseña no es correcta. Debe tener una lóngitud mínina de 8 carácteres y contener letras minúsculas, mayúsculas y al menos un número';
                    break;
                case 'InvalidPasswordException':
                    mensaje = 'Lo sentimos, la nueva contraseña no es correcta. Debe tener una lóngitud mínina de 8 carácteres y contener letras minúsculas, mayúsculas y al menos un número';
                    break;
                    case 'NotAuthorizedException':
                    mensaje = 'La contraseña actual no es correcta';
                    break;
                default:
                    mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
                    break;
            }
            this.setState({ newPassword: '', oldPassword:'' }, () => {
                let modal = { open: true, text: mensaje,onClick:this.handleClick }
                this.props.setConfirmacionModalState(modal);
            })

        }
    }

    render() {
        const { oldPassword, newPassword, } = this.state;
        const { loading } = this.props;

        return (
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
                                            <input type="password" id="oldPassword" className="form-control" value={oldPassword} placeholder="Contraseña actual" onChange={this.handleChange} required />
                                            <label htmlFor="oldPassword">Contraseña actual</label>
                                        </div>
                                        <div className="form-label-group">
                                            <input type="password" id="newPassword" className="form-control" value={newPassword} placeholder="Nueva contraseña" onChange={this.handleChange} required />
                                            <label htmlFor="newPassword">Nueva contraseña</label>
                                            <small className="text-muted">Debe tener: 8 o más carácteres, minúsculas, mayúsculas y números</small>
                                        </div>

                                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleCambiarPassword} disabled={loading}>
                                            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            Cambiar contraseña
                                        </button>
                                        <hr className="my-2" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmacionModal  />
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
    setSnackBarState : (item)=>dispatch(SetSnackBarState(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(CambiarPassword);

const message = "Por favor ingrese su contraseña actual y la nueva contraseña";
