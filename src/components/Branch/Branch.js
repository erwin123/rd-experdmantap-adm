import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles,MuiThemeProvider,createMuiTheme  } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableBranch from './TableBranch';
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
    branch: {
        BranchCode: "",
        BranchName: "",
        BranchCity: ""
    },
    branches: [],
    showAlert: false,
    alertMessage: "",
    data: [],
    editMode: false
};

const url = "https://api-experdserve.experd.com/api/trx/branch/";
let localData = JSON.parse(localStorage.getItem('currentUser'));
class BranchPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    closeModal() {
        this.setState({ showAlert: false });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state.branch[name] = value));
    }

    createData(id, branch) {
        return { id,
          BranchCode:branch.BranchCode,
          BranchName:branch.BranchName,
          BranchCity:branch.BranchCity};
      }

    fetchData(){
        this.setState({data: []});
        localData = JSON.parse(localStorage.getItem('currentUser'));
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
                this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data Cabang! Sesi telah habis, lakukan login ulang" });
            return false;
        }).then(() => {
        });
    }
    componentDidMount() {
        this.fetchData();
    }

    handleClickSave(e) {
        e.preventDefault();
        let br = this.state.branch;
        if (br.BranchName && br.BranchCity) {
            axios.post(url, br, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Cabang '" + response.data[0].BranchName + "' berhasil tersimpan" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Simpan Cabang!" });
                    return false;
                })
                .catch(error => {
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Simpan Cabang! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    handleClickUpdate(e) {
        e.preventDefault();
        let br = this.state.branch;
        if (br.BranchName && br.BranchCity) {
            axios.put(url+br.BranchCode, br, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ showAlert: true, alertMessage: "Cabang berhasil diubah" });
                        this.reset();
                        this.fetchData();
                        return true;
                    }
                    this.setState({ showAlert: true, alertMessage: "Gagal Ubah Cabang!" });
                    return false;
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401)
                        this.setState({ showAlert: true, alertMessage: "Gagal Ubah Cabang! Sesi telah habis, lakukan login ulang" });
                    return false;
                });
        }
        this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
        return false;
    }

    reset() {
        this.setState({
            ...this.state, branch: {
                ...this.state.branch,
                BranchCode: "",
                BranchCity: "",
                BranchName: ""
            }
        });
        this.setState({
            editMode: false
        });
    }

    handleClickRow(e, id) {
        e.preventDefault();
        let branch = this.state.data.find(c => c.id === id);
        this.setState({
            ...this.state, branch: {
                ...this.state.branch,
                BranchCode: branch.BranchCode,
                BranchCity: branch.BranchCity,
                BranchName: branch.BranchName
            }
        });
        this.setState({
            editMode: true
        });
    }

    render() {
        const { classes } = this.props;
        const { BranchCode, BranchName, BranchCity } = this.state.branch;
        const { data } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h2>Cabang</h2>
                        <form className={classes.container} noValidate autoComplete="off"
                            onSubmit={(e) => this.handleClickSave(e)}>
                            <div className={classes.container}>
                                <TextField disabled label="Kode Cabang <Otomatis>" onChange={(e) => this.handleChange(e)} name="BranchCode"
                                    margin="normal" className={classes.textField} value={BranchCode} />
                                <TextField label="Nama Cabang" onChange={(e) => this.handleChange(e)} name="BranchName"
                                    margin="normal" className={classes.textField} value={BranchName} />
                                <TextField label="Kota Cabang" onChange={(e) => this.handleChange(e)} name="BranchCity"
                                    margin="normal" className={classes.textField} value={BranchCity} />

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
                        <TableBranch data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </Grid >
                </Grid >

                <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
                    message={this.state.alertMessage} onClose={() => this.closeModal()}>
                </AlertDialogSlide>
            </div >
        )
    }

}
BranchPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BranchPage);