import React, { Component } from 'react';
import ValidCode from './ValidCode';
import SliderCaptcha from '@slider-captcha/react';

import { Form, Button, Col } from 'react-bootstrap';

import validator from 'validator';

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

    handleAgree = event => {
        this.setState({
            agree: event.target.checked,
        });
    };

    validRegister = () => {
        console.log('valid');
        this.setState({
            formIsValid: true,
        });

        let error = [];
        const { phoneNumber, password, confirmPassword, agree } = this.state;

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

        await this.validRegister();

        const { formIsValid } = this.state;

        // console.log(formIsValid, 'formIsValid');
        // console.log(phoneNumber, 'phoneNumber');
        // console.log(password, 'password');
        // console.log(confirmPassword, 'confirm password');
        // console.log(agree, 'agree');
        // console.log(formErrors, 'form errors');

        if (!formIsValid) {
            return;
        }

        console.log('success register');
        this.setState({
            showValidCode: true,
        });
    };

    verifiedCallback = token => {
        console.log('Captcha token: ' + token);
    };

    render() {
        const { phoneNumber, password, formErrors, showValidCode, agree } = this.state;

        return (
            <div className="form-container">
                {!showValidCode ? (
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} md="3" controlId="CountryCode">
                                <Form.Control
                                    disabled
                                    // as="select"
                                    value="86"
                                    className="form-input"
                                >
                                    {/* <option>區號</option> */}
                                    {/* <option>台灣 ＋886</option> */}
                                    {/* <option>86</option> */}
                                    {/* <option>香港 ＋852</option> */}
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

                        <Form.Group controlId="formBasicCheckbox" className="user-agreement">
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
                        <div className="mt_ssm">
                            <SliderCaptcha
                                create="https://example.com/captcha/create"
                                verify="https://example.com/captcha/verify"
                                callback={this.verifiedCallback}
                            />
                        </div>

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
                ) : (
                    <ValidCode />
                )}
            </div>
        );
    }
}
