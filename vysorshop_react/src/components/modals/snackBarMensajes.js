import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';
import { SetSnackBarState } from '../../reducers/actions/utilsActions'

class snackBarMensajes extends React.Component {
    state = {

    }
    handleClose = () => {
        this.props.dispatch(SetSnackBarState({ open: false }));
    };

    render() {
        const { snackbar } = this.props;
        return (
            <div>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    style={{zIndex:11000}}
                    message={<span id="message-id">{snackbar.message}</span>}
                />
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        snackbar: state.utilsStore.snackbar
    }
}

export default connect(mapStateToProps)(snackBarMensajes);