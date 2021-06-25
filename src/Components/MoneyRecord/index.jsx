import { useContext, useEffect } from 'react';

// Context
import BalanceContext from '../../context/balance/BalanceContext';
import { useI18n } from '../../lang';

import './index.scss';

const MoneyRecord = () => {
  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance, avb, real, getTick, tick } = balanceContext;

  // Lang Context
  const { t } = useI18n();

  // Auth Context
  // const authContext = useContext(AuthContext);
  // const { isLogout } = authContext;

  // HttpError Context
  // const httpErrorContext = useContext(HttpErrorContext);
  // const { errorText, setHttpError } = httpErrorContext;

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
    const token = localStorage.getItem('token');
    if (!token || !tick) return;
    getBalance(token);
    // eslint-disable-next-line
  }, [tick]);

  return (
    <section className="bg-white">
      <div className="balance-width-box d-flex justify-context-start align-items-center">
        <div className="mr-4">
          <span style={{ color: '#707070' }}>{t('balance_real')}：</span>
          <span className="usdt mr_sm"></span>
          <span className="c_green mr_sm">USDT</span>
          <span className="c_green fs_20">{Number(real).toFixed(2)}</span>
        </div>

        <div className="">
          <span style={{ color: '#707070' }}>{t('balance_avb')}：</span>
          <span className="usdt mr_sm"></span>
          <span className="c_green mr_sm">USDT</span>
          <span className="c_green fs_20">{Number(avb).toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
};

export default MoneyRecord;
