import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableProject from './TableProject';
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
  project: {
    ProjectCode: "",
    ProjectName: "",
    Start: new Date(Date.now()).toISOString().split('T')[0],
    End: new Date(Date.now()).toISOString().split('T')[0],
    Week: ""
  },
  projects: [],
  showAlert: false,
  alertMessage: "",
  data: [],
  editMode: false
};

const url = "https://api-experdserve.experd.com/api/trx/project/";
let localData = JSON.parse(localStorage.getItem('currentUser'));

class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  closeModal() {
    this.setState({ showAlert: false });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState(state => (state.project[name] = value));
  }

  createData(id, project) {
    return {
      id,
      ProjectCode: project.ProjectCode,
      ProjectName: project.ProjectName,
      Start: project.Start,
      End: project.End,
      Week: project.Week,
      Participant: 0
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
              data: [...this.state.data, this.createData(i + 1, response.data[i])]
            });
          }
        }
      })
      .catch(error => {
        if (error.response.status === 401)
          this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data Project! Sesi telah habis, lakukan login ulang" });
        return false;
      }).then(() => {
      });
  }
  componentDidMount() {
    this.fetchData();
  }

  handleClickSave(e) {
    e.preventDefault();
    let pr = this.state.project;
    if (pr.ProjectName && pr.Start && pr.End && pr.Week) {
      axios.post(url, pr, { headers: { 'x-access-token': localData.token } })
        .then(response => {
          if (response.status === 200) {
            this.setState({ showAlert: true, alertMessage: "Project '" + response.data[0].ProjectName + "' berhasil tersimpan" });
            this.reset();
            this.fetchData();
            return true;
          }
          this.setState({ showAlert: true, alertMessage: "Gagal Simpan Project!" });
          return false;
        })
        .catch(error => {
          if (error.response.status === 401)
            this.setState({ showAlert: true, alertMessage: "Gagal Simpan Project! Sesi telah habis, lakukan login ulang" });
          return false;
        });
    }
    this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
    return false;
  }

  handleClickUpdate(e) {
    e.preventDefault();
    let pr = this.state.project;
    if (pr.ProjectName && pr.Start && pr.End && pr.Week) {
      axios.put(url + pr.ProjectCode, pr, { headers: { 'x-access-token': localData.token } })
        .then(response => {
          if (response.status === 200) {
            this.setState({ showAlert: true, alertMessage: "Project berhasil tersimpan" });
            this.reset();
            this.fetchData();
            return true;
          }
          this.setState({ showAlert: true, alertMessage: "Gagal Simpan Project!" });
          return false;
        })
        .catch(error => {
          if (error.response.status === 401)
            this.setState({ showAlert: true, alertMessage: "Gagal Simpan Project! Sesi telah habis, lakukan login ulang" });
          return false;
        });
    }
    this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
    return false;
  }

  reset() {
    this.setState({
      ...this.state, project: {
        ...this.state.project,
        ProjectCode: "",
        ProjectName: "",
        Start: "",
        End: "",
        Week: ""
      }
    });
    this.setState({
      editMode: false
    });
  }

  handleClickRow(e, id) {
    e.preventDefault();
    console.log(id);
    let project = this.state.data.find(c => c.id === id);
    this.setState({
      ...this.state, project: {
        ...this.state.project,
        ProjectCode: project.ProjectCode,
        ProjectName: project.ProjectName,
        Start: new Date(project.Start).toISOString().split('T')[0],
        End: new Date(project.End).toISOString().split('T')[0],
        Week: project.Week
      }
    });
    this.setState({
      editMode: true
    });
  }

  render() {
    const { classes } = this.props;
    const { ProjectCode, ProjectName, Start, End, Week } = this.state.project;
    const { data } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12} sm={12} md={4} lg={4} >
            <h2>Project</h2>
            <form className={classes.container} noValidate autoComplete="off"
              onSubmit={(e) => this.handleClickSave(e)}>
              <div className={classes.container}>
                <TextField disabled label="Kode Project <Otomatis>" onChange={(e) => this.handleChange(e)} name="ProjectCode"
                  margin="normal" className={classes.textField} value={ProjectCode} />
                <TextField label="Nama Project" onChange={(e) => this.handleChange(e)} name="ProjectName"
                  margin="normal" className={classes.textField} value={ProjectName} />
                <TextField label="Mulai Project" onChange={(e) => this.handleChange(e)} name="Start"
                  margin="normal" type="date"
                  InputLabelProps={{
                    shrink: true,
                  }} className={classes.textField} value={Start} />
                <TextField label="Akhir Project" onChange={(e) => this.handleChange(e)} name="End"
                  margin="normal" type="date"
                  InputLabelProps={{
                    shrink: true,
                  }} className={classes.textField} value={End} />
                <TextField label="Jumlah Minggu" onChange={(e) => this.handleChange(e)} name="Week"
                  margin="normal" className={classes.textField} value={Week} />

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
            <TableProject data={data} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
          </Grid >
        </Grid >

        <AlertDialogSlide showed={this.state.showAlert} title="Informasi"
          message={this.state.alertMessage} onClose={() => this.closeModal()}>
        </AlertDialogSlide>
      </div >
    )
  }

}
ProjectPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectPage);