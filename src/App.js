import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Components/Auth';
import Home from './pages/Home';
import { ProtectedRoute } from './router/ProtectedRoute';

import './App.scss';
function App() {
    const [isAuth, setIsAuth] = useState(false);

    const test = token => {
        if (token) {
            setIsAuth(true);
        }
    };
    return (
        <Switch>
            <Switch>
                <Route path="/auth" component={props => <Auth {...props} test={test} />} />
                <ProtectedRoute isAuth={isAuth} path="/home" component={Home} />
                <Redirect to="/auth/login" />
            </Switch>
        </Switch>
    );
}

export default App;
