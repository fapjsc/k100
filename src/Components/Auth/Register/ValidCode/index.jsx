import React, { Component } from 'react';

import SuccessRegister from '../successRegister';
import Countdown from 'react-countdown';

import ButtonTimer from './ButtonTimer';
import Spinner from '../../../Ui/BaseSpinner';

import { Form, Button, Col } from 'react-bootstrap';
// import iAsk from '../../../../Assets/i_ask.png';
import './index.scss';
import { Fragment } from 'react';

export default class ValidCode extends Component {
  state = {
    validNum: {
      val: '',
    },
    formIsValid: false,
    error: '',
    resendValidCode: false,
    isLoading: false,
    isRegister: false,
    inputValid: false,
    alreadyRegister: false,
  };

  setValidNum = event => {
    if (event.target.value.length === 6) {
      this.setState(
        {
          validNum: {
            val: event.target.value.trim(),
          },
          error: '',
          inputValid: true,
        },
        () => {
          this.handleSubmit();
        }
      );
    } else {
      this.setState({
        validNum: {
          val: event.target.value.trim(),
        },
        formIsValid: false,
        error: '',
        inputValid: true,
      });
    }
  };

  componentWillUnmount() {
    localStorage.removeItem('expiresIn');
  }

  getValidCode = async () => {
    this.setState({
      resendValidCode: true,
      isLoading: true,
    });

    // setTimeout(() => {
    //     this.setState({
    //         isLoading: false,
    //     });
    // }, 0);

    const expiresStamp = 120000;
    const expiresDate = Date.now() + expiresStamp;

    localStorage.setItem('expiresIn', expiresDate);

    let { phoneNumber, countryCode } = this.props;
    const registerApi = `/j/Req_oneTimePwd.aspx`;
    if (countryCode === 886) {
      phoneNumber = phoneNumber.substr(1);
    }
    try {
      const res = await fetch(registerApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
        }),
      });
      const resData = await res.json();

      console.log(resData);

      this.setState({
        isLoading: false,
      });

      if (resData.code !== 200) {
        this.setState({
          isLoading: false,
          error: resData.msg,
        });
        return;
      }
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      alert(error);
    }
  };

  handleSubmit = async () => {
    // event.preventDefault(); //防止表單提交

    const { validNum } = this.state;
    let { phoneNumber, countryCode } = this.props;

    if (countryCode === 886) {
      phoneNumber = phoneNumber.substr(1);
    }

    const timePwdApi = `/j/ChkoneTimePwd.aspx`;

    try {
      const res = await fetch(timePwdApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
          OneTimePwd: validNum.val,
        }),
      });

      const resData = await res.json();

      this.setState({
        isLoading: false,
      });

      if (resData.code === 200) {
        const token = resData.data;

        this.setState({
          validNum: {
            val: validNum.val,
          },
          error: '',
          token,
          formIsValid: true,
        });

        // this.registerClient(token, countryCode, phoneNumber, password);
      } else {
        this.setState({
          validNum: {
            val: '',
          },
          error: '*驗證碼錯誤',
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
        error: error,
      });
    }
  };

  registerClient = async (token, countryCode, phoneNumber, password) => {
    this.setState({
      isLoading: true,
    });

    const registerClientApi = `/j/req_RegClient.aspx`;

    const res = await fetch(registerClientApi, {
      method: 'POST',
      body: JSON.stringify({
        reg_countrycode: countryCode,
        reg_tel: phoneNumber,
        reg_pwd: password,
        reg_token: token,
      }),
    });

    const resData = await res.json();

    console.log(resData);

    // 已經註冊過了
    if (resData.code === '11') {
      this.setState({
        isRegister: true,
        alreadyRegister: true,
        isLoading: false,
      });
    }

    if (resData.code !== 200) {
      this.setState({
        isLoading: false,
        error: resData.msg,
      });
      return;
    }

    if (resData.code === 200) {
      this.setState({
        isLoading: false,
        isRegister: true,
      });
    }
  };

  render() {
    const {
      validNum,
      error,
      resendValidCode,
      isLoading,
      isRegister,
      token,
      formIsValid,
      inputValid,
      alreadyRegister,
    } = this.state;
    let { phoneNumber, countryCode, password } = this.props;

    let timer;

    timer = localStorage.getItem('expiresIn') - Date.now();

    return (
      <Fragment>
        {isLoading ? (
          <Spinner />
        ) : isRegister && !isLoading ? (
          <SuccessRegister alreadyRegister={alreadyRegister} />
        ) : (
          <Form className="w_400 mx-auto">
            <Form.Row className="align-items-center">
              <Col xs="9">
                <Form.Group controlId="formBasicValidCode">
                  <Form.Label className="mb-4 fs_15">點擊按鈕後發送驗證碼</Form.Label>
                  <Form.Control
                    placeholder="一次性驗證碼"
                    className="form-input"
                    onChange={this.setValidNum}
                    value={validNum.val}
                    autoComplete="off"
                    type="number"
                    isValid={formIsValid}
                  />
                  {error ? <Form.Text className="text-muted">{error}</Form.Text> : null}
                </Form.Group>
              </Col>
              <Col xs="3">
                {/* <Button
                                className="mt-4"
                                variant="primary"
                                variant={resendValidCode ? 'primary' : 'secondary'}
                                onClick={this.getValidCode}
                                disabled={!resendValidCode}
                            >
                                發送驗證碼
                            </Button> */}

                <Countdown
                  date={timer <= 0 && !inputValid ? Date.now() + 120000 : Date.now() + timer}
                  renderer={props => (
                    <ButtonTimer
                      resendValidCode={resendValidCode}
                      getValidCode={this.getValidCode}
                      {...props}
                    />
                  )}
                  className="mt-4"
                ></Countdown>
              </Col>
            </Form.Row>

            <Button
              onClick={() => this.registerClient(token, countryCode, phoneNumber, password)}
              // variant="primary"
              variant={!formIsValid ? 'secondary' : 'primary'}
              type="submit"
              size="lg"
              block
              className="fs_20"
              disabled={!formIsValid}
            >
              確定
            </Button>
          </Form>
        )}
      </Fragment>
    );
  }
}
