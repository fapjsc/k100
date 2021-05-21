import { useState, useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Auth from './Components/Auth';
import Home from './pages/Home';
import ForgetPassword from './Components/Auth/ForgetPassword';
import { ProtectedRoute } from './router/ProtectedRoute';

// Context State
import SellState from './context/sell/SellState';
import BalanceState from './context/balance/BalanceState';
import AuthState from './context/auth/AuthState.jsx';
import TransferState from './context/transfer/TransferState';
import HistoryState from './context/history/HistoryState';
import HttpErrorState from './context/httpError/HttpErrorState';
import BuyState from './context/buy/BuyState';
import ChatState from './context/chat/ChatState';
import InstantState from './context/instant/InstantState';
import WalletState from './context/wallet/WalletState';

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
    <HttpErrorState>
      <AuthState>
        <BalanceState>
          <InstantState>
            <TransferState>
              <SellState>
                <HistoryState>
                  <BuyState>
                    <WalletState>
                      <ChatState>
                        <Switch>
                          <Route
                            path="/auth"
                            component={props => <Auth {...props} setAuth={setAuth} />}
                          />

                          <Route path="/agreement" component={Agreement} />

                          <Route
                            isAuth={isAuth}
                            path="/home"
                            component={props => <Home {...props} setAuth={setAuth} />}
                          />

                          <Route exact path="/forget-pw" component={ForgetPassword} />

                          <Redirect to="/auth/login" />
                        </Switch>
                      </ChatState>
                    </WalletState>
                  </BuyState>
                </HistoryState>
              </SellState>
            </TransferState>
          </InstantState>
        </BalanceState>
      </AuthState>
    </HttpErrorState>
  );
}

export default App;
