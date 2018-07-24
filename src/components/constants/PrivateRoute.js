import React from 'react'
import { Redirect, Route, withRouter } from 'react-router-dom'
import { isAuthenticate } from '../Service/AuthService';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  const isLoggedIn = isAuthenticate();

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default withRouter(PrivateRoute)