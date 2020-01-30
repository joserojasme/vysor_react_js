import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { connect } from 'react-redux';
import { SetModalCodigoConfirmacion, SetSnackBarState,SetLoadingValue } from '../../reducers/actions/utilsActions';
import { ConfirmSignUp, ResendUserCodeSignUp } from './auth/amplifyAuth';
import { Redirect } from 'react-router';
import SnackBarMensajes from '../modals/snackBarMensajes';

const tituloModal = 'Bienvenido a Vysorshop';

const styles = {
    fontBody: {
        fontWeight: 'bold',
        color: 'black',
    }
}

class CodigoVerificacion extends React.Component {
    state = {
        codigoConfirmacion: '',
        username: '',
        redirect: false,
    }

    handleClose = () => {
        this.props.setModalCodigoConfirmacion(false);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleClickReenviarCodigo = () => {
        this.setState({ username: this.props.username }, () => {
            ResendUserCodeSignUp(this.state.username).then(() => {
                this.props.setSnackBarState({ open: true, message: 'código enviado al E-mail' })
            });
        })

    }

    handleClickTerminarRegistro = () => {
        if(this.state.codigoConfirmacion == ''){
            this.props.setSnackBarState({ open: true, message: 'Ingrese el código de verificación' })
            return;
        }

        this.setState({ username: this.props.username }, () => {
            ConfirmSignUp(this.state.username, this.state.codigoConfirmacion, this.props.setLoadingValue).then(result => {
                if (result == 'SUCCESS') {
                    this.props.setSnackBarState({ open: true, message: 'La cuenta se activó. Inicie sesión' })
                    this.setState({ redirect: true })
                } else {
                    if (result.code == 'CodeMismatchException') {
                        this.setState({ codigoConfirmacion: '' }, () => {
                            this.props.setSnackBarState({ open: true, message: 'código incorrecto' })
                        })
                    }

                    if (result.code == 'NotAuthorizedException') {
                        this.setState({ redirect: true })
                    }
                }
            })
        })
    }

    render() {
        const { open,loading } = this.props;
        const { codigoConfirmacion, redirect } = this.state;
        if (redirect) return <Redirect to={{pathname: '/',state: { username: this.state.username }}} />
    
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{tituloModal}</DialogTitle>

                    <DialogContent>
                        <DialogContentText style={styles.fontBody}>
                            Hemos enviado el código de verificación a su correo electrónico. Por favor ingrese el código para activar su nueva cuenta.
              <small className="text-muted"> ¡No olvides revisar la bandeja de correos no deseados!</small>
                        </DialogContentText>
                        <div className="form-label-group">
                            <input type="text" id="codigoConfirmacion" value={codigoConfirmacion} className="form-control" placeholder="código de confirmación" onChange={this.handleChange} />
                            <label for="codigoConfirmacion">Ingresar código</label>
                            <small onClick={this.handleClickReenviarCodigo} className="text-muted">Reenviar código a mi E-mail</small>
                        </div>

                    </DialogContent>
                    <DialogActions>
                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleClickTerminarRegistro} disabled={loading}>
                                            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            VALIDAR CÓDIGO</button>
                    </DialogActions>
                </Dialog>
                <SnackBarMensajes />
            </div>
        );
    }
}

CodigoVerificacion.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props) {
    return {
        open: state.utilsStore.openModalCodigoVerificacion,
        loading: state.utilsStore.loading
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLoadingValue : (item)=>dispatch(SetLoadingValue(item)),
    setModalCodigoConfirmacion : (item) =>dispatch(SetModalCodigoConfirmacion(item)),
    setSnackBarState : (item)=>dispatch(SetSnackBarState(item))
})

export default connect(mapStateToProps,mapDispatchToProps)(withMobileDialog()(CodigoVerificacion));
