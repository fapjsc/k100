import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { Form, Col } from 'react-bootstrap';
import './index.scss';
import { Fragment } from 'react';

export default class LoginForm extends Component {
  state = {
    countryCode: {
      val: null,
      isValid: true,
      error: '',
    },
    phoneNumber: {
      val: '',
      isValid: true,
      error: '',
    },
    password: {
      val: '',
      isValid: true,
      error: '',
    },
    formIsValid: false,
  };

  // 驗證函數
  validateForm = async () => {
    this.setState({
      formIsValid: true,
    });

    const { phoneNumber, password, countryCode } = this.state;

    // 驗證區碼
    if (countryCode.val === null) {
      this.setState({
        countryCode: {
          val: null,
          isValid: false,
          error: '請選擇區碼',
        },
        formIsValid: false,
      });
    }

    // 驗證電話號碼
    if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
      this.setState({
        phoneNumber: {
          val: '',
          isValid: false,
          error: '請輸入有效的電話號碼',
        },
        formIsValid: false,
      });
    }

    //驗證密碼
    if (password.val === '' || !validator.isAlphanumeric(password.val) || password.val.length < 6) {
      this.setState({
        password: {
          val: '',
          isValid: false,
          error: '密碼只能是英文及數字，且至少六位數',
        },
        formIsValid: false,
      });
    }
  };

  // 保存區碼
  setCountryCode = event => {
    const { target } = event;

    if (target.value.includes('台灣')) {
      this.setState({
        countryCode: {
          val: 886,
          isValid: true,
          error: '',
        },
      });
    } else if (target.value.includes('中國')) {
      this.setState({
        countryCode: {
          val: 86,
          isValid: true,
          error: '',
        },
      });
    } else if (target.value.includes('香港')) {
      this.setState({
        countryCode: {
          val: 852,
          isValid: true,
          error: '',
        },
      });
    } else {
      this.setState({
        countryCode: {
          val: null,
          isValid: false,
        },
      });
    }
  };
  // 保存使用者輸入的密碼到state
  setPassword = event => {
    this.setState({
      password: {
        val: event.target.value.trim(),
        isValid: true,
        error: '',
      },
    });
  };

  // 保存使用者輸入的手機號碼到state
  setPhoneNumber = event => {
    this.setState({
      phoneNumber: {
        val: event.target.value.trim(),
        isValid: true,
        error: '',
      },
    });
  };

  // 表單提交
  handleLoginSubmit = async event => {
    event.preventDefault(); //防止表單提交

    await this.validateForm();
    const { formIsValid, phoneNumber, password, countryCode } = this.state;
    const { setLoadingState, setLoginErr } = this.props;

    if (!formIsValid) {
      return;
    }

    setLoadingState(true);
    let loginApi = '/j/login.aspx';

    try {
      const res = await fetch(loginApi, {
        method: 'POST',
        body: JSON.stringify({
          Login_countrycode: countryCode.val,
          Login_tel: phoneNumber.val,
          Login_pwd: password.val,
        }),
      });

      const resData = await res.json();

      if (resData.code === '10') {
        setLoginErr(true, '帳號或密碼錯誤');
        setLoadingState(false);
        return;
      }

      if (resData.code === 200) {
        const {
          data: { login_session },
        } = resData;

        setLoadingState(false);
        localStorage.setItem('token', login_session);
        this.props.setUserAuth(login_session);
      } else {
        setLoginErr(true, resData.msg);
        setLoadingState(false);
      }
    } catch (error) {
      setLoadingState(false);
      alert('無法連接server');
    }
  };

  render() {
    const { password, phoneNumber, countryCode } = this.state;

    return (
      <Fragment>
        <div className="form-container">
          <Form>
            <Form.Row>
              <Form.Group as={Col} md="3" controlId="CountryCode">
                <Form.Control
                  as="select"
                  defaultValue="區號"
                  className="form-select mb-4 pl-2"
                  onChange={this.setCountryCode}
                  isInvalid={countryCode.error}
                >
                  <option disabled>區號</option>
                  <option>中國＋86</option>
                  <option>台灣＋886</option>
                  <option>香港＋852</option>
                </Form.Control>
                {countryCode.error && (
                  <Form.Text className="mb-4">{`*${countryCode.error}`}</Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} md="9" controlId="formBasicPhoneNumber">
                <Form.Control
                  isInvalid={phoneNumber.error}
                  className="form-select mb-4"
                  size="lg"
                  type="tel"
                  placeholder="手機號碼"
                  onChange={this.setPhoneNumber}
                  autoComplete="off"
                />
                {phoneNumber.error && (
                  <Form.Text className="mb-4">{`*${phoneNumber.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12} controlId="formBasicPassword">
                <Form.Control
                  isInvalid={password.error}
                  className="form-select mb-4"
                  size="lg"
                  type="password"
                  placeholder="密碼"
                  onChange={this.setPassword}
                  autoComplete="off"
                />
                {password.error && <Form.Text className="mb-4">{`*${password.error}`}</Form.Text>}
              </Form.Group>
            </Form.Row>

            <button
              onClick={this.handleLoginSubmit}
              style={{
                display: 'block',
                width: '100%',
              }}
              className="easy-btn"
              type="submit"
            >
              登入
            </button>
            <div className="forget_pw-box">
              <Link to="/forget-pw" className="forget_pw-link">
                <span className="forget_pw"></span>
                <u>忘記密碼</u>
              </Link>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}
