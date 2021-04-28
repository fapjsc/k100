import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import validator from 'validator';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

import ValidCode from './ValidCode';
import BaseSpinner from '../../Ui/BaseSpinner';

import { Form, Button, Col, Fade, Spinner } from 'react-bootstrap';

import './index.scss';

export default class index extends Component {
  state = {
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
    confirmPassword: {
      val: '',
      isValid: true,
      error: '',
    },
    countryCode: {
      val: '',
      isValid: true,
      error: '',
    },
    captcha: {
      val: '',
      isValid: true,
      error: '',
    },
    checkAccountErr: '',
    agree: false,
    formIsValid: false,
    isLoading: false,
    showValidCode: false,
    showAlert: false,
    btnLoading: false,
  };

  setPhoneNumber = event => {
    this.setState({
      phoneNumber: {
        val: event.target.value.trim(),
        isValid: true,
        error: '',
      },
    });
  };

  setPassword = event => {
    this.setState({
      password: {
        val: event.target.value.trim(),
        isValid: true,
        error: '',
      },
    });
  };

  setConfirmPassword = event => {
    this.setState({
      confirmPassword: {
        val: event.target.value.trim(),
        isValid: true,
        error: '',
      },
    });
  };

  setCountryCode = e => {
    if (e.target.value.includes('中國')) {
      this.setState({
        countryCode: {
          val: 86,
          isValid: true,
          error: '',
        },
        showAlert: true,
      });
    }

    if (e.target.value.includes('台灣')) {
      this.setState({
        countryCode: {
          val: 886,
          isValid: true,
          error: '',
        },
        showAlert: false,
      });
    }
    if (e.target.value.includes('香港')) {
      this.setState({
        countryCode: {
          val: 852,
          isValid: true,
          error: '',
        },
        showAlert: false,
      });
    }
  };

  handleAgree = event => {
    this.setState({
      agree: event.target.checked,
    });
  };

  validRegister = async () => {
    this.setState({
      formIsValid: true,
    });

    const { phoneNumber, password, confirmPassword, countryCode } = this.state;

    // captcha
    if (!validateCaptcha(this.state.captcha.val)) {
      this.setState({
        captcha: {
          val: '',
          isValid: false,
          error: '驗證碼錯誤',
        },
        formIsValid: false,
        btnLoading: false,
      });
    }

    //驗證區碼
    if (countryCode.val === '' || countryCode.val === null) {
      this.setState({
        countryCode: {
          val: null,
          isValid: false,
          error: '請選擇區碼',
        },
        formIsValid: false,
        btnLoading: false,
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
        btnLoading: false,
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
        btnLoading: false,
      });
    }

    if (password.val !== confirmPassword.val) {
      this.setState({
        formIsValid: false,
        btnLoading: false,
        confirmPassword: {
          val: confirmPassword.val,
          isValid: false,
          error: '兩次密碼不一致',
        },
      });
    }
  };

  gotToAgreePage = () => {
    this.props.history.push('/agreement');
  };

  checkAccountExists = async data => {
    const checkAccount = `/j/ChkLoginExists.aspx`;

    const res = await fetch(checkAccount, {
      method: 'POST',
      body: JSON.stringify({
        reg_countrycode: data.countryCode,
        reg_tel: data.phoneNumber,
      }),
    });

    const resData = await res.json();

    if (resData.code === 200) {
      this.setState(
        {
          showValidCode: true,
        },
        () => {
          this.props.history.replace('/auth/register/valid');
        }
      );
    }

    if (resData.code === '11') {
      this.setState({
        checkAccountErr: '此手機號碼已經註冊過',
        formIsValid: false,
      });
    }

    this.setState({
      btnLoading: false,
    });
  };

  handleRegisterSubmit = async event => {
    event.preventDefault(); //防止表單提交
    this.setState({
      btnLoading: true,
    });

    await this.validRegister();

    const { formIsValid } = this.state;

    if (!formIsValid) {
      return;
    }

    const data = {
      countryCode: this.state.countryCode.val,
      phoneNumber: this.state.phoneNumber.val,
    };

    this.checkAccountExists(data);
  };

  componentDidMount() {
    loadCaptchaEnginge(6);

    if (!this.state.showValidCode) {
      this.props.history.replace('/auth/register');
    }
  }

  render() {
    const {
      phoneNumber,
      password,
      showValidCode,
      confirmPassword,
      agree,
      countryCode,
      isLoading,
      captcha,
      checkAccountErr,
      btnLoading,
    } = this.state;

    return (
      <>
        {isLoading ? (
          <BaseSpinner />
        ) : (
          <div className="form-container">
            {!showValidCode ? (
              <Form>
                <Form.Row>
                  <Form.Group as={Col} md="4" controlId="CountryCode">
                    <Form.Control
                      style={{
                        fontSize: '17px',
                        color: '#495057',
                      }}
                      as="select"
                      defaultValue="區號"
                      className="form-select mb-4 pl-3"
                      onChange={this.setCountryCode}
                      isInvalid={!countryCode.isValid}
                    >
                      <option disabled>區號</option>
                      <option>中國＋86</option>
                      <option>台灣＋886</option>
                      <option>香港＋852</option>
                    </Form.Control>
                    {countryCode.error && (
                      <Form.Text
                        style={{
                          fontSize: '12px',
                        }}
                        className="mb-4"
                      >{`*${countryCode.error}`}</Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="8" controlId="formBasicPhoneNumber">
                    <Form.Control
                      className="form-select mb-4"
                      size="lg"
                      type="tel"
                      placeholder="手機號碼"
                      onChange={this.setPhoneNumber}
                      isInvalid={!phoneNumber.isValid}
                      autoComplete="off"
                    />
                    {phoneNumber.error && (
                      <Form.Text
                        style={{
                          fontSize: '12px',
                        }}
                        className="mb-4"
                      >{`*${phoneNumber.error}`}</Form.Text>
                    )}
                  </Form.Group>

                  {this.state.showAlert && (
                    <Fade in={this.state.showAlert}>
                      <div id="example-fade-text" className="text-danger">
                        <div className="d-flex align-items-center mb-2">
                          <svg
                            xmlns="../../../Assets/cone-striped.svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-cone-striped"
                            viewBox="0 0 16 16"
                          >
                            <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
                          </svg>
                          <p className="ml-3 mb-0">請注意！</p>
                        </div>
                        <p>
                          因您身處地區受當地電信條例限制，可能會較慢收到系統發出的簡訊，請耐心等候或是再重新申請一次
                        </p>
                      </div>
                    </Fade>
                  )}
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} xl={12} controlId="formBasicPassword">
                    <Form.Control
                      className="form-select mb-4"
                      size="lg"
                      type="password"
                      placeholder="設置密碼"
                      onChange={this.setPassword}
                      isInvalid={!password.isValid}
                    />
                    {password.error && (
                      <Form.Text
                        style={{
                          fontSize: '12px',
                        }}
                        className="mb-4"
                      >{`*${password.error}`}</Form.Text>
                    )}
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} xl={12} controlId="formConfirmPassword">
                    <Form.Control
                      className="form-select mb-4"
                      size="lg"
                      type="password"
                      placeholder="確認密碼"
                      onChange={this.setConfirmPassword}
                    />
                    {confirmPassword.error && (
                      <Form.Text
                        style={{
                          fontSize: '12px',
                        }}
                        className="mb-4"
                      >{`*${confirmPassword.error}`}</Form.Text>
                    )}
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} xl={12}>
                    <Form.Control
                      isInvalid={captcha.error}
                      style={{
                        fontSize: '12px',
                      }}
                      className="form-select mb-4"
                      size="lg"
                      placeholder="驗證碼區分大小寫"
                      value={this.state.captcha.val}
                      onChange={e =>
                        this.setState({
                          captcha: {
                            val: e.target.value,
                            isValid: true,
                            error: '',
                          },
                        })
                      }
                      autoComplete="off"
                    />
                    {captcha.error && (
                      <Form.Text
                        className="mb-4"
                        style={{ fontSize: '12px' }}
                      >{`*${captcha.error}`}</Form.Text>
                    )}

                    {checkAccountErr && (
                      <Form.Text
                        className="mb-4"
                        style={{ fontSize: '12px' }}
                      >{`*${checkAccountErr}`}</Form.Text>
                    )}
                    <LoadCanvasTemplate style={{ width: 150, height: 30 }} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group controlId="formBasicCheckbox" className="user-agreement">
                    <Form.Check
                      className="user-agreement__check"
                      type="checkbox"
                      label="我已閱讀並同意"
                      onChange={this.handleAgree}
                      checked={agree}
                    />
                    <span
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={this.gotToAgreePage}
                    >{`《用戶協議》`}</span>
                  </Form.Group>
                </Form.Row>

                <Button
                  onClick={this.handleRegisterSubmit}
                  className="form-btn"
                  // variant="primary"
                  variant={!agree || btnLoading ? 'secondary' : 'primary'}
                  block
                  type="submit"
                  disabled={!agree || btnLoading}
                >
                  {btnLoading && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="md"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {btnLoading ? '處理中..' : '下一步'}
                </Button>
              </Form>
            ) : null}

            <Switch>
              <Route
                path="/auth/register/valid"
                component={props => (
                  <ValidCode
                    phoneNumber={phoneNumber.val}
                    countryCode={countryCode.val}
                    password={password.val}
                    {...props}
                  />
                )}
              />
            </Switch>
          </div>
        )}
      </>
    );
  }
}
