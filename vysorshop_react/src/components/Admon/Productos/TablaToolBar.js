import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Crear from './Crear';
import Actualizar from './Actualizar';
import {connect} from 'react-redux';
import { SetModalAddCamposProductos } from '../../../reducers/actions/productosActions';

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    buttonAdd: {
        backgroundColor: '#92C63E',
        color: theme.palette.common.white,
      }
});

class TablaToolbar extends Component {
    handleClickFiltro = ()=>{
        //this.props.setOpenModalFiltroFactura(true);
    }

    handleClickAdd = () =>{
        this.props.setModalAddCamposProductos(true);
    }
    render() {
        const { numSelected, classes } = this.props;
        return (
            <Fragment>
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.title} />
                <div className={classes.actions}>
                <Button className={classes.buttonAdd} onClick={this.handleClickAdd} aria-label="Agregar"><Add />Agregar</Button>
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    <Tooltip onClick={this.handleClickFiltro} title="Filtro de lista">
                        <IconButton aria-label="Filtro de lista">
                            Filtrar<FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
            <Crear />
            <Actualizar/>
            </Fragment>
        )
    }
}

TablaToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

function mapStateToProps(state, props) {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    setModalAddCamposProductos: (item) => dispatch(SetModalAddCamposProductos(item)),
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(toolbarStyles)(TablaToolbar));