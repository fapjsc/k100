import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import validator from 'validator';

import Home from './../../../pages/Home';

import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

export default class LoginForm extends Component {
  state = {
    phoneNumber: {
      val: '',
      isValid: true,
    },
    password: {
      val: '',
      isValid: true,
    },
    error: [],
    isLoading: false,
    formIsValid: true,
  };

  // 驗證函數
  validateForm = () => {
    this.setState({
      formIsValid: true,
      error: [],
    });

    const { phoneNumber, password } = this.state;

    let error = [];

    // 驗證電話號碼
    if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
      error.push('請輸入有效的電話號碼');
      this.setState({
        phoneNumber: {
          val: '',
          isValid: false,
        },
        formIsValid: false,
        error,
      });
    }

    //驗證密碼
    if (password.val === '' || !validator.isAlphanumeric(password.val)) {
      error.push('密碼只能是英文及數字');
      this.setState({
        password: {
          val: '',
          isValid: false,
        },
        formIsValid: false,
        error,
      });
    }
  };

  // 保存使用者輸入的密碼到state
  setPassword = event => {
    this.setState({
      password: {
        val: event.target.value.trim(),
        isValid: true,
      },
    });
  };

  // 保存使用者輸入的手機號碼到state
  setPhoneNumber = event => {
    this.setState({
      phoneNumber: {
        val: event.target.value.trim(),
        isValid: true,
      },
    });
  };

  // 表單提交
  handleLoginSubmit = async event => {
    const { formIsValid, error, isLogin } = this.state;
    event.preventDefault(); //防止表單提交

    this.validateForm();

    if (!formIsValid) {
      return;
    }

    console.log(error);
    // const { phoneNumber, password } = this.state;

    // let loginApi = '/j/login.aspx';

    // try {
    //   const res = await fetch(loginApi, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       Login_countrycode: 86,
    //       Login_tel: phoneNumber,
    //       Login_pwd: password,
    //     }),
    //   });

    //   const resData = await res.json();
    //   console.log(resData);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  render() {
    const { password, phoneNumber } = this.state;
    console.log(phoneNumber.isValid);
    return (
      <div className="form-container">
        <Form>
          <Form.Control as="select" defaultValue="區號" className="form-input">
            <option>區號</option>
            <option>台灣 ＋886</option>
            <option>中國 ＋86</option>
            <option>香港 ＋852</option>
          </Form.Control>

          <Form.Group controlId="formBasicPhoneNumber">
            <Form.Control
              isInvalid={!phoneNumber.isValid}
              className="form-input"
              size="lg"
              type="tel"
              placeholder="電話號碼"
              onChange={this.setPhoneNumber}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              isInvalid={!password.isValid}
              className="form-input"
              size="lg"
              type="password"
              placeholder="密碼"
              onChange={this.setPassword}
            />
          </Form.Group>

          {this.state.error.length
            ? this.state.error.map(err => (
                <Form.Text className="text-muted form-text">{err}</Form.Text>
              ))
            : null}

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
            <Link to="/forget-pw" className="forget_pw-link">
              <span className="forget_pw"></span>
              忘記密碼
            </Link>
          </div>
        </Form>
      </div>
    );
  }
}
