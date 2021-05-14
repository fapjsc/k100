import React from 'react';
import { Link } from 'react-router-dom';

import { Nav } from 'react-bootstrap';
import style from './Header.module.scss';

const TheNav = props => {
  return (
    <Nav className={style.navList}>
      <Link to="/home/transaction" className={style.navLink}>
        交易
      </Link>
      <span
        style={{
          color: '#fff',
        }}
      >
        |
      </span>
      <Link to="/home/history/all" replace className={style.navLink}>
        紀錄
      </Link>
      <span
        style={{
          color: '#fff',
        }}
      >
        |
      </span>
      <Link to="/home/wallet" className={style.navLink}>
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
