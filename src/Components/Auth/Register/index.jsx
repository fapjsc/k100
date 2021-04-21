import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import validator from 'validator';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

import ValidCode from './ValidCode';
import BaseSpinner from '../../Ui/BaseSpinner';

import { Form, Button, Col } from 'react-bootstrap';
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
    agree: false,
    formIsValid: false,
    isLoading: false,
    showValidCode: false,
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
      });
    }

    if (e.target.value.includes('台灣')) {
      this.setState({
        countryCode: {
          val: 886,
          isValid: true,
          error: '',
        },
      });
    }
    if (e.target.value.includes('香港')) {
      this.setState({
        countryCode: {
          val: 852,
          isValid: true,
          error: '',
        },
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

    if (password.val !== confirmPassword.val) {
      this.setState({
        formIsValid: false,
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

  handleRegisterSubmit = async event => {
    event.preventDefault(); //防止表單提交

    await this.validRegister();

    const { formIsValid } = this.state;

    if (!formIsValid) {
      return;
    }

    this.setState(
      {
        showValidCode: true,
      },
      () => {
        this.props.history.replace('/auth/register/valid');
      }
    );
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
                      className="form-select mb-4 pl-2"
                      onChange={this.setCountryCode}
                      isInvalid={!countryCode.isValid}
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
                      <Form.Text className="mb-4">{`*${phoneNumber.error}`}</Form.Text>
                    )}
                  </Form.Group>
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
                      <Form.Text className="mb-4">{`*${password.error}`}</Form.Text>
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
                      <Form.Text className="mb-4">{`*${confirmPassword.error}`}</Form.Text>
                    )}
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} xl={12}>
                    <Form.Control
                      isInvalid={captcha.error}
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
                  variant={!agree ? 'secondary' : 'primary'}
                  block
                  type="submit"
                  disabled={!agree}
                >
                  下一步
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
