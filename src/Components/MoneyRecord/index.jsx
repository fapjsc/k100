import { useContext, useEffect } from 'react';

// Context
import BalanceContext from '../../context/balance/BalanceContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// import BaseDialog from './../Ui/BaseDialog';
// import PubSub from 'pubsub-js';

import './index.scss';

const MoneyRecord = () => {
  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance, avb, real, getTick, tick } = balanceContext;

  // HttpError Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getBalance(token);
    getTick(token);

    let timer = 1000 * 60; // 一分鐘
    const checkTick = setInterval(() => {
      getTick(token);
    }, timer);

    return () => {
      clearInterval(checkTick);
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (tick) {
      const token = localStorage.getItem('token');
      if (!token) return;
      getBalance(token);
      // getTick(token);
    }
    // eslint-disable-next-line
  }, [tick]);

  // const { Avb_Balance, Real_Balance, httpError } = this.state;
  return (
    <section className="bg-white">
      <div className="balance-width-box d-flex justify-context-start align-items-center">
        <div className="mr-4">
          <span style={{ color: '#707070' }}>結餘：</span>
          <span className="usdt mr_sm"></span>
          <span className="c_green mr_sm">USDT</span>
          <span className="c_green fs_20">{Number(real).toFixed(2)}</span>
        </div>

        <div className="">
          <span style={{ color: '#707070' }}>可提：</span>
          <span className="usdt mr_sm"></span>
          <span className="c_green mr_sm">USDT</span>
          <span className="c_green fs_20">{Number(avb).toFixed(2)}</span>
        </div>
        {/* {!!httpError ? <BaseDialog httpError={httpError} closeDialog={this.closeDialog} /> : null} */}
      </div>
    </section>
  );
};

export default MoneyRecord;
