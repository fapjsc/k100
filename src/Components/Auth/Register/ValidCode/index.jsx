import React, { Component } from 'react';

import SuccessRegister from '../successRegister';

import { Form, Button } from 'react-bootstrap';

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

        console.log(this.state, 'set');

        // this.setState({
        //     validNum: {
        //         val: event.target.value.trim(),
        //     },
        // });
    };

    valid = () => {
        let error = '';

        if (!this.state.validNum.val) {
            error = '驗證碼錯誤';
            this.setState({
                validNum: {
                    val: null,
                    isValid: false,
                },
                formIsValid: false,
                error,
            });
        } else if (this.state.validNum.val.length === 6) {
            this.setState({
                formIsValid: true,
                error: '',
            });
        } else {
            error = '驗證碼錯誤';
            this.setState({
                validNum: {
                    val: null,
                    isValid: false,
                },
                formIsValid: false,
                error,
            });
        }
    };

    handleSubmit = event => {
        // this.setState({
        //     formIsValid: true,
        // });
        event.preventDefault(); //防止表單提交
        // await this.valid();

        this.valid();

        if (!this.state.formIsValid) {
            return;
        }
        // let error = '';

        // if (!this.state.validNum.isValid && this.state.validNum.val !== 6) {
        //     this.setState({
        //         error: '驗證碼錯誤',
        //     });
        //     return;
        // }

        // if (this.state.validNum.isValid && this.state.validNum.val === 6) {
        //     console.log('hi');
        //     this.setState({
        //         formIsValid: true,
        //         error: '',
        //     });

        //     console.log('success');
        // } else {
        //     this.setState({
        //         error: '驗證碼錯誤',
        //     });
        // }
    };

    render() {
        console.log(this.props);
        const { validNum, error, formIsValid } = this.state;

        return (
            <>
                {formIsValid ? (
                    <SuccessRegister />
                ) : (
                    <Form className="w_400 mx-auto">
                        <Form.Group controlId="formBasicValidCode">
                            <Form.Label className="mb-4 fs_15">
                                已發送一次性驗證碼到登記的電話號碼
                            </Form.Label>
                            <Form.Control
                                isValid={validNum.isValid}
                                placeholder="一次性驗證碼"
                                className="form-input"
                                onChange={this.setValidNum}
                                autocomplete="off"
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
                    </Form>
                )}
            </>
        );
    }
}
