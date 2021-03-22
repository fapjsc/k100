import React, { Component } from 'react';

import OnLoading from './OnLoading';

import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default class Transfer extends Component {
    state = {
        transferCount: null,
        transferAddress: '',
        isLoading: false,
    };

    setTransferCount = e => {
        this.setState(
            {
                transferCount: e.target.value,
            },
            () => {
                console.log(this.state.transferCount);
            }
        );
    };

    setTransferAddress = e => {
        this.setState(
            {
                transferAddress: e.target.value,
            },
            () => {
                console.log(this.state.transferAddress);
            }
        );
    };

    onLoading = value => {
        this.setState({
            isLoading: value,
        });
    };

    render() {
        const { isLoading } = this.state;
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
                                        <Button variant="outline-primary" size="sm">
                                            提取所有
                                        </Button>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="請輸入數量"
                                        className="p_sm-2"
                                        onChange={this.setTransferCount}
                                        autoComplete="off"
                                    />
                                    <Form.Text className="text-muted my-3">
                                        手續費: 5.00USDT
                                    </Form.Text>

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
                                        onChange={this.setTransferAddress}
                                        autoComplete="off"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button
                            variant="primary"
                            className="easy-btn mw400"
                            onClick={() => this.onLoading(true)}
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
