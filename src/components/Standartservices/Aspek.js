import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Tableaspek from './Tableaspek';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import * as join from '../LibJoin/index';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
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
    aspek: {
        KdAspekFisik: "",
        Description: "",
        ProjectCode: "",
        NWeight: "",
        YWeight: "",
        ParentCode: "",
        FlagCard: "",
        CreatedBy: ""
    },
    aspeks: [],
    project: [],
    showAlert: false,
    showFilter: false,
    alertMessage: "",
    data: [],
    editMode: false
};

const url = "https://api-experdserve.experd.com/api/trx/aspekfisik/";
let localData = JSON.parse(localStorage.getItem('currentUser'));
class AspekPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }

    handleChange(e) {
        const { name, value } = e.target;
        console.log(value);
        this.setState(state => (state.aspek[name] = value));
    }

    handleChangeProject(e) {
        this.setState({
            ...this.state, aspek: {
                ...this.state.aspek,
                ProjectCode: e.target.value
            }
        });
    }

    handleChangeParent(e) {
        this.setState({
            ...this.state, aspek: {
                ...this.state.aspek,
                ParentCode: e.target.value
            }
        });
    }

    createData(id, aspek) {
        return {
            id,
            KdAspekFisik: aspek.KdAspekFisik,
            Description: aspek.Description,
            ProjectCode: aspek.ProjectCode,
            YWeight: aspek.YWeight,
            NWeight: aspek.NWeight,
            ParentCode: aspek.ParentCode,
            FlagCard: aspek.FlagCard
        }
    }

    async fetchAll() {
        await axios.all([this.fetchDataAspek(), this.fetchDataProject()])
            .then(response => {
                if (response[0].status === 200) {
                    //this.setState({ data: response[0].data });

                    for (let i = 0; i < response[0].data.length; i++) {
                        this.setState({
                            data: [...this.state.data, this.createData(i, response[0].data[i])]
                        });
                    }
                }

                if (response[1].status === 200) {
                    this.setState({ project: response[1].data });
                }
            }).catch(error => {
                console.log(error);
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {

            });
    }

    fetchDataProject() {
        let urlprj = "https://api-experdserve.experd.com/api/trx/project";
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(urlprj, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataAspek() {
        this.setState({ data: [] });
        localData = JSON.parse(localStorage.getItem('currentUser'));
        return axios.get(url, { headers: { 'x-access-token': localData.token } });
    }
    componentDidMount() {
        this.fetchAll();
    }

    handleClickSave(e) {
        e.preventDefault();
        let asp = this.state.aspek;
        asp.CreatedBy = localData.username;
        if (asp.ProjectCode && asp.Description) {
            axios.post(url, asp, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Aspek '" + response.data[0].Description + "' berhasil tersimpan" });
                        this.reset();
                        this.fetchAll();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan Aspek!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan Aspek! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickDel(e) {
        e.preventDefault();
        let asp = this.state.aspek;
        if (asp.ProjectCode && asp.Description) {
            axios.delete(url + asp.KdAspekFisik, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Aspek berhasil dihapus" });
                        this.reset();
                        this.fetchAll();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Hapus Aspek!" });
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
        let asp = this.state.aspek;
        if (asp.ProjectCode && asp.Description) {
            axios.put(url + asp.KdAspekFisik, asp, { headers: { 'x-access-token': localData.token } })
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
            ...this.state, aspek: {
                ...this.state.aspek,
                Description: "",
                ProjectCode: "",
                YWeight: "",
                NWeight: "",
                ParentCode: "",
                FlagCard: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let aspek = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, aspek: {
                ...this.state.aspek,
                KdAspekFisik: aspek.KdAspekFisik,
                Description: aspek.Description,
                ProjectCode: aspek.ProjectCode,
                YWeight: aspek.YWeight,
                NWeight: aspek.NWeight,
                ParentCode: aspek.ParentCode,
                FlagCard: aspek.FlagCard
            }
        });
        this.setState({
            editMode: true
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
            link.setAttribute('download', 'aspek.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    showFilterDialog(){
        this.setState({showFilter:true});
    }

    closeFilter(e){
        this.setState({ showFilter: false });
        this.downloadFile(e);
    }

    render() {
        const { classes } = this.props;
        const { Description, ProjectCode, NWeight, KdAspekFisik, YWeight, FlagCard, ParentCode } = this.state.aspek;
        const { data } = this.state;
        const { roleplay } = this.state;
        const { project } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={8} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h2>Aspek Fisik (<a className={classes.linkDL} onClick={() => this.showFilterDialog()}>Export Report</a>)</h2>
                        <form className={classes.container} noValidate autoComplete="off"
                            onSubmit={(e) => this.handleClickSave(e)}>
                            <div className={classes.container}>
                                <TextField disabled label="Kode Aspek <Otomatis>" onChange={(e) => this.handleChange(e)} name="KdAspekFisik"
                                    margin="normal" className={classes.textField} value={KdAspekFisik} />
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
                                <TextField label="Deskripsi Aspek" onChange={(e) => this.handleChange(e)} name="Description"
                                    margin="normal" className={classes.textField} value={Description} />
                                <TextField label="Bobot Ya" onChange={(e) => this.handleChange(e)} name="YWeight"
                                    margin="normal" className={classes.textField} value={YWeight} />
                                <TextField label="Bobot Tidak" onChange={(e) => this.handleChange(e)} name="NWeight"
                                    margin="normal" className={classes.textField} value={NWeight} />

                                <FormControl className={classes.formControl} >
                                    <InputLabel htmlFor="GrupAspek">Grup Aspek (Isikan "-" jika ingin set grup utama)</InputLabel>
                                    <Select value={ParentCode} onChange={(e) => this.handleChangeParent(e)}
                                        name="ParentCode" inputProps={{
                                            id: 'ParentCode',
                                        }} className={classes.selectEmpty}>
                                        <MenuItem value={"-"}>-</MenuItem>
                                        {data.filter(i => { return i.ParentCode === "-" })
                                            .map(n => {
                                                return (
                                                    <MenuItem key={n.KdAspekFisik} value={n.KdAspekFisik}>{n.Description}</MenuItem>
                                                )
                                            })}
                                    </Select>
                                </FormControl>

                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel>Tipe Aspek</FormLabel>
                                    <RadioGroup
                                        aria-label="FlagCard"
                                        name="FlagCard"
                                        className={classes.group}
                                        value={FlagCard.toString()}
                                        onChange={(e) => this.handleChange(e)}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Aspek Fisik" />
                                        <FormControlLabel value="2" control={<Radio />} label="Aspek Lainnya" />
                                        
                                    </RadioGroup>
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
                        <Tableaspek data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
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
AspekPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AspekPage);