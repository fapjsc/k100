import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Components/Auth';
import Home from './pages/Home';
import ForgetPassword from './Components/Auth/ForgetPassword';
// import { ProtectedRoute } from './router/ProtectedRoute';

import SellState from './context/sell/SellState';
import BalanceState from './context/balance/BalanceState';
import AuthState from './context/auth/AuthState.jsx';
import TransferState from './context/transfer/TransferState';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.scss';
import Agreement from './Components/Auth/Agreement';
function App() {
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = token => {
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  };
  return (
    <AuthState>
      <BalanceState>
        <TransferState>
          <SellState>
            <Switch>
              <Route path="/auth" component={props => <Auth {...props} setAuth={setAuth} />} />

              <Route path="/agreement" component={Agreement} />
              <Route
                isAuth={isAuth}
                path="/home"
                component={props => <Home {...props} setAuth={setAuth} />}
              />

              <Route exact path="/forget-pw" component={ForgetPassword} />

              <Redirect to="/auth/login" />
            </Switch>
          </SellState>
        </TransferState>
      </BalanceState>
    </AuthState>
  );
}

export default App;
