import { useContext } from 'react';
import { Link } from 'react-router-dom';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Style
import { Nav } from 'react-bootstrap';
import style from './Header.module.scss';

const TheNav = props => {
  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsClient } = buyContext;

  const handleClick = () => {
    if (buyWsClient) buyWsClient.close();
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

      <Link to="/" onClick={props.logout} className={style.navLink}>
        登出
      </Link>
    </Nav>
  );
};

export default TheNav;
