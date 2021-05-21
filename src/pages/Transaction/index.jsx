import { useState, useEffect, useContext } from 'react';
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';

// Context
import AuthContext from '../../context/auth/AuthContext';

// Components
import TransactionNav from '../../Components/TransactionNav';
import Sell from '../../Components/Sell/Sell';
import SellInfo from '../../Components/Sell/SellInfo';
import Transfer from '../../Components/Transfer';
import TransferInfo from '../../Components/Transfer/TransferInfo';
import TheBuy from '../../Components/Buy/TheBuy';
import BuyInfo from '../../Components/Buy/BuyInfo';

// Style
import './index.scss';

const Transaction = () => {
  // Auth Context
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  // eslint-disable-next-line
  const [Avb_Balance, setAvb_Balance] = useState(null);
  // eslint-disable-next-line
  const [exRate, setExRate] = useState(null);

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

      setExRate(data);
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

      const { Avb_Balance } = resData.data;

      setAvb_Balance(Avb_Balance);
      // setReal_Balance(Real_Balance);
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

      getExRate(headers);

      getBalance(token);
    } else {
      return;
    }

    // eslint-disable-next-line
  }, []);

  return (
    <section className="transaction">
      <div
        className="row"
        style={{
          marginTop: 40,
        }}
      >
        <p
          className="welcome_txt col-xl-9"
          style={{
            margin:
              location.pathname === '/home/transaction/buy'
                ? '0 auto'
                : location.pathname === '/home/transaction/sell'
                ? '0 auto'
                : location.pathname === '/home/transaction/transfer'
                ? '0 auto'
                : '0 0 0 -45px',
          }}
        >
          歡迎登入
        </p>
        <div
          className="col-xl-9 transaction-card"
          style={{
            margin:
              location.pathname === '/home/transaction/buy'
                ? '0 auto'
                : location.pathname === '/home/transaction/sell'
                ? '0 auto'
                : location.pathname === '/home/transaction/transfer'
                ? '0 auto'
                : '0 0 0 -45px',
          }}
        >
          {/* Nav */}
          <TransactionNav location={location} />

          <Switch>
            <>
              {/* BUY */}
              <Route exact path="/home/transaction/buy" component={TheBuy} />
              <Route exact path="/home/transaction/buy/:id" component={BuyInfo} />

              {/* SELL */}
              <Route exact path="/home/transaction/sell" component={Sell} />
              <Route exact path="/home/transaction/sell/:id" component={SellInfo} />

              {/* Transfer */}
              <Route exact path="/home/transaction/transfer" component={Transfer} />
              <Route exact path="/home/transaction/transfer/:id" component={TransferInfo} />

              <Redirect to="/home/transaction/buy" />
            </>
          </Switch>
        </div>
      </div>
    </section>
  );
};

export default Transaction;
