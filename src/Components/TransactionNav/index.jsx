import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import index from './index.scss';

export default class TransactionNav extends Component {
  render() {
    const { location } = this.props;
    return (
      <div className="transactionNav" style={linkBox}>
        <Link
          className="transactionLink"
          to="/home/transaction/buy"
          style={location.pathname.includes(`/home/transaction/buy`) ? linkActive : linkStyle}
          // className={
          //   location.pathname.includes(`/home/transaction/buy`)
          //     ? 'history-link history-link-active'
          //     : 'history-link'
          // }
        >
          購買
        </Link>
        <Link
          className="transactionLink"
          to="/home/transaction/sell"
          style={location.pathname.includes('/home/transaction/sell') ? linkActive : linkStyle}
          //   className={
          //     location.pathname.includes('/home/transaction/sell')
          //       ? 'history-link history-link-active'
          //       : 'history-link'
          //   }
        >
          出售
        </Link>

        <Link
          className="transactionLink"
          to="/home/transaction/transfer"
          style={location.pathname.includes('/home/transaction/transfer') ? linkActive : linkStyle}
          //   className={
          //     location.pathname.includes('/home/transaction/transfer')
          //       ? 'history-link history-link-active'
          //       : 'history-link'
          //   }
        >
          轉帳
        </Link>
      </div>
    );
  }
}

const linkBox = {
  borderBottom: '1px solid #D7E2F3',
  marginBottom: 30,
  paddingTop: 30,

  paddingLeft: 0,
};

const linkStyle = {
  backgroundColor: 'inherit',
  border: 'none',
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
