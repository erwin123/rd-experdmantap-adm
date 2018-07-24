import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends Component {
   
    render() {
        return (
            <div>
                <Dialog open={this.props.showed} TransitionComponent={Transition} keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                            Ok
                     </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
AlertDialogSlide.propTypes = {
    showed: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};
export default AlertDialogSlide;