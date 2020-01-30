import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import {connect} from 'react-redux';
import {SetConfirmacionModalState} from '../../reducers/actions/utilsActions';

const tituloModal = 'VysorShop';

const styles = {
    fontBody:{
    color: 'black',
    },
    fontButtons:{
        fontWeight:'bold'
    }
}

class ResponsiveDialog extends React.Component {
  handleClose = () => {
    this.props.dispatch(SetConfirmacionModalState({open:false}));
  };

  render() {
    const { open } = this.props;
    return (
      <div>
        <Dialog
          open={open.open}
          onClose={open.cancelarVisible == true ? open.onClick : this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{tituloModal}</DialogTitle>
          <DialogContent>
            <DialogContentText style={styles.fontBody}>
              {open.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={open.onClick} style={styles.fontButtons} color={"primary"} autoFocus>
              Aceptar
            </Button>
            <div style={open.cancelarVisible == true ? {display:'none'} : null}>
            <Button  onClick={this.handleClose} style={styles.fontButtons} color="primary" >
              Cancelar
            </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props){
    return{
        open: state.utilsStore.modal
    }
}
export default connect(mapStateToProps)(withMobileDialog()(ResponsiveDialog));
