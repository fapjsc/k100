import React, { Component } from 'react';

import SuccessRegister from '../successRegister';

import { Form, Button } from 'react-bootstrap';
import iAsk from '../../../../Assets/i_ask.png';
import './index.scss';

export default class ValidCode extends Component {
    state = {
        validNum: {
            val: null,
            isValid: false,
        },
        formIsValid: false,
        error: '',
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

        // this.setState({
        //     validNum: {
        //         val: event.target.value.trim(),
        //     },
        // });
    };

    valid = () => {
        let error = '';
        // if (this.state.validNum.val !== 6) {
        //     this.setState({
        //         error: '驗證碼錯誤',
        //         formIsValid: false,
        //     });
        // }
    };

    handleSubmit = async event => {
        event.preventDefault(); //防止表單提交

        this.setState({
            formIsValid: true,
        });
        await this.valid();

        if (!this.state.formIsValid) {
            return;
        }
        const { validNum } = this.state;

        const timePwdApi = `/j/ChkoneTimePwd.aspx`;

        console.log(this.props, validNum);

        try {
            const res = await fetch(timePwdApi, {
                method: 'POST',
                body: JSON.stringify({
                    reg_countrycode: this.props.countryCode.toString(),
                    reg_tel: this.props.phoneNumber.substr(1),
                    OneTimePwd: validNum.val,

                    // 測試用
                    // OneTimePwd: '067942',
                    // reg_tel: '938265860',
                    // reg_countrycode: '886',
                }),
            });

            const resData = await res.json();

            const { data } = resData;

            if (resData.code === 200) {
                const regClientApi = `/j/req_RegClient.aspx`;
                const resClient = await fetch(regClientApi, {
                    method: 'POST',
                    body: JSON.stringify({
                        reg_countrycode: this.props.countryCode.toString(),
                        reg_tel: this.props.phoneNumber.substr(1),
                        reg_pwd: this.props.password,
                        reg_token: data,
                    }),
                });

                const resClientData = await resClient.json();

                if (resClientData.code === 200) {
                    this.props.history.replace('/auth/login');
                } else {
                    alert(resClientData.msg);
                }

                try {
                } catch (error) {
                    alert(error);
                }
            }

            console.log(resData);
        } catch (error) {
            alert(error);
        }
    };

    render() {
        const { validNum, error } = this.state;

        return (
            <>
                <Form className="w_400 mx-auto">
                    <Form.Group controlId="formBasicValidCode">
                        <Form.Label className="mb-4 fs_15">
                            已發送一次性驗證碼到登記的電話號碼
                        </Form.Label>
                        <Form.Control
                            placeholder="一次性驗證碼"
                            className="form-input"
                            onChange={this.setValidNum}
                            autoComplete="off"
                            type="number"
                        />
                        {error ? <Form.Text className="text-muted">{error}</Form.Text> : null}
                    </Form.Group>

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
                    <Button variant="outline-primary" className="mt-4">
                        <img src={iAsk} alt="ask icon" className="askIcon" />
                        重新發送驗證碼
                    </Button>
                </Form>
            </>
        );
    }
}
