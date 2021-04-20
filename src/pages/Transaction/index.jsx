import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';

import TransactionNav from '../../Components/TransactionNav';
import Buy from '../../Components/Buy';
import Sell from '../../Components/Sell/Sell';
import SellInfo from '../../Components/Sell/SellInfo';
import Transfer from '../../Components/Transfer';

import './index.scss';

const Transaction = () => {
  // state = {
  //   Avb_Balance: null,
  //   Real_Balance: null,
  //   exRate: null,
  // };

  const [Avb_Balance, setAvb_Balance] = useState(null);
  const [Real_Balance, setReal_Balance] = useState(null);
  const [exRate, setexRate] = useState(null);
  const [loginSession, setLoginSession] = useState(null);
  const [headers, setHeaders] = useState(null);

  const history = useHistory();
  const location = useLocation();

  // 獲取匯率
  const getExRate = async headers => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('token 過期');
    }

    const exRateApi = `/j/ChkExRate.aspx`;

    try {
      const res = await fetch(exRateApi, {
        headers,
      });

      const resData = await res.json();

      const { data } = resData;

      setexRate(data);
    } catch (error) {
      alert(error, 'getExRate');
    }
  };

  const getBalance = async token => {
    if (!token) {
      alert('請重新登入, get balance');
      localStorage.removeItem('token');
      history.replace('/auth/login');

      return;
    }

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
        // clearInterval(this.checkTickLoop);
        return;
      }

      const { Avb_Balance, Real_Balance } = resData.data;

      setAvb_Balance(Avb_Balance);
      setReal_Balance(Real_Balance);
    } catch (error) {
      localStorage.removeItem('token');
      // clearInterval(this.checkTickLoop);
      alert('session過期，請重新登入 get balance catch');
      history.replace('/auth/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('login_session', token);

      setHeaders(headers);
      setLoginSession(token);
      getExRate(headers);

      getBalance(token);
    } else {
      return;
    }

    // eslint-disable-next-line
  }, []);
  // componentDidMount() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     headers.append('login_session', token);

  //     this.setState({
  //       loginSession: token,
  //       headers,
  //     });
  //     this.getExRate(headers);

  //     this.getBalance(token);
  //   } else {
  //     return;
  //   }
  // }

  // const { location } = this.props;
  // const { Avb_Balance, exRate } = this.state;
  return (
    <section className="transaction">
      <div
        className="row"
        style={{
          marginTop: 40,
        }}
      >
        <p className="welcome_txt col-xl-9 mx-auto">歡迎登入</p>
        <div className="col-xl-9 transaction-card">
          {/* Nav */}
          <TransactionNav location={location} />

          <Switch>
            {/* BUY */}
            <Route
              path="/home/transaction/buy"
              component={props => <Buy exRate={exRate} {...props} />}
            />

            {/* SELL */}
            <Route exact path="/home/transaction/sell" component={Sell} />
            <Route exact path="/home/transaction/sell/:id" component={SellInfo} />

            {/* Transfer */}
            <Route
              path="/home/transaction/transfer"
              component={props => (
                <Transfer
                  Avb_Balance={Avb_Balance}
                  exRate={exRate}
                  getExRate={getExRate}
                  {...props}
                />
              )}
            />
            <Redirect to="/home/transaction/buy" />
          </Switch>
        </div>
      </div>
    </section>
  );
};

export default Transaction;
