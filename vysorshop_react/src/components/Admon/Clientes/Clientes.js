import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ClientesDetalle from './Detalle';
import LabelTitulos from '../../layout/labelTitulos';
import './styles.css';
import { connect } from 'react-redux'
import { SetConfirmacionModalState, SetLoadingValue, SetSpinnerModal } from '../../../reducers/actions/utilsActions';
import ConfirmacionModal from '../../modals/confirmacionModal';

const styles = theme => ({
    root: {
        flexGrow: 2,
        maxWidth: '100%',
    },
    fontFamily: {
        fontFamily: 'Quicksand'
    },
});

class Clientes extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.fontFamily}>
                    <Grid container spacing={8}>
                        <Grid item xs={12} >
                            <LabelTitulos tipo='encabezado' texto='Administrar clientes' />
                        </Grid>
                        <Grid item xs={12}>
                            <ClientesDetalle />
                        </Grid>
                    </Grid>
                </form>
                <ConfirmacionModal />
            </div>
        )
    }
}

Clientes.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
        loading: state.clientesStore.loading,
        userAttributes: state.clientesStore.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLoadingValue: (item) => dispatch(SetLoadingValue(item)),
    setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
    setSpinnerModal: (item) => dispatch(SetSpinnerModal(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Clientes));