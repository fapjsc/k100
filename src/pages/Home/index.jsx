import { useState, useEffect, useContext } from 'react';
import { Route, Switch, Redirect, Link, useHistory, useLocation } from 'react-router-dom';

// Context
import AuthContext from '../../context/auth/AuthContext';

// Components
import Transaction from '../../pages/Transaction';
import Header from '../../Components/Layout/Header';
import TheNav from '../../Components/Layout/TheNav';
import MoneyRecord from '../../Components/MoneyRecord';
import Overview from '../../Components/Overview';
import TheWallet from '../../Components/Wallet/TheWallet';
import WalletDetail from '../../Components/Wallet/WalletDetail';
import History from '../../Components/History';
import ChangePassword from '../../Components/Auth/ChangePassword';
import InstantDetail from '../../Components/Instant/InstantDetail';
import InstantScreen from '../../pages/InstantScreen';

// Style
import style from '../../Components/Layout/Header.module.scss';

const HomeScreen = () => {
  // Router Props
  const history = useHistory();
  const location = useLocation();

  // AuthContext
  const authContext = useContext(AuthContext);
  const { logout } = authContext;

  // Init State
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    setToken(token);

    if (!token) {
      history.replace('/auth/login');
    } else {
      if (location.pathname === '/home' || location.pathname === '/home/') {
        history.replace('/home/overview');
      }
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header history={history} token={token}>
        <Link to="/home" className={style.logoLink}>
          <div className={style.logo}></div>
        </Link>
        <TheNav logout={logout} />
      </Header>
      <MoneyRecord history={history} />
      <Switch>
        <Route exact path="/home/overview" component={Overview} />
        <Route exact path="/home/wallet" component={TheWallet} />
        <Route exact path="/home/wallet/:id" component={WalletDetail} />
        <Route path="/home/history" component={History} />
        <Route path="/home/transaction" component={Transaction} />
        <Route path="/home/change-pw" component={ChangePassword} />
        <Route exact path="/home/instant" component={InstantScreen} />
        <Route exact path="/home/instant/:type/:id" component={InstantDetail} />

        <Redirect to="/home/overview" />
      </Switch>
    </>
  );
};

export default HomeScreen;
