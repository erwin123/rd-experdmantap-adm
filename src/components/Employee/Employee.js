import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableEmployee from './TableEmployee';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

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
        marginTop:'20px',
        minWidth: 120,
        width:200
      },
});

const theme = createMuiTheme({
    palette: {
        primary: teal,
    },
});

const initialState = {
    employee: {
        EmployeeCode: "",
        EmployeeName: "",
        EmployeeNPK: "",
        BranchCode: "",
        Username: "",
        RolePlay: ""
    },
    employeees: [],
    showAlert: false,
    alertMessage: "",
    data: [],
    editMode: false,
    dataBranch: [],
    dataRole: [],
};

const url = "https://api-experdserve.experd.com/api/trx/employee/";
let localData = JSON.parse(localStorage.getItem('currentUser'));

class EmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state.employee[name] = value));
    }

    createData(id, employee) {
        return {
            id,
            EmployeeCode: employee.EmployeeCode,
            EmployeeName: employee.EmployeeName,
            EmployeeNPK: employee.EmployeeNPK,
            BranchCode: employee.BranchCode,
            Username: employee.Username,
            RolePlay: employee.RolePlay,
        };
    }

    fetchData() {
        this.setState({ data: [] });
        localData = JSON.parse(localStorage.getItem('currentUser'));
        axios.get(url, { headers: { 'x-access-token': localData.token } })
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({
                            data: [...this.state.data, this.createData(i, response.data[i])]
                        });
                    }
                }
            })
            .catch(error => {
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {
            });
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
            }).then(() => {
            });
    }

    fetchRole() {
        const url_rl = "https://api-experdserve.experd.com/api/trx/roleplay/";
        axios.get(url_rl, { headers: { 'x-access-token': localData.token } })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ dataRole: response.data });
                }
            })
            .catch(error => {
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data Role! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {
            });
    }

    componentDidMount() {
        this.fetchData();
        this.fetchBranch();
        this.fetchRole();
    }

    handleClickSave(e) {
        e.preventDefault();
        let em = this.state.employee;
        if (em.EmployeeName && em.EmployeeNPK && em.BranchCode && em.RolePlay) {
            axios.post(url, em, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Karyawan '" + response.data[0].EmployeeName + "' berhasil tersimpan" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan Karyawan!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan Karyawan! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickUpdate(e) {
        e.preventDefault();
        let em = this.state.employee;
        if (em.EmployeeName && em.EmployeeNPK && em.BranchCode && em.RolePlay) {
            axios.put(url + em.EmployeeCode, em, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Karyawan berhasil diubah" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Ubah Karyawan!" });
                    return false;
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Ubah Karyawan! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    reset() {
        this.setState({
            ...this.state, employee: {
                ...this.state.employee,
                EmployeeCode: "",
                EmployeeNPK: "",
                EmployeeName: "",
                BranchCode: "",
                Username: "",
                RolePlay: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let employee = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, employee: {
                ...this.state.employee,
                EmployeeCode: employee.EmployeeCode,
                EmployeeNPK: employee.EmployeeNPK,
                EmployeeName: employee.EmployeeName,
                BranchCode: employee.BranchCode,
                Username: employee.Username,
                RolePlay: employee.RolePlay
            }
        });
        this.setState({
            editMode: true
        });
    }

    handleChangeBranch(e) {
        this.setState({
            ...this.state, employee: {
                ...this.state.employee,
                BranchCode: e.target.value
            }
        });
        
    }

    handleChangeRole(e) {
        this.setState({
            ...this.state, employee: {
                ...this.state.employee,
                RolePlay: e.target.value
            }
        });
        setTimeout(() => {
            console.log(this.state.employee.RolePlay);
        }, 100);
    }

    render() {
        const { classes } = this.props;
        const { EmployeeCode, EmployeeName, EmployeeNPK, BranchCode, Username, RolePlay } = this.state.employee;
        const { data, dataBranch, dataRole } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h2>Participant / Karyawan</h2>
                        <form className={classes.container} noValidate autoComplete="off"
                            onSubmit={(e) => this.handleClickSave(e)}>
                            <div className={classes.container}>
                                <TextField disabled label="Kode Karyawan <Otomatis>" onChange={(e) => this.handleChange(e)} name="EmployeeCode"
                                    margin="normal" className={classes.textField} value={EmployeeCode} />
                                <TextField label="Nama" onChange={(e) => this.handleChange(e)} name="EmployeeName"
                                    margin="normal" className={classes.textField} value={EmployeeName} />
                                <TextField label="Nomor Induk" onChange={(e) => this.handleChange(e)} name="EmployeeNPK"
                                    margin="normal" className={classes.textField} value={EmployeeNPK} />
                                    {!this.state.editMode &&
                                <TextField label="Username" onChange={(e) => this.handleChange(e)} name="Username"
                                    margin="normal" className={classes.textField} value={Username} />}
                                <FormControl style={{marginRight:'50px'}} className={classes.formControl}>
                                <InputLabel htmlFor="Cabang">Cabang</InputLabel>
                                <Select autoWidth value={BranchCode} onChange={(e) => this.handleChangeBranch(e)}
                                    name="Cabang" inputProps={{
                                        id: 'Cabang',
                                    }} className={classes.selectEmpty}>
                                    {dataBranch.map(n => {
                                        return (
                                            <MenuItem key={n.BranchCode} value={n.BranchCode}>{n.BranchName}</MenuItem>
                                        )
                                    })}
                                </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="Posisi">Posisi</InputLabel>
                                <Select autoWidth value={RolePlay} onChange={(e) => this.handleChangeRole(e)}
                                    name="Posisi" inputProps={{
                                        id: 'Posisi',
                                    }} className={classes.selectEmpty}>
                                    {dataRole.map(n => {
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
                                            className={classes.button} onClick={(e) => this.handleClickSave(e)}>
                                            HAPUS &nbsp;
                                        <Icon className={classes.rightIcon}>delete</Icon>
                                        </Button>
                                    </div>}

                            </div>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7} lg={7} >
                        <TableEmployee data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
            </div >
        )
    }

}
EmployeePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeePage);