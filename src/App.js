import React from 'react';
// import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Components/Auth';
import Home from './pages/Home';
import {ProtectedRoute} from './router/ProtectedRoute'

import './App.scss';
function App() {
 
  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        <ProtectedRoute path="/home" component={Home} />
        <Redirect to="/auth" />
      </Switch>
    </>
  );
}

export default App;
