import React, { Component } from 'react';

import OnLoading from './OnLoading';

import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import validator from 'validator';

export default class Transfer extends Component {
    state = {
        transferCount: {
            val: '',
            isValid: true,
        },
        transferAddress: {
            val: '',
            isValid: true,
        },
        formIsValid: true,
        isLoading: false,
        Avb_Balance: null, // 可提
        error: '',
        headers: null,
    };

    setTransferCount = e => {
        this.setState(
            {
                transferCount: {
                    val: e.target.value.trim(),
                    isValid: true,
                },
            },
            () => {}
        );
    };

    setTransferAddress = e => {
        this.setState(
            {
                transferAddress: {
                    val: e.target.value.trim(),
                    isValid: true,
                },
            },
            () => {}
        );
    };

    setShow = value => {
        this.setState({
            error: value,
        });
    };

    valid = () => {
        const { transferCount, transferAddress } = this.state;
        const { Avb_Balance } = this.props;

        // 錢包地址小於40位
        if (transferAddress.val.length < 40) {
            this.setState({
                transferAddress: {
                    val: '',
                    isValid: false,
                },
                formIsValid: false,
            });
        }

        // 輸入數量大於可提加上手續費
        if (transferCount.val > Avb_Balance + Number(this.props.exRate.TransferHandle)) {
            this.setState({
                transferCount: {
                    val: '',
                    isValid: false,
                },
                formIsValid: false,
                error: '超出最大可提',
            });
        }

        if (!validator.isDecimal(transferCount.val)) {
            console.log('hi');
            this.setState({
                transferCount: {
                    val: '',
                    isValid: false,
                },
                formIsValid: false,
            });
        }
    };

    getAll = () => {
        const all = this.props.Avb_Balance - Number(this.props.exRate.TransferHandle);
        console.log(all);
        this.setState({
            transferCount: {
                val: String(all),
                isValid: true,
            },
        });
    };

    onLoading = value => {
        this.setState({
            isLoading: value,
        });
    };

    handleSubmit = async () => {
        this.setState({
            formIsValid: true,
        });
        await this.valid();

        if (!this.state.formIsValid) {
            console.log('fail submit');
            return;
        }

        const { transferAddress, transferCount, headers } = this.state;
        const transferApi = '/j/Req_Transfer1.aspx';
        console.log(headers);

        console.log(transferAddress);
        console.log(transferCount);

        const res = await fetch(transferApi, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ToAddress: transferAddress.val,
                UsdtAmt: transferCount.val,
            }),
        });

        const resData = await res.json();

        console.log(resData);

        console.log('submit success');
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('login_session', token);

            this.setState({
                loginSession: token,
                headers,
            });
        } else {
            return;
        }
    }

    render() {
        const { isLoading, transferAddress, transferCount } = this.state;
        const { exRate } = this.props;

        return (
            <div>
                {isLoading ? (
                    <OnLoading show={isLoading} onHide={() => this.onLoading(false)} />
                ) : null}

                <>
                    <Form>
                        <Row>
                            <Col sm={12} md={6} lg={6} xl={6}>
                                <Form.Group controlId="transferUsdt" className="my-4">
                                    <div className="mb_sm d-flex justify-content-between">
                                        <Form.Label className="h_100">轉賬USDT </Form.Label>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={this.getAll}
                                        >
                                            提取所有
                                        </Button>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="請輸入數量"
                                        className="p_sm-2"
                                        onChange={this.setTransferCount}
                                        autoComplete="off"
                                        value={transferCount.val}
                                        isInvalid={!transferCount.isValid}
                                    />

                                    {exRate !== null ? (
                                        <Form.Text className="text-muted my-3">
                                            手續費: {exRate.TransferHandle} USDT
                                        </Form.Text>
                                    ) : null}

                                    {/* <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text> */}
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={6} lg={6} xl={6}>
                                <Form.Group controlId="transferAddress" className="my-4">
                                    <div className="mb_sm ">
                                        <Form.Label className="h_100">USDT</Form.Label>
                                        {/* <Button as="a" variant="outline-primary" className="" size="sm">
                                        提取所有
                                    </Button> */}
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="請輸入收款地址"
                                        className="p_sm-2"
                                        autoComplete="off"
                                        onChange={this.setTransferAddress}
                                        isInvalid={!transferAddress.isValid}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Button
                            variant="primary"
                            className="easy-btn mw400"
                            onClick={() => this.onLoading(true)}
                            disabled={formIsValid}
                        >
                            下一步
                        </Button> */}

                        <Button
                            // variant={formIsValid ? 'primary' : 'secondary'}
                            variant="primary"
                            className="w-50 mx-auto mw400 cus-btn"
                            onClick={this.handleSubmit}
                        >
                            下一步
                        </Button>
                    </Form>

                    <hr className="mt_mb" />
                    <p className="txt_12_grey">
                        由于数字资产价格随时存在较大波动，第二步交易报价的有效期为20分钟（即：您下单付款到广告方放币的时间需控制在20分钟内）。
                        <br />
                        <br />
                        如果您对新的报价不予接受的，将直接获得第一步交易购入的USDT。
                        <br />
                        <br />
                        USDT是系统根据您所需购买金额（或数量）和付款方式匹配出的最低价格，并且您可随时使用USDT在币币交易兑换其他数字资产。
                    </p>
                </>
            </div>
        );
    }
}
