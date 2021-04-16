import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

export default class index extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('請重新登入');
      this.props.history.replace('/auth/login');
    }
  }

  render() {
    return (
      <section className="overview bg_grey">
        <div className="container h_88">
          <div className="row text-center">
            <p className="welcome_txt text-left">歡迎登入</p>
            <div className="col-12">
              <div className="col-md-3 col-sm-6 col-12 d-inline-block">
                <Link className="home_btn" to="/home/transaction">
                  <div className="trade"></div>
                  <p>買賣</p>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 col-12 d-inline-block">
                <Link className="home_btn" to="/home/transaction/transfer">
                  <div className="i_01"></div>
                  <p>轉賬</p>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 col-12 d-inline-block">
                <Link className="home_btn" to="/home/wallet">
                  <div className="i_wallet"></div>
                  <p>我的錢包</p>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 col-12 d-inline-block">
                <Link className="home_btn" to="/home/history">
                  <div className="i_trans"></div>
                  <p>交易紀錄</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
