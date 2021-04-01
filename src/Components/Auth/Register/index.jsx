import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import validator from 'validator';

import ValidCode from './ValidCode';
import BaseSpinner from '../../Ui/BaseSpinner';

import { Form, Button, Col } from 'react-bootstrap';
import './index.scss';

export default class index extends Component {
    state = {
        phoneNumber: {
            val: '',
            isValid: true,
        },
        password: {
            val: '',
            isValid: true,
        },
        confirmPassword: {
            val: '',
            isValid: true,
        },
        countryCode: {
            val: '',
            isValid: true,
        },
        agree: false,
        formIsValid: false,
        isLoading: false,
        formErrors: [],
        showValidCode: false,
    };

    setPhoneNumber = event => {
        this.setState({
            phoneNumber: {
                val: event.target.value.trim(),
                isValid: true,
            },
        });
    };

    setPassword = event => {
        this.setState({
            password: {
                val: event.target.value.trim(),
                isValid: true,
            },
        });
    };

    setConfirmPassword = event => {
        this.setState({
            confirmPassword: {
                val: event.target.value.trim(),
                isValid: true,
            },
        });
    };

    setCountryCode = e => {
        if (e.target.value.includes('中國')) {
            this.setState({
                countryCode: {
                    val: 86,
                    isValid: true,
                },
            });
        }

        if (e.target.value.includes('台灣')) {
            this.setState({
                countryCode: {
                    val: 886,
                    isValid: true,
                },
            });
        }
        if (e.target.value.includes('香港')) {
            this.setState({
                countryCode: {
                    val: 852,
                    isValid: true,
                },
            });
        }
    };

    handleAgree = event => {
        this.setState({
            agree: event.target.checked,
        });
    };

    validRegister = () => {
        this.setState({
            formIsValid: true,
        });

        let error = [];
        const { phoneNumber, password, confirmPassword, agree, countryCode } = this.state;

        //驗證區碼
        if (countryCode.val === '' || countryCode.val === null) {
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

        if (password.val !== confirmPassword.val) {
            error.push('兩次密碼不一致');

            this.setState({
                formIsValid: false,
                formErrors: [...error],
            });

            return;
        } else {
            error.filter(e => e === '兩次密碼不一致');
        }

        if (!agree) {
            error.push('請勾選用戶協議');
            this.setState({
                formIsValid: false,
                formErrors: [...error],
            });
            return;
        } else {
            error.filter(e => e === '請勾選用戶協議');
        }
    };

    handleRegisterSubmit = async event => {
        event.preventDefault(); //防止表單提交

        this.setState({
            isLoading: true,
        });

        await this.validRegister();

        const { formIsValid } = this.state;

        if (!formIsValid) {
            this.setState({
                isLoading: false,
            });
            return;
        }

        this.setState(
            {
                showValidCode: true,
                isLoading: false,
            },
            () => {
                this.props.history.replace('/auth/register/valid');
            }
        );

        // const { phoneNumber, countryCode } = this.state;

        // const registerApi = `/j/Req_oneTimePwd.aspx`;

        // if (countryCode.val === 886) {
        //     phoneNumber.val = phoneNumber.val.substr(1);
        // }

        // console.log(countryCode.val, phoneNumber.val);

        // try {
        //     const res = await fetch(registerApi, {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             reg_countrycode: countryCode.val,
        //             reg_tel: phoneNumber.val,
        //         }),
        //     });

        //     const resData = await res.json();

        //     if (resData.code === 200) {
        //         this.setState(
        //             {
        //                 showValidCode: true,
        //             },
        //             () => {
        //                 this.props.history.replace('/auth/register/valid');
        //             }
        //         );
        //     } else {
        //         this.props.history.replace('/auth/register');
        //         alert(resData);
        //     }

        //     console.log(resData, '=======');
        //     this.setState({
        //         isLoading: false,
        //     });
        // } catch (error) {
        //     this.setState({
        //         isLoading: false,
        //     });
        //     alert(error);
        // }
    };

    componentDidMount() {
        if (!this.state.showValidCode) {
            this.props.history.replace('/auth/register');
        }
    }

    render() {
        const {
            phoneNumber,
            password,
            formErrors,
            showValidCode,
            agree,
            countryCode,
            isLoading,
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
                                            className="form-input"
                                            size="lg"
                                            type="tel"
                                            placeholder="手機號碼"
                                            onChange={this.setPhoneNumber}
                                            isInvalid={!phoneNumber.isValid}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control
                                        className="form-input"
                                        size="lg"
                                        type="password"
                                        placeholder="設置密碼"
                                        onChange={this.setPassword}
                                        isInvalid={!password.isValid}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Control
                                        className="form-input"
                                        size="lg"
                                        type="password"
                                        placeholder="確認密碼"
                                        onChange={this.setConfirmPassword}
                                    />
                                </Form.Group>

                                <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="user-agreement"
                                >
                                    <Form.Check
                                        className="user-agreement__check"
                                        type="checkbox"
                                        label="我已閱讀並同意"
                                        onChange={this.handleAgree}
                                    />
                                    <span>{`《用戶協議》`}</span>
                                </Form.Group>

                                {formErrors.length
                                    ? formErrors.map((err, index) => (
                                          <Form.Text key={index} className="text-muted form-text">
                                              {err}
                                          </Form.Text>
                                      ))
                                    : null}

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
