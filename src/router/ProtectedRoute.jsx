import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from '../Components/Auth/index'

export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {

  const auth = new Auth()
  return (
    <Route
      {...rest}
      render={props => {
        if (auth.state.isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};