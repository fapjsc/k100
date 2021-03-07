import React, { Component } from 'react';
import Header from '../../Components/Layout/Header';
import MoneyRecord from '../../Components/MoneyRecord';
import Overview from '../../Components/Overview';
import Wallet from '../../Components/Wallet';

import { Route, Switch } from 'react-router-dom';

export default class index extends Component {
  state = {
    token: null,
  };

  componentDidMount() {
    const { history, location } = this.props;
    const token = localStorage.getItem('token');
    this.setState({
      token,
    });
    if (!token) {
      history.replace('/auth');
    }

    if (location.pathname === '/home' || location.pathname === '/home/') {
      history.replace('/home/overview');
    }
  }

  render() {
    const { history } = this.props;
    const { token } = this.state;
    return (
      <>
        <Header history={history} token={token} />
        <MoneyRecord />
        <Switch>
          <Route path="/home/overview" component={Overview} />
          <Route path="/home/wallet" component={Wallet} />
        </Switch>
      </>
    );
  }
}
