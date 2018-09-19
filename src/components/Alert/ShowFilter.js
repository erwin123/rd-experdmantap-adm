import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
let localData = JSON.parse(localStorage.getItem('currentUser'));
class ShowFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BranchCode: "",
            dataBranch: []
        }
    }
    fetchBranch() {
        const url_br = "https://api-experdserve.experd.com/api/trx/branch/";
        axios.get(url_br, { headers: { 'x-access-token': localData.token } })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ dataBranch: response.data });
                }
            })
            .catch(error => {
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data Cabang! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => { });
    }

    componentDidMount() {
        this.setState(state => (state.BranchCode = "00"));
        this.fetchBranch();
    }

    handleChangeBranch(e) {
        const { name, value } = e.target;
        this.setState(state => (state.BranchCode = value));
    }

    onClose(){
        this.props.onSelectBranch(this.state.BranchCode);   
    }
    render() {
        const { classes } = this.props;
        const { dataBranch, BranchCode } = this.state;
        return (
            <div>
                <Dialog open={this.props.showed} TransitionComponent={Transition} keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Filter Report
                    </DialogTitle>
                    <DialogContent>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="Cabang">Cabang</InputLabel>
                            <Select autoWidth value={BranchCode} onChange={(e) => this.handleChangeBranch(e)}
                                name="Cabang" inputProps={{
                                    id: 'Cabang',
                                }} className={classes.selectEmpty}>
                                <MenuItem key="00" value="00">Semua Cabang</MenuItem>
                                {dataBranch.filter(r =>{ return r.BranchCode !== "BR000001" && r.KdBranch > 37}).map(n => {
                                    return (
                                        <MenuItem key={n.BranchCode} value={n.BranchCode}>{n.BranchName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onClose()} color="primary">
                            Download
                     </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
ShowFilter.propTypes = {
    showed: PropTypes.bool,
    onSelectBranch: PropTypes.func.isRequired
};

export default withStyles(styles)(ShowFilter);