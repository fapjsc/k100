import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    console.log(rest, 'pro route props');
    return (
        <Route
            {...rest}
            render={props => {
                if (rest.isAuth) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: {
                                    from: props.location,
                                },
                            }}
                        />
                    );
                }
            }}
        />
    );
};
