import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles,MuiThemeProvider,createMuiTheme  } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableRoleplay from './TableRoleplay';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';

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
    }
});

const theme = createMuiTheme({
    palette: {
      primary: teal,
    },
  });

const initialState = {
    roleplay: {
        KdRoleplay: "",
        RoleplayName: "",
        RoleplayDesc: ""
    },
    roleplayes: [],
    showAlert: false,
    alertMessage: "",
    data: [],
    editMode: false
};

const url = "https://api-experdserve.experd.com/api/trx/roleplay/";
const localData = JSON.parse(localStorage.getItem('currentUser'));

class RoleplayPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state.roleplay[name] = value));
    }

    createData(id, roleplay) {
        return { id,
            KdRoleplay:roleplay.KdRoleplay,
            RoleplayName:roleplay.RoleplayName,
            RoleplayDesc:roleplay.RoleplayDesc};
      }

    fetchData(){
        this.setState({data: []});
        axios.get(url, { headers: { 'x-access-token': localData.token } })
        .then(response => {
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    this.setState({
                        data: [...this.state.data, this.createData(i,response.data[i])]
                    });
                }
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
    }

    handleClickSave(e) {
        e.preventDefault();
        let rl = this.state.roleplay;
        if (rl.RoleplayName && rl.RoleplayDesc) {
            axios.post(url, rl, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Role '" + response.data[0].RoleplayName + "' berhasil tersimpan" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan Role!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan Role! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickUpdate(e) {
        e.preventDefault();
        let rl = this.state.roleplay;
        if (rl.RoleplayName && rl.RoleplayDesc) {
            axios.put(url+rl.KdRoleplay, rl, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Role berhasil diubah" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Ubah Role!" });
                    return false;
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Ubah Role! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    reset() {
        this.setState({
            ...this.state, roleplay: {
                ...this.state.roleplay,
                KdRoleplay: "",
                RoleplayDesc: "",
                RoleplayName: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let roleplay = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, roleplay: {
                ...this.state.roleplay,
                KdRoleplay: roleplay.KdRoleplay,
                RoleplayDesc: roleplay.RoleplayDesc,
                RoleplayName: roleplay.RoleplayName
            }
        });
        this.setState({
            editMode: true
        });
    }

    render() {
        const { classes } = this.props;
        const { KdRoleplay, RoleplayName, RoleplayDesc } = this.state.roleplay;
        const { data } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h2>Role Play</h2>
                        <form className={classes.container} noValidate autoComplete="off"
                            onSubmit={(e) => this.handleClickSave(e)}>
                            <div className={classes.container}>
                                <TextField disabled label="Kode Role <Otomatis>" onChange={(e) => this.handleChange(e)} name="KdRoleplay"
                                    margin="normal" className={classes.textField} value={KdRoleplay} />
                                <TextField label="Nama Role" onChange={(e) => this.handleChange(e)} name="RoleplayName"
                                    margin="normal" className={classes.textField} value={RoleplayName} />
                                <TextField label="Deskripsi Role" onChange={(e) => this.handleChange(e)} name="RoleplayDesc"
                                    margin="normal" className={classes.textField} value={RoleplayDesc} />

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
                        <TableRoleplay data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
            </div >
        )
    }

}
RoleplayPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoleplayPage);