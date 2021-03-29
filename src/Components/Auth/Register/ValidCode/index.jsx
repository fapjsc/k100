import React, { Component } from 'react';

import SuccessRegister from '../successRegister';
import Countdown from 'react-countdown';

import ButtonTimer from './ButtonTimer';
import Spinner from '../../../Ui/BaseSpinner';

import { Form, Button, Col } from 'react-bootstrap';
// import iAsk from '../../../../Assets/i_ask.png';
import './index.scss';

export default class ValidCode extends Component {
    state = {
        validNum: {
            val: null,
            isValid: false,
        },
        formIsValid: false,
        error: '',
        resendValidCode: false,
        isLoading: false,
        isRegister: false,
    };

    setValidNum = event => {
        if (event.target.value.length === 6) {
            this.setState({
                validNum: {
                    val: event.target.value.trim(),
                    isValid: true,
                },
                error: '',
            });
        } else {
            this.setState({
                validNum: {
                    val: event.target.value.trim(),
                    isValid: false,
                },
                formIsValid: false,
            });
        }
    };

    getValidCode = async () => {
        this.setState({
            resendValidCode: true,
            isLoading: true,
        });

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

            if (resData.code !== 200) {
                this.setState({
                    isLoading: false,
                });
                alert(resData.msg);
                return;
            }

            if (resData.code === 200) {
                alert('驗證碼已經發送');
            }

            this.setState({
                isLoading: false,
            });
        } catch (error) {
            this.setState({
                isLoading: false,
            });
            alert(error);
        }
    };

    handleSubmit = async event => {
        event.preventDefault(); //防止表單提交

        const { validNum } = this.state;
        let { phoneNumber, countryCode, password } = this.props;

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
                this.registerClient(token, countryCode, phoneNumber, password);
            } else {
                alert(resData.msg);
            }
        } catch (error) {
            this.setState({
                isLoading: false,
            });
            alert(error);
        }
    };

    registerClient = async (token, countryCode, phoneNumber, password) => {
        console.log('hi');
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

        if (resData.code !== 200) {
            this.setState(
                {
                    isLoading: false,
                },
                () => {
                    alert(resData.msg);
                }
            );
            this.props.history.replace('/auth/login');
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
        const { validNum, error, resendValidCode, isLoading, isRegister } = this.state;

        return (
            <>
                {isLoading ? (
                    <Spinner />
                ) : isRegister && !isLoading ? (
                    <SuccessRegister />
                ) : (
                    <Form className="w_400 mx-auto">
                        <Form.Row className="align-items-center">
                            <Col xs="9">
                                <Form.Group controlId="formBasicValidCode">
                                    <Form.Label className="mb-4 fs_15">
                                        點擊按鈕後發送驗證碼
                                    </Form.Label>
                                    <Form.Control
                                        placeholder="一次性驗證碼"
                                        className="form-input"
                                        onChange={this.setValidNum}
                                        autoComplete="off"
                                        type="number"
                                    />
                                    {error ? (
                                        <Form.Text className="text-muted">{error}</Form.Text>
                                    ) : null}
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
                                    date={Date.now() + 10000}
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
                            onClick={this.handleSubmit}
                            // variant="primary"
                            variant={!validNum.isValid ? 'secondary' : 'primary'}
                            type="submit"
                            size="lg"
                            block
                            className="fs_20"
                            disabled={!validNum.isValid}
                        >
                            確定
                        </Button>
                    </Form>
                )}
            </>
        );
    }
}
