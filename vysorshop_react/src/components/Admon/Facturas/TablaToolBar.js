import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { SetCamposFiltros } from '../../../reducers/actions/facturasActions';
import ExportExcelIco from '../../../static/images/excel.png';
import CamposFiltros from './CamposFiltros';

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
});

class TablaToolbar extends Component {
    handleClickFiltro = ()=>{
        this.props.setCamposFiltros(true);
    }

     exportTableToExcel = () =>{
         let filename="Facturas_Enviadas";
         let tableID ="detalleFactura";
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        filename = filename?filename+'.xls':'excel_data.xls';

        downloadLink = document.createElement("a");
        
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            downloadLink.download = filename;

            downloadLink.click();
        }
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
                <div className={classes.title}>
                <Tooltip onClick={this.handleClickFiltro} title="Filtro de lista">
                        <IconButton aria-label="Filtro de lista">
                            Filtro<FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                <div onClick={this.exportTableToExcel}><img alt='exportarExcel' src={ExportExcelIco} /></div>
                </div>
            </Toolbar>
            <CamposFiltros />
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
    setCamposFiltros: (item) => dispatch(SetCamposFiltros(item)),
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(toolbarStyles)(TablaToolbar));