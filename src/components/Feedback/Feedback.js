import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableProjParticipant from '../Project/TableProjParticipant';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import * as join from '../LibJoin/index';
import { withRouter } from 'react-router-dom';
import * as routes from '../constants/routes';

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

const theme = createMuiTheme({
    palette: {
        primary: teal,
    },
});

const initialState = {
    projpar: {
        Project_ProjectCode: "",
        Employee_EmployeeCode: "",
    },
    projpars: [],
    showAlert: false,
    alertMessage: "",
    data: [],
    editMode: false,
    dataProject: [],
    dataEmployee: []
};

const url = "https://api-experdserve.experd.com/api/trx/project_employee/";
let localData = JSON.parse(localStorage.getItem('currentUser'));

class FeedbackPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }


    createData(id, propar) {
        return {
            id,
            ProjectName: propar.ProjectName,
            Project_ProjectCode: propar.ProjectCode,
            Employee_EmployeeCode: propar.EmployeeCode,
            EmployeeName: propar.EmployeeName,
            EmployeeNPK: propar.EmployeeNPK,
            EmployeeBranch: propar.BranchCode
        };
    }

    async fetchDataAll() {
        this.setState({ data: [] });
        await axios.all([this.fetchDataProject(), this.fetchDataEmployee(), this.fetchDataProjectEmployee()])
            .then(response => {
                if (response[0].status === 200) {
                    this.setState({ dataProject: response[0].data });
                }

                if (response[1].status === 200) {
                    this.setState({ dataEmployee: response[1].data.filter(i => i.RolePlay === 'RL001') });
                }
                if (response[2].status === 200) {
                    const result = join.join(response[1].data,
                        join.join(response[0].data, response[2].data,
                            { key: 'ProjectCode' }), { key: 'EmployeeCode' });
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

    fetchDataProjectEmployee() {
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(url, { headers: { 'x-access-token': localData.token } });
    }

    componentDidMount() {
        this.fetchDataAll();
    }

    reset() {
        this.setState({
            ...this.state, projpar: {
                ...this.state.projpar,
                Project_ProjectCode: "",
                Employee_EmployeeCode: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let projpar = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, projpar: {
                ...this.state.projpar,
                Project_ProjectCode: projpar.Project_ProjectCode,
                Employee_EmployeeCode: projpar.Employee_EmployeeCode
            }
        });
        this.props.history.push(routes.S1+"?em="+projpar.Employee_EmployeeCode+"&br="+projpar.EmployeeBranch+"&pr="+projpar.Project_ProjectCode);
        //this.props.history.push(routes.STEPBOARD+"?em="+projpar.Employee_EmployeeCode+"&pr="+projpar.Project_ProjectCode);
    }


    render() {
        const { classes } = this.props;
        const { Project_ProjectCode, Employee_EmployeeCode, ProjectName, EmployeeName, EmployeeNPK } = this.state.projpar;
        const { data, dataProject, dataEmployee } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={7} lg={7} >
                        <h2>Feedback Participant</h2>
                        <TableProjParticipant data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
            </div >
        )
    }

}
FeedbackPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FeedbackPage));