import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator';

// import Home from './../../../pages/Home';

import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

export default class LoginForm extends Component {
  

  state = {
    Login_countrycode: '',
    phoneNumber: {
      val: '',
      isValid: true,
    },
    password: {
      val: '',
      isValid: true,
    },
    error: [],
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
    if (password.val === '' || !validator.isAlphanumeric(password.val) || password.val < 6) {
      error.push('密碼只能是英文及數字，且至少六位數');
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

  // 保存區碼
  setCountryCode = event => {
    this.setState({
      Login_countrycode: event.target.value
    })
  }

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
    const { formIsValid, phoneNumber, password } = this.state;
    event.preventDefault(); //防止表單提交

    this.validateForm();

    if (!formIsValid) {
      return;
    }

    let loginApi = '/j/login.aspx';



    try {
      const res = await fetch(loginApi, {
        method: 'POST',
        body: JSON.stringify({
          Login_countrycode: 86,
          Login_tel: phoneNumber.val,
          Login_pwd: password.val,
        }),
      });

      const resData = await res.json();

      const {data:{login_session}} = resData 

      localStorage.setItem('token', login_session)

      
      this.props.setUserAuth(login_session)

    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { password, phoneNumber } = this.state;
    return (
      <div className="form-container">
        <Form>
          <Form.Control as="select" defaultValue="區號" className="form-input"  onChange={this.setCountryCode}>
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
            ? this.state.error.map((err, index) => (
                <Form.Text key={index} className="text-muted form-text">{err}</Form.Text>
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
