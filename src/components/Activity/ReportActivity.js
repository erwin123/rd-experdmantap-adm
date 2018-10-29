import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableActivity from './TableActivity';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import * as join from '../LibJoin/index';
import { withRouter } from 'react-router-dom';
import * as routes from '../constants/routes';
import 'url-search-params-polyfill';

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

const url = "https://api-experdserve.experd.com/api/trx/reportActivity/";
let localData = JSON.parse(localStorage.getItem('currentUser'));

class ReportActivityPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProject: [],
            dataReport: [],
            selectedProject: "",
            showAlert: false,
            alertMessage: "",

        };
    }

    fetchDataReport(projectCode) {
        localData = JSON.parse(localStorage.getItem('currentUser'));
        axios.post(url, { ProjectCode: projectCode }, { headers: { 'x-access-token': localData.token } })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ dataReport: response.data });
                }
            }).catch(error => {
                console.log(error);
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            });
    }

    fetchDataProject() {
        let pjUrl = "https://api-experdserve.experd.com/api/trx/project/";
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(pjUrl, { headers: { 'x-access-token': localData.token } });
    }

    async fetchDataAll() {
        await axios.all([this.fetchDataProject()])
            .then(response => {
                if (response[0].status === 200) {
                    this.setState({ dataProject: response[0].data });
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
    handleChangeProject(e) {
        this.setState({
            ...this.state, selectedProject: e.target.value
        });
        this.fetchDataReport(e.target.value);
        this.props.history.push(routes.ACTIVITY+'?pr='+e.target.value)
    }

    componentDidMount() {
        let qs = new URLSearchParams(this.props.location.search);
        if(qs.get('pr')){
            this.setState({
                ...this.state, selectedProject: qs.get('pr')
            });
            this.fetchDataReport(qs.get('pr'));
        }
        this.fetchDataAll();
    }

    handleClickRow(e, uname) {
        e.preventDefault();
        let rpt = this.state.dataReport.find(c => c.Username === uname);
        
        this.props.history.push(routes.S1 + "?em=" + rpt.EmployeeCode + "&br=" + rpt.BranchCode + "&pr=" + rpt.ProjectCode);
    }

    render() {

        const { classes } = this.props;
        const { dataProject, dataReport, selectedProject } = this.state;
        return (
            <div className={classes.root}>

                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={12} >
                        <FormControl style={{ marginRight: '50px' }} className={classes.formControl}>
                            <InputLabel htmlFor="Project">Project</InputLabel>
                            <Select autoWidth value={selectedProject} onChange={(e) => this.handleChangeProject(e)}
                                name="Project" inputProps={{
                                    id: 'Project',
                                }} className={classes.selectEmpty}>
                                {dataProject.map(n => {
                                    return (
                                        <MenuItem key={n.ProjectCode} value={n.ProjectCode}>{n.ProjectName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <h2>Activity Participant</h2>
                        <TableActivity data={dataReport} handleClickRow={(e, uname) => this.handleClickRow(e, uname)} />
                    </Grid >
                </Grid >
            </div>
        )
    }

}
ReportActivityPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ReportActivityPage));