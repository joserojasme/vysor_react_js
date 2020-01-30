import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FacturasEnviadasDetalle from './FacturasEnviadasDetalle';
import LabelTitulos from '../../layout/labelTitulos';
import './styles.css';
import { connect } from 'react-redux'
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

class FacturasEnviadas extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.fontFamily}>
                    <Grid container spacing={8}>
                        <Grid item xs={12} >
                            <LabelTitulos tipo='encabezado' texto='Facturas registradas' />
                        </Grid>
                        <Grid item xs={12}>
                            <FacturasEnviadasDetalle />
                        </Grid>
                    </Grid>
                </form>
                <ConfirmacionModal />
            </div>
        )
    }
}

FacturasEnviadas.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FacturasEnviadas));