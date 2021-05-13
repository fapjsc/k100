import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Components
import TheInstant from '../Instant/TheInstant';

// Style
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './index.scss';

export default class index extends Component {
  state = {
    agent: null,
  };
  componentDidMount() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.props.history.replace('/auth/login');
    }

    this.setState({
      agent: localStorage.getItem('agent'),
    });
  }

  render() {
    return (
      <Container style={{ maxWidth: '1140px' }} className="mt-4">
        <p className="welcome_txt text-left">歡迎登入</p>
        <Row className="text-center justify-content-between">
          <Col md={2} xs={5} className="">
            <Link className="home_btn w-100" to="/home/transaction/buy">
              <div className="trade"></div>
              <p>買賣</p>
            </Link>
          </Col>
          <Col md={2} xs={5} className="">
            <Link className="home_btn w-100" to="/home/transaction/transfer">
              <div className="i_01"></div>
              <p>轉賬</p>
            </Link>
          </Col>

          <Col md={2} xs={5} className="">
            <Link className="home_btn w-100" to="/home/wallet">
              <div className="i_wallet"></div>
              <p>我的錢包</p>
            </Link>
          </Col>
          <Col md={2} xs={5} className="">
            <Link className="home_btn w-100" to="/home/history">
              <div className="i_trans"></div>
              <p>交易紀錄</p>
            </Link>
          </Col>
        </Row>

        {this.state.agent && (
          <Row className="mt-4">
            <Col lg={12}>
              <TheInstant />
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
