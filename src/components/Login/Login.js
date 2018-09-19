import React, { Component } from 'react';
import AlertDialogSlide from '../Alert/Alert';
import PropTypes from 'prop-types';
import { withStyles,  createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { login } from '../Service/AuthService';
import { withRouter } from 'react-router-dom';

import { connect } from "react-redux";
import { addUser } from "../../js/actions/index";



const mapDispatchToProps = dispatch => {
  return {
    addUser: user => dispatch(addUser(user))
  };
};

const styles = ({
  root: {
    flexGrow: 1,
    padding: "10px;",
  },
  gridContainer:{
    height:"500px;"
  },
  container: {
    flexWrap: 'wrap',
    display: "block",
    
  },
  textField: {
    width: "100%;"
  },
  button: {
    marginTop: "20px",
    width: "100%;"
  }
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {
        username: "",
        password: "",
        isLogin: false,
        failed: false
      }
    }
  }

  componentWillMount(){
    this.setState({failed:false});
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState(state => (state.account[name] = value));
    console.log(this.state);
  }

  closeModal(){
    this.setState({failed:false});
  }

  handleClick(e) {
    e.preventDefault();
    let acc = this.state.account;
    if (acc.username && acc.password) {
      login(acc.username, acc.password).then(res => 
      {
        if(!res)
        {
          this.setState({failed:true});
          return;
        }
        this.setState({isLogin:true});
        this.props.addUser(res);
        setTimeout(() => {
          this.props.history.push("/home");
        }, 1000);
        
      });
      
    }
  }

  render() {
    const { classes } = this.props;
    const { username, password } = this.state.account;
    return (
      <div className={classes.root}>
        <Grid container justify="center" alignItems="center" className={classes.gridContainer}>
          <Grid item xs={12} lg={4} md={6} sm={6}>
              <h3>Administrative Area</h3>
              <form className={classes.container} noValidate autoComplete="off" onSubmit={(e) => this.handleClick(e)}>
                <div className={classes.container}>
                  <TextField label="Username" onChange={(e) => this.handleChange(e)} name="username" margin="normal"
                    className={classes.textField} value={username}/>
                  <TextField label="Password" onChange={(e) => this.handleChange(e)} name="password" type="password" margin="normal"
                    className={classes.textField} value={password}/>
                  <Button variant="outlined" size="medium" color="primary" className={classes.button}
                    onClick={(e) => this.handleClick(e)}>
                    Masuk
                  </Button>
                </div>
              </form>
          </Grid>
        </Grid>
        <AlertDialogSlide showed={this.state.failed} title="Informasi"
        message="Username atau password salah" onClose={() => this.closeModal()}>
        </AlertDialogSlide>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const LoginPageConn = connect(null, mapDispatchToProps)(LoginPage);

export default withRouter(withStyles(styles)(LoginPageConn));