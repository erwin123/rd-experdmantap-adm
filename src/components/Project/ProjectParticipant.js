import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TableProjParticipant from './TableProjParticipant';
import Icon from '@material-ui/core/Icon';
import teal from '@material-ui/core/colors/teal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import * as join from '../LibJoin/index';

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
const localData = JSON.parse(localStorage.getItem('currentUser'));

class ProjParticipantPage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  closeModal() {
    this.setState({ showAlert: false });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState(state => (state.projpar[name] = value));
  }

  createData(id, propar) {
    return {
      id,
      ProjectName: propar.ProjectName,
      Project_ProjectCode: propar.ProjectCode,
      Employee_EmployeeCode: propar.EmployeeCode,
      EmployeeName: propar.EmployeeName,
      EmployeeNPK: propar.EmployeeNPK,
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
    return axios.get(urlProj, { headers: { 'x-access-token': localData.token } });
  }

  fetchDataEmployee() {
    let urlEmp = "https://api-experdserve.experd.com/api/trx/employee/";
    return axios.get(urlEmp, { headers: { 'x-access-token': localData.token } });
  }

  fetchDataProjectEmployee() {
    return axios.get(url, { headers: { 'x-access-token': localData.token } });
  }

  componentDidMount() {
    this.fetchDataAll();
  }

  handleClickSave(e) {
    e.preventDefault();
    let pe = this.state.projpar;
    if (pe.Project_ProjectCode && pe.Employee_EmployeeCode) {

      let projpar = this.state.data.find(c => c.Project_ProjectCode === pe.Project_ProjectCode && c.Employee_EmployeeCode === pe.Employee_EmployeeCode);
      if(projpar)
      {
        this.setState({ showAlert: true, alertMessage: "Participant "+projpar.EmployeeName+" sudah pernah ditambahkan di project "+ pe.Project_ProjectCode});
        return false;
      }

      axios.post(url, pe, { headers: { 'x-access-token': localData.token } })
        .then(response => {
          if (response.status === 200) {
            this.setState({ showAlert: true, alertMessage: "Penambahan berhasil" });
            this.reset();
            this.fetchDataAll();
            return true;
          }
          this.setState({ showAlert: true, alertMessage: "Gagal Simpan!" });
          return false;
        })
        .catch(error => {
          if (error.response.status === 401)
            this.setState({ showAlert: true, alertMessage: "Gagal Simpan! Sesi telah habis, lakukan login ulang" });
          return false;
        });
    }
    this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
    return false;
  }

  handleClickDelete(e){
    e.preventDefault();
    let pe = this.state.projpar;
    if (pe.Project_ProjectCode && pe.Employee_EmployeeCode) {
      axios.delete(url+pe.Project_ProjectCode+"/"+pe.Employee_EmployeeCode, { headers: { 'x-access-token': localData.token } })
        .then(response => {
          if (response.status === 200) {
            this.setState({ showAlert: true, alertMessage: pe.Employee_EmployeeCode+" sudah dihapus dari project "+ pe.Project_ProjectCode});
            this.reset();
            this.fetchDataAll();
            return true;
          }
          this.setState({ showAlert: true, alertMessage: "Gagal Simpan!" });
          return false;
        })
        .catch(error => {
          if (error.response.status === 401)
            this.setState({ showAlert: true, alertMessage: "Gagal Simpan! Sesi telah habis, lakukan login ulang" });
          return false;
        });
    }
    this.setState({ showAlert: true, alertMessage: "Mohon lengkapi semua kolom isian." });
    return false;
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
    this.setState({
      editMode: true
    });
  }

  handleChangeProject(e) {
    this.setState({
      ...this.state, projpar: {
        ...this.state.projpar,
        Project_ProjectCode: e.target.value
      }
    });
  }

  handleChangeEmployee(e) {
    this.setState({
      ...this.state, projpar: {
        ...this.state.projpar,
        Employee_EmployeeCode: e.target.value
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { Project_ProjectCode, Employee_EmployeeCode, ProjectName, EmployeeName, EmployeeNPK } = this.state.projpar;
    const { data, dataProject, dataEmployee } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12} sm={12} md={4} lg={4} >
            <h2>Tambah Participant</h2>
            <form className={classes.container} noValidate autoComplete="off"
              onSubmit={(e) => this.handleClickSave(e)}>
              <div className={classes.container}>
                <FormControl disabled={!this.state.editMode ? null:'disabled'} style={{ marginRight: '50px' }} className={classes.formControl}>
                  <InputLabel htmlFor="Project">Project</InputLabel>
                  <Select autoWidth value={Project_ProjectCode} onChange={(e) => this.handleChangeProject(e)}
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

                <FormControl disabled={!this.state.editMode ? null:'disabled'} style={{ marginRight: '50px' }} className={classes.formControl}>
                  <InputLabel htmlFor="Employee">Employee</InputLabel>
                  <Select autoWidth value={Employee_EmployeeCode} onChange={(e) => this.handleChangeEmployee(e)}
                    name="Employee" inputProps={{
                      id: 'Employee',
                    }} className={classes.selectEmpty}>
                    {dataEmployee.map(n => {
                      return (
                        <MenuItem key={n.EmployeeCode} value={n.EmployeeCode}>{n.EmployeeName} NPK ({n.EmployeeNPK})</MenuItem>
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
                    <Button variant="outlined" size="medium" color="primary"
                      className={classes.button} onClick={() => this.reset()}>
                      BATAL &nbsp;
                                        <Icon className={classes.rightIcon}>block</Icon>
                    </Button>
                    <Button variant="contained" size="medium" color="secondary"
                      className={classes.button} onClick={(e) => this.handleClickDelete(e)}>
                      HAPUS &nbsp;
                                        <Icon className={classes.rightIcon}>delete</Icon>
                    </Button>
                  </div>}

              </div>
            </form>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7} >
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
ProjParticipantPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjParticipantPage);