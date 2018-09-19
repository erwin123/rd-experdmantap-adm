import React, { Component } from 'react';
import Tablestaytune from '../StayTune/Tablestaytune';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as join from '../LibJoin/index';
import axios from 'axios';
import AlertDialogSlide from '../Alert/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dodont from './Dodont';


const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: "20px;"
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    container: {
        flexWrap: 'wrap',
        display: "block"
    },
    textField: {
        width: "100%;"
    },
    button: {
        marginTop: "20px",
        width: "100%;"
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        marginTop: '20px',
        minWidth: 120,
        width: 400
    },
});
const url = "https://api-experdserve.experd.com/api/trx/project_employee/";
let localData = JSON.parse(localStorage.getItem('currentUser'));

const initialState = {
    projpar: {
        Project_ProjectCode: "",
        Employee_EmployeeCode: "",
        EmployeeBranchName: "",
        EmployeeBranch: ""
    },
    projpars: [],
    showAlert: false,
    alertMessage: "",
    data: [],
    editMode: false,
    dataProject: [],
    dataEmployee: [],
    showdialog: false
};
class S3 extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    createData(id, propar) {
        return {
            id,
            ProjectName: propar.ProjectName,
            Project_ProjectCode: propar.ProjectCode,
            Employee_EmployeeCode: propar.EmployeeCode,
            EmployeeName: propar.EmployeeName,
            EmployeeNPK: propar.EmployeeNPK,
            EmployeeBranch: propar.BranchCode,
            EmployeeBranchName: propar.BranchName
        };
    }

    async fetchDataAll() {
        this.setState({ data: [] });
        await axios.all([this.fetchDataProject(), this.fetchDataEmployee(), this.fetchDataProjectEmployee(), this.fetchDataBranch()])
            .then(response => {

                if (response[3].status === 200) {
                    this.setState({ dataBranch: response[3].data });
                }

                if (response[0].status === 200) {
                    this.setState({ dataProject: response[0].data });
                }

                if (response[1].status === 200) {
                    this.setState({ dataEmployee: response[1].data.filter(i => i.RolePlay === 'RL001') });
                }

                if (response[2].status === 200) {
                    const result =
                        join.join(
                            join.join(
                                response[1].data.filter(i => i.RolePlay === 'RL001'),
                                join.join(response[0].data,
                                    response[2].data,
                                    { key: 'ProjectCode' }
                                ),
                                { key: 'EmployeeCode' }),
                            response[3].data,
                            { key: 'BranchCode' }
                        );
                    for (let i = 0; i < result.length; i++) {
                        this.setState({
                            data: [...this.state.data, this.createData(i, result[i])]
                        });

                    }
                }


            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {

            });
    }

    fetchDataProject() {
        let urlProj = "https://api-experdserve.experd.com/api/trx/project/";
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlProj, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataEmployee() {
        let urlEmp = "https://api-experdserve.experd.com/api/trx/employee/";
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlEmp, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataBranch() {
        let urlBr = "https://api-experdserve.experd.com/api/trx/branch/";
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlBr, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataProjectEmployee() {
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(url, { headers: { 'x-access-token': localData.token } });
    }

    componentDidMount() {
        this.fetchDataAll();
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let projpar = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, projpar: {
                ...this.state.projpar,
                Project_ProjectCode: projpar.Project_ProjectCode,
                Employee_EmployeeCode: projpar.Employee_EmployeeCode,
                EmployeeBranchName: projpar.EmployeeBranchName,
                EmployeeBranch: projpar.EmployeeBranch
            }
        });
        this.setState({ showdialog: true });
    }

    handleCloseDialog(close) {
        this.setState({ showdialog: false });
    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;
        return (
            <div className={classes.root}>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={7} lg={7} >
                        <h2>Do's N Dont's</h2>
                        <Tablestaytune data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
                <GetHeardDialog showdialog={this.state.showdialog} closeIt={(close) => this.handleCloseDialog(close)}
                    BranchCode={this.state.projpar.EmployeeBranch} BranchName={this.state.projpar.EmployeeBranchName}
                    ProjectCode={this.state.projpar.Project_ProjectCode} />
            </div >)
    }
}


class GetHeardDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedback: "",
            message: "",
            lock: false
        }
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state[name] = value));
    }

    handleSubmit(ask) {
        if (ask === 1) {
            this.setState({ lock: true });
            const url = "https://api-experdserve.experd.com/api/trx/stlast/";
            let localData = JSON.parse(localStorage.getItem('currentUser'));
            let staytune = {
                BranchCode: this.props.BranchCode,
                ProjectCode: this.props.ProjectCode,
                BranchFeedback: this.state.feedback,
                CreatedBy: localData.username,
                IsGetHeard: 1 // staytune flag
            }

            axios.post(url, staytune, { headers: { 'x-access-token': localData.token } }).then(response => {
                if (response.status === 200) {
                    this.setState({ message: "Feedback Anda sudah dikirimkan" });
                    setTimeout(() => {
                        this.setState({ lock: false });
                        this.setState({ feedback: "" });
                        this.props.closeIt(true);
                    }, 2000);

                }
            }).catch(error => {
                this.props.closeIt(false);
                this.setState({ lock: false });
            });
        }else
        {
            this.props.closeIt(true);
        }
    }

    render() {
        const { fullScreen } = this.props;
        return (
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.props.showdialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    
                >
                    <DialogTitle id="alert-dialog-title">{this.props.BranchName}</DialogTitle>
                    <DialogContent>
                        <div style={{width:"500px"}}>
                            <Dodont BranchCode={this.props.BranchCode} ProjectCode={this.props.ProjectCode}/>
                        </div>
                        
                        <DialogContentText id="alert-dialog-description" style={{ marginLeft:"23px" }}>
                            Feedback<br />
                            <textarea style={{ width: "450px"}} disabled={this.state.lock} onChange={(e) => this.handleChange(e)}
                            name="feedback"  value={this.state.feedback}></textarea>
                            <br /><span style={{ fontSize: "14px" }}>{this.state.message}</span>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={this.state.lock} onClick={() => this.handleSubmit(1)} color="primary">
                            SIMPAN
                        </Button>
                        <Button disabled={this.state.lock} onClick={() => this.handleSubmit(0)} color="primary" autoFocus>
                            BATAL
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(S3);