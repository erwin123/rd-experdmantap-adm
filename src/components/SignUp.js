import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../components/constants/routes';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div >
);
const SignUpLink = () => (
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {

  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
      </form>
    );
  }
}



export default SignUpPage;

export {
  SignUpForm,
  SignUpLink,
};