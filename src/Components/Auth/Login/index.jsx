import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { Form, Button, Col } from 'react-bootstrap';
import './index.scss';
import { Fragment } from 'react';

export default class LoginForm extends Component {
    state = {
        countryCode: {
            val: null,
            isValid: true,
        },
        phoneNumber: {
            val: '',
            isValid: true,
        },
        password: {
            val: '',
            isValid: true,
        },
        formErrors: [],
        formIsValid: false,
    };

    // 驗證函數
    validateForm = async () => {
        this.setState({
            formIsValid: true,
            formErrors: [],
        });

        const { phoneNumber, password, countryCode } = this.state;

        let error = [];

        // 驗證區碼
        if (countryCode.val === null) {
            error.push('請選擇區碼');

            this.setState({
                countryCode: {
                    val: null,
                    isValid: false,
                },
                formIsValid: false,
                formErrors: [...error],
            });
        }

        // 驗證電話號碼
        if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
            error.push('請輸入有效的電話號碼');
            this.setState({
                phoneNumber: {
                    val: '',
                    isValid: false,
                },
                formIsValid: false,
                formErrors: [...error],
            });
        }

        //驗證密碼
        if (
            password.val === '' ||
            !validator.isAlphanumeric(password.val) ||
            password.val.length < 6
        ) {
            error.push('密碼只能是英文及數字，且至少六位數');
            this.setState({
                password: {
                    val: '',
                    isValid: false,
                },
                formIsValid: false,
                formErrors: [...error],
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
                },
            });
        } else if (target.value.includes('中國')) {
            this.setState({
                countryCode: {
                    val: 86,
                    isValid: true,
                },
            });
        } else if (target.value.includes('香港')) {
            this.setState({
                countryCode: {
                    val: 852,
                    isValid: true,
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

            // console.log(resData);

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
            setLoginErr(true, error);
        }
    };

    render() {
        const { password, phoneNumber, formErrors, countryCode } = this.state;

        return (
            <Fragment>
                <div className="form-container">
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} md="3" controlId="CountryCode">
                                <Form.Control
                                    as="select"
                                    defaultValue="區號"
                                    className="form-select"
                                    onChange={this.setCountryCode}
                                    isInvalid={!countryCode.isValid}
                                >
                                    <option>區號</option>
                                    <option>中國＋86</option>
                                    <option>台灣＋886</option>
                                    <option>香港＋852</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} md="9" controlId="formBasicPhoneNumber">
                                <Form.Control
                                    isInvalid={!phoneNumber.isValid}
                                    className="form-input"
                                    size="lg"
                                    type="tel"
                                    placeholder="手機號碼"
                                    onChange={this.setPhoneNumber}
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                isInvalid={!password.isValid}
                                className="form-input"
                                size="lg"
                                type="password"
                                placeholder="密碼"
                                onChange={this.setPassword}
                                autoComplete="off"
                            />
                        </Form.Group>

                        {formErrors.length
                            ? formErrors.map((err, index) => (
                                  <Form.Text key={index} className="text-muted form-text">
                                      {err}
                                  </Form.Text>
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
                                <u>忘記密碼</u>
                            </Link>
                        </div>
                    </Form>
                </div>
            </Fragment>
        );
    }
}
