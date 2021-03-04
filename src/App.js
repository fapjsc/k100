import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Components/Auth';
import Home from './pages/Home';

import './App.scss';
function App() {
  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/home" component={Home} />
        <Redirect to="/auth" />
      </Switch>
    </>
  );
}

export default App;
