import { useContext } from 'react';
import { Link } from 'react-router-dom';

// Context
import BuyContext from '../../context/buy/BuyContext';
import SellContext from '../../context/sell/SellContext';
import InstantContext from '../../context/instant/InstantContext';
// import AuthContext from '../../context/auth/AuthContext';

// Style
import { Nav } from 'react-bootstrap';
import style from './Header.module.scss';
// import InstantCount from '../Instant/InstantCount';

const TheNav = props => {
  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsClient } = buyContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsClient } = sellContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { wsStatusClient } = instantContext;

  // Auth Context
  // const authContext = useContext(AuthContext);
  // // const { setIsLogout } = authContext;

  const handleClick = () => {
    if (buyWsClient) buyWsClient.close();
    if (wsClient) wsClient.close();
    if (wsStatusClient) wsStatusClient.close();
  };

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) props.logout();
  };

  return (
    <Nav className={style.navList}>
      <Link to="/home/transaction" className={style.navLink} onClick={handleClick}>
        交易
      </Link>
      <span
        style={{
          color: '#fff',
        }}
      >
        |
      </span>
      <Link to="/home/history/all" className={style.navLink} onClick={handleClick}>
        紀錄
      </Link>
      <span
        style={{
          color: '#fff',
        }}
      >
        |
      </span>
      <Link to="/home/wallet" className={style.navLink} onClick={handleClick}>
        錢包
      </Link>
      <span
        style={{
          color: '#fff',
        }}
      >
        |
      </span>

      <Link to="/" onClick={handleLogout} style={{ marginRight: 0 }} className={style.navLink}>
        登出
      </Link>
    </Nav>
  );
};

export default TheNav;
