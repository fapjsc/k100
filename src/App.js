import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Auth from './Components/Auth';
import Home from './pages/Home';
import ForgetPassword from './Components/Auth/ForgetPassword';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Actions
import { setOpenWebPushNotify } from './store/actions/agentAction';

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
import Agreement from './Components/Auth/Agreement.js';

// Firebase web puh
import { onMessageListener, deleteToken } from './firebaseInit';
import Notification from './Components/Notifications/Notifications';
import ReactNotificationComponent from './Components/Notifications/ReactNotification';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  console.log('app');
  // Redux
  const { openWebPushNotify } = useSelector(state => state.agent);
  const dispatch = useDispatch();

  const [isAuth, setIsAuth] = useState(false);

  const [showNotify, setShowNotify] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    const notifyStat = localStorage.getItem('openNotify');

    if (!openWebPushNotify || !notifyStat) {
      setOpenWebPushNotify(false);
      setShowNotify(false);
      setNotification({ title: '', body: '' });
      deleteToken();
      console.log('通知已關閉');
      return;
    }

    console.log('通知開啟');

    const onMessageListenerCallback = payload => {
      try {
        if (payload) {
          setShowNotify(true);
          setNotification({
            title: payload.notification.title,
            body: payload.notification.body,
          });

          console.log(payload, 'payload');
        }
      } catch (error) {
        console.log('onMessage Fail.', error);
      }
    };

    onMessageListener(onMessageListenerCallback);
  }, [openWebPushNotify]);

  useEffect(() => {
    if (window.Notification.permission === 'denied') {
      dispatch(setOpenWebPushNotify(false));
      localStorage.removeItem('openNotify');
    }
  }, [dispatch]);

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
                        {openWebPushNotify && <Notification />}

                        {showNotify && (
                          <ReactNotificationComponent
                            title={notification.title}
                            body={notification.body}
                          />
                        )}

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
};

export default React.memo(App);
