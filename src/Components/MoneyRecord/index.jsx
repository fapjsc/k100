import React, { Component } from 'react';
import BaseDialog from './../Ui/BaseDialog';
import PubSub from 'pubsub-js';

import './index.scss';

export default class MoneyRecord extends Component {
  state = {
    Avb_Balance: 0, // 可提
    Real_Balance: 0, // 結餘
    tick: null, // 每分鐘檢查一次，tick如果不同，代表balance有變動，需重新再 get balance
    token: null,
    httpError: null,
  };

  getBalance = async () => {
    const { history } = this.props;

    const token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const balanceApi = '/j/ChkBalance.aspx';

    try {
      const res = await fetch(balanceApi, {
        headers: headers,
      });

      const resData = await res.json();

      if (resData.code === '91' || resData.code === '90') {
        localStorage.removeItem('token');
        window.confirm('session過期，請重新登入 get balance !res.ok');

        history.replace('/auth/login');
        clearInterval(this.checkTickLoop);
        return;
      }

      const { Avb_Balance, Real_Balance } = resData.data;

      this.setState(
        {
          Avb_Balance,
          Real_Balance,
        },
        () => {}
      );
    } catch (error) {
      localStorage.removeItem('token');
      clearInterval(this.checkTickLoop);
      alert('session過期，請重新登入 get balance catch');
      // history.replace('/auth/login');
    }
  };

  pubBalance = value => {
    PubSub.publish('pubBalance', value);
  };

  getTick = async token => {
    if (!token) {
      const { history } = this.props;

      alert('請重新登入, get tick');
      localStorage.removeItem('token');
      history.replace('/auth/login');
    }

    const { history } = this.props;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const getTickApi = '/j/ChkUpdate.aspx';

    try {
      const res = await fetch(getTickApi, {
        headers,
      });
      const resData = await res.json();

      if (resData.code === '91' || resData.code === '90') {
        localStorage.removeItem('token');

        alert('session過期，請重新登入 get tick');

        history.replace('/auth/login');
        return;
      }

      const { UpdateTick: tick } = resData.data;
      this.setState({
        tick,
      });
    } catch (error) {
      localStorage.removeItem('token');
      clearInterval(this.checkTickLoop);
      alert('session過期，請重新登入 get tick catch');
      history.replace('/auth/login');
    }
  };

  checkTick = async token => {
    if (!token) {
      const { history } = this.props;

      alert('請重新登入, check tick');
      localStorage.removeItem('token');
      history.replace('/auth/login');
    }

    const { tick } = this.state;
    const { history } = this.props;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const getTickApi = '/j/ChkUpdate.aspx';

    try {
      const res = await fetch(getTickApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === '91' || resData.code === '90') {
        localStorage.removeItem('token');

        alert('session過期，請重新登入 check tick');

        history.replace('/auth/login');
        return;
      }

      const { UpdateTick: checkTick } = resData.data;

      if (tick !== checkTick) {
        this.getBalance();
      }
    } catch (error) {
      localStorage.removeItem('token');
      clearInterval(this.checkTickLoop);
      alert('session過期，請重新登入 check tick catch');
      history.replace('/auth/login');
    }
  };

  closeDialog = () => {
    this.setState({
      httpError: null,
    });
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const { history } = this.props;
    if (token) {
      this.setState(
        {
          token,
        },
        () => {
          this.getBalance(token);
          this.getTick(token);
        }
      );

      const timer = 1000 * 60; //一分鐘

      this.checkTickLoop = setInterval(() => {
        this.checkTick(token);
      }, timer);
    } else {
      alert('請重新登入, money record did mount...');
      history.replace('/auth/login');
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkTickLoop);
    // this.pubBalance();
  }

  render() {
    const { Avb_Balance, Real_Balance, httpError } = this.state;
    return (
      <section className="bg-white balance-box">
        <div className="balance-width-box px-4">
          <div className="balance mr-4">
            結餘：
            <span className="usdt mr_sm"></span>
            <span className="c_green mr_sm">USDT</span>
            <span className="c_green fs_20">{Number(Real_Balance).toFixed(2)}</span>
          </div>

          <div className="balance">
            可提：
            <span className="usdt mr_sm"></span>
            <span className="c_green mr_sm">USDT</span>
            <span className="c_green fs_20">{Number(Avb_Balance).toFixed(2)}</span>
          </div>
          {!!httpError ? <BaseDialog httpError={httpError} closeDialog={this.closeDialog} /> : null}
        </div>
      </section>
    );
  }
}
