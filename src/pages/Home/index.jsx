import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';

// Components
import Transaction from '../../pages/Transaction';
import Header from '../../Components/Layout/Header';
import TheNav from '../../Components/Layout/TheNav';
import MoneyRecord from '../../Components/MoneyRecord';
import Overview from '../../Components/Overview';
// import Wallet from '../../Components/Wallet';
import TheWallet from '../../Components/Wallet/TheWallet';
import WalletDetail from '../../Components/Wallet/WalletDetail';
import History from '../../Components/History';
import ChangePassword from '../../Components/Auth/ChangePassword';
import InstantCount from '../../Components/Instant/InstantCount';
import InstantDetail from '../../Components/Instant/InstantDetail';

// Style
import style from '../../Components/Layout/Header.module.scss';

export default class index extends Component {
  state = {
    token: null,
  };

  getConfirmPay = async () => {
    const token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    try {
      const reqBuy2Api = `/j/Req_Buy2.aspx`;

      const res = await fetch(reqBuy2Api, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: this.state.orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        this.setState({
          upload: true,
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  logout = async () => {
    window.confirm('確定要登出嗎');

    const { token, history } = this.props;
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('agent');
    localStorage.removeItem('loglevel');

    history.replace('/login');

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    this.props.setAuth();

    let logoutApi = '/j/logout.aspx';
    try {
      fetch(logoutApi, { headers });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const { history, location } = this.props;
    this.setState({
      token,
    });
    if (!token) {
      history.replace('/auth/login');
    } else {
      if (location.pathname === '/home' || location.pathname === '/home/') {
        history.replace('/home/overview');
      }
    }
  }

  render() {
    const { history, setAuth } = this.props;
    const { token } = this.state;
    return (
      <>
        <Header history={history} token={token} setAuth={setAuth}>
          <Link to="/home" className={style.logoLink}>
            <div className={style.logo}></div>
          </Link>
          <TheNav logout={this.logout} />
        </Header>
        <MoneyRecord history={history} />
        <Switch>
          <Route path="/home/overview" component={Overview} />
          <Route exact path="/home/wallet" component={TheWallet} />
          <Route exact path="/home/wallet/:id" component={WalletDetail} />
          <Route path="/home/history" component={History} />
          <Route path="/home/transaction" component={Transaction} />
          <Route path="/home/change-pw" component={ChangePassword} />
          <Route exact path="/home/instant" component={InstantCount} />
          <Route exact path="/home/instant/:id" component={InstantDetail} />

          <Redirect to="/home/overview" />
        </Switch>
      </>
    );
  }
}
