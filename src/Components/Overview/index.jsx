import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      <Container style={{ maxWidth: '1140px' }} className="">
        <p className="welcome_txt text-left px-0">歡迎登入</p>
        <Row className="text-center m-0 p-0 justify-content-between">
          <Col md={2} xs={5} className="px-0">
            <Link className="home_btn w-100" to="/home/transaction/buy">
              <div className="trade"></div>
              <p>買賣</p>
            </Link>
          </Col>
          <Col md={2} xs={5} className="px-0">
            <Link className="home_btn w-100" to="/home/transaction/transfer">
              <div className="i_01"></div>
              <p>轉賬</p>
            </Link>
          </Col>

          <Col md={2} xs={5} className="px-0">
            <Link className="home_btn w-100" to="/home/wallet">
              <div className="i_wallet"></div>
              <p>我的錢包</p>
            </Link>
          </Col>
          <Col md={2} xs={5} className="px-0">
            <Link className="home_btn w-100" to="/home/history">
              <div className="i_trans"></div>
              <p>交易紀錄</p>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
