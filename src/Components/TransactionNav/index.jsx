import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Context
import BuyContext from '../../context/buy/BuyContext';
import { useI18n } from '../../lang';

// eslint-disable-next-line
import index from './index.scss';

const TransactionNav = () => {
  // Router Props
  const location = useLocation();

  // Lang Context
  const { t } = useI18n();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsClient } = buyContext;

  const handleClick = () => {
    if (buyWsClient) buyWsClient.close();
  };

  return (
    <div className="transactionNav  pt-3" style={linkBox}>
      <Link onClick={handleClick} className="transactionLink" to="/home/transaction/buy" style={location.pathname.includes(`/home/transaction/buy`) ? linkActive : linkStyle}>
        {t('transaction_nav_buy')}
      </Link>
      <Link onClick={handleClick} className="transactionLink" to="/home/transaction/sell" style={location.pathname.includes('/home/transaction/sell') ? linkActive : linkStyle}>
        {t('transaction_nav_sell')}
      </Link>

      <Link onClick={handleClick} className="transactionLink" to="/home/transaction/transfer" style={location.pathname.includes('/home/transaction/transfer') ? linkActive : linkStyle}>
        {t('transaction_nav_transfer')}
      </Link>
    </div>
  );
};

const linkBox = {
  borderBottom: '1px solid #D7E2F3',
  marginBottom: 30,
  paddingTop: 30,

  paddingLeft: 0,
};

const linkStyle = {
  backgroundColor: 'inherit',
  borderBottom: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '14px 16px',
  fontSize: '17px',
  color: '#707070',

  marginRight: '1rem',

  display: 'inline-block',
  width: '10rem',
  textAlign: 'center',
};

const linkActive = {
  backgroundColor: 'inherit',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '14px 16px',
  fontSize: '17px',

  color: '#3f80fa',
  borderBottom: '2px solid #3f80fa',

  marginRight: '1rem',
  display: 'inline-block',
  width: '10rem',
  textAlign: 'center',
};

export default TransactionNav;
