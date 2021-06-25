import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

// Context
import { useI18n } from '../../lang';

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
  // Router Props
  const location = useLocation();

  // lang Context
  const { t } = useI18n();

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
          {t('welcome_text')}
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
          </Switch>
        </div>
      </div>
    </section>
  );
};

export default Transaction;
