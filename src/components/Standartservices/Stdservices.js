import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Tablestdservice from './Tablestdservice';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import * as join from '../LibJoin/index';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import ShowFilter from '../Alert/ShowFilter';

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
        width: '100%'
    },
    linkDL:{
        cursor: 'pointer',
        color:"blue",
        fontSize:"16px !important",
        fontWeight:"normal"
    }
});

const theme = createMuiTheme({
    palette: {
        primary: teal,
    },
});

const initialState = {
    stdservice: {
        KdStdservice: "",
        StdServiceDesc: "",
        ProjectCode: "",
        Roleplay: "",
        Username: ""
    },
    stdservices: [],
    roleplay: [],
    project: [],
    showAlert: false,
    showFilter: false,
    alertMessage: "",
    data: [],
    editMode: false
};

const url = "https://api-experdserve.experd.com/api/trx/stdservice/";
let localData = JSON.parse(localStorage.getItem('currentUser'));
class StandartServicePage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state.stdservice[name] = value));
    }

    handleChangeProject(e) {
        this.setState({
            ...this.state, stdservice: {
                ...this.state.stdservice,
                ProjectCode: e.target.value
            }
        });

        this.fetchDataRoleActive(e.target.value);
    }

    handleChangeRole(e) {
        this.setState({
            ...this.state, stdservice: {
                ...this.state.stdservice,
                Roleplay: e.target.value
            }
        });
    }

    createData(id, stdservice) {
        return {
            id,
            KdStdservice: stdservice.KdStdservice,
            StdServiceDesc: stdservice.StdServiceDesc,
            ProjectCode: stdservice.ProjectCode,
            Roleplay: stdservice.Roleplay,
            Roledesc: stdservice.RoleplayDesc
        }
    }

    async fetchAll() {
        await axios.all([this.fetchDataRole(), this.fetchDataStd(), this.fetchDataProject()])
            .then(response => {
                if (response[0].status === 200) {
                    this.setState({ roleplay: response[0].data });
                }

                if (response[1].status === 200) {
                    const result =
                        join.join(
                            response[0].data,
                            response[1].data,
                            { key1: 'KdRoleplay', key2: 'Roleplay' }
                        );
                    for (let i = 0; i < result.length; i++) {
                        this.setState({
                            data: [...this.state.data, this.createData(i, result[i])]
                        });
                    }
                }

                if (response[2].status === 200) {
                    this.setState({ project: response[2].data });
                }
            }).catch(error => {
                console.log(error);
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {

            });
    }

    fetchDataRoleActive(ProjectCode) {
        let urlrole = "https://api-experdserve.experd.com/api/trx/project_roleplay_active?prj=" + ProjectCode;
        let localData = JSON.parse(localStorage.getItem('currentUser'));

        axios.get(urlrole, { headers: { 'x-access-token': localData.token } }).then(response => {
            if (response.status === 200) {
                this.setState({ roleplay: response.data });
            }
        })
    }

    fetchDataRole() {
        let urlrole = "https://api-experdserve.experd.com/api/trx/roleplay";
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlrole, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataProject() {
        let urlprj = "https://api-experdserve.experd.com/api/trx/project";
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlprj, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataStd() {
        this.setState({ data: [] });
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(url, { headers: { 'x-access-token': localData.token } });
    }
    componentDidMount() {
        this.fetchAll();
    }

    handleClickSave(e) {
        e.preventDefault();
        let std = this.state.stdservice;
        std.Username = localData.username;
        if (std.Roleplay && std.StdServiceDesc) {
            axios.post(url, std, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "SOP '" + response.data[0].StdServiceDesc + "' berhasil tersimpan" });
                        this.reset();
                        this.fetchAll();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan SOP!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan SOP! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickDel(e) {
        e.preventDefault();
        let std = this.state.stdservice;
        std.Username = localData.username;
        if (std.Roleplay && std.StdServiceDesc) {
            axios.delete(url + std.KdStdservice, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "SOP berhasil dihapus" });
                        this.reset();
                        this.fetchAll();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan SOP!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan SOP! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickUpdate(e) {
        e.preventDefault();
        let std = this.state.stdservice;
        if (std.Roleplay && std.StdServiceDesc) {
            axios.put(url + std.KdStdservice, std, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "SOP berhasil diubah" });
                        this.reset();
                        this.fetchAll();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Ubah SOP!" });
                    return false;
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Ubah SOP! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    reset() {
        this.setState({
            ...this.state, stdservice: {
                ...this.state.stdservice,
                StdServiceDesc: "",
                ProjectCode: "",
                Roleplay: "",
                KdStdservice: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    downloadFile(branch) {
        let param = {};
        if(branch !== "00")
        {
            param = { BranchCode : branch}
        }
        axios.post('https://api-experdserve.experd.com/api/trx/reportStdService',param, {
            responseType: 'blob',
            headers: { 'x-access-token': localData.token }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stdservice.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    showFilterDialog(){
        this.setState({showFilter:true});
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let std = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, stdservice: {
                ...this.state.stdservice,
                StdServiceDesc: std.StdServiceDesc,
                ProjectCode: std.ProjectCode,
                Roleplay: std.Roleplay,
                KdStdservice: std.KdStdservice
            }
        });
        this.setState({
            editMode: true
        });
    }

    closeFilter(e){
        this.setState({ showFilter: false });
        this.downloadFile(e);
    }


    render() {
        const { classes } = this.props;
        const { StdServiceDesc, ProjectCode, Roleplay, KdStdservice } = this.state.stdservice;
        const { data } = this.state;
        const { roleplay } = this.state;
        const { project } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={8} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h2>Standart Service (<a className={classes.linkDL} onClick={() => this.showFilterDialog()}>Export Report</a>)</h2>
                        <form className={classes.container} noValidate autoComplete="off"
                            onSubmit={(e) => this.handleClickSave(e)}>
                            <div className={classes.container}>

                                <TextField disabled label="Kode SOP <Otomatis>" onChange={(e) => this.handleChange(e)} name="KdStdservice"
                                    margin="normal" className={classes.textField} value={KdStdservice} />
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="Project">Project</InputLabel>
                                    <Select value={ProjectCode} onChange={(e) => this.handleChangeProject(e)}
                                        name="Project" inputProps={{
                                            id: 'Project',
                                        }} className={classes.selectEmpty}>
                                        {project.map(n => {
                                            return (
                                                <MenuItem key={n.ProjectCode} value={n.ProjectCode}>{n.ProjectName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <TextField label="Deskripsi SOP" onChange={(e) => this.handleChange(e)} name="StdServiceDesc"
                                    margin="normal" className={classes.textField} value={StdServiceDesc} />


                                <FormControl className={classes.formControl} >
                                    <InputLabel htmlFor="Posisi">Posisi</InputLabel>
                                    <Select value={Roleplay} onChange={(e) => this.handleChangeRole(e)}
                                        name="Posisi" inputProps={{
                                            id: 'Posisi',
                                        }} className={classes.selectEmpty}>
                                        {roleplay.map(n => {
                                            return (
                                                <MenuItem key={n.KdRoleplay} value={n.KdRoleplay}>{n.RoleplayName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>

                                {!this.state.editMode &&
                                    <Button variant="contained" size="medium" color="primary"
                                        className={classes.button} onClick={(e) => this.handleClickSave(e)}>
                                        TAMBAH &nbsp;
                                        <Icon className={classes.rightIcon}>add</Icon>
                                    </Button>
                                }
                                {this.state.editMode &&
                                    <div>
                                        <MuiThemeProvider theme={theme}>
                                            <Button variant="outlined" size="medium" color="primary"
                                                className={classes.button} onClick={(e) => this.handleClickUpdate(e)}>
                                                UBAH  &nbsp;
                                        <Icon className={classes.rightIcon}>create</Icon>
                                            </Button>
                                        </MuiThemeProvider>
                                        <Button variant="outlined" size="medium" color="primary"
                                            className={classes.button} onClick={() => this.reset()}>
                                            BATAL &nbsp;
                                        <Icon className={classes.rightIcon}>block</Icon>
                                        </Button>
                                        <Button variant="contained" size="medium" color="secondary"
                                            className={classes.button} onClick={(e) => this.handleClickDel(e)}>
                                            HAPUS &nbsp;
                                        <Icon className={classes.rightIcon}>delete</Icon>
                                        </Button>
                                    </div>}

                            </div>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7} lg={7} >
                        <Tablestdservice data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
                <ShowFilter showed={this.state.showFilter} onSelectBranch={(e) => this.closeFilter(e)}>
                </ShowFilter>
            </div >
        )
    }

}



StandartServicePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StandartServicePage);