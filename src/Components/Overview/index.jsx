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
      <Container>
        <p className="welcome_txt text-left">歡迎登入</p>
        <Row className="text-center">
          <Col lg={3} md={6} sm={6} xs={6}>
            <Link className="home_btn" to="/home/transaction">
              <div className="trade"></div>
              <p>買賣</p>
            </Link>
          </Col>
          <Col lg={3} md={6} sm={6} xs={6}>
            <Link className="home_btn" to="/home/transaction/transfer">
              <div className="i_01"></div>
              <p>轉賬</p>
            </Link>
          </Col>

          <Col lg={3} md={6} sm={6} xs={6}>
            <Link className="home_btn" to="/home/wallet">
              <div className="i_wallet"></div>
              <p>我的錢包</p>
            </Link>
          </Col>
          <Col lg={3} md={6} sm={6} xs={6}>
            <Link className="home_btn" to="/home/history">
              <div className="i_trans"></div>
              <p>交易紀錄</p>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
