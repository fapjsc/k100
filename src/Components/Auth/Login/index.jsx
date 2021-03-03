import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import BaseCard from '../../../Components/Ui/BaseCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

export default class LoginForm extends Component {
  state = {
    phoneNumber: '',
    password: '',
    error: '',
  };

  // 保存使用者輸入的手機號碼到state
  setPhoneNumber = event => {
    this.setState({
      phoneNumber: event.target.value,
    });
  };

  // 保存使用者輸入的密碼到state
  setPassword = event => {
    this.setState({
      password: event.target.value,
    });
  };

  // 表單提交
  handleLoginSubmit = event => {
    event.preventDefault(); //防止表單提交
    const { phoneNumber, password } = this.state;
    console.log(`手機：${phoneNumber} 密碼：${password}`);
  };

  render() {
    return (
      <div className="form-bg">
        <BaseCard>
          <h4 className="text-center p-4">登入帳號</h4>
          <Form>
            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Control
                className="form-input"
                size="lg"
                type="tel"
                placeholder="手機號碼"
                onChange={this.setPhoneNumber}
              />
              {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                className="form-input"
                size="lg"
                type="password"
                placeholder="密碼"
                onChange={this.setPassword}
              />
            </Form.Group>

            <Button
              onClick={this.handleLoginSubmit}
              className="form-btn"
              variant="primary"
              block
              type="submit"
            >
              登入
            </Button>
            <div className="forget_pw-box">
              <span className="forget_pw"></span>
              <button href="#" className="forget_pw-link">
                忘記密碼
              </button>
            </div>
          </Form>
        </BaseCard>
      </div>
    );
  }
}
