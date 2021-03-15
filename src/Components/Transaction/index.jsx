import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';

import Countdown from 'react-countdown';

import Button from 'react-bootstrap/Button';

import './index.scss';
import BuyCount from './BuyCount';
import ConfirmBuy from './ConfirmBuy';

export default class Transaction extends Component {
    state = {
        orderToken: null,
        loginSession: '',
        clientName: '',
        exRate: null,
        rmbAmt: null,
        usdtAmt: null,
        confirmPay: false,
        transferData: null,
        pair: false,
        isPairing: false,
        transactionState: 'buy',
        pairFinish: false,
        data: {},
    };

    // 獲取匯率
    getExRate = async headers => {
        const exRateApi = `/j/ChkExRate.aspx`;

        try {
            const res = await fetch(exRateApi, {
                headers,
            });

            const resData = await res.json();

            if (!res.ok) {
                console.log(resData, '!res.ok');
            }

            const { data } = resData;

            this.setState({
                exRate: data,
            });
        } catch (error) {
            console.log(error, 'getExRate');
        }
    };

    getUsdtAmt = e => {
        this.setState(
            {
                usdtAmt: e.target.value,
            },
            () => {
                this.transformRmb();
            }
        );
    };

    getRmbAmt = e => {
        this.setState(
            {
                rmbAmt: e.target.value,
            },
            () => {
                this.transformToUsdt();
            }
        );
    };

    getClientName = e => {
        this.setState({
            clientName: e.target.value,
        });
    };

    transformRmb = () => {
        this.setState(state => {
            return {
                rmbAmt: state.exRate.RMB_BUY * state.usdtAmt,
            };
        });
    };

    transformToUsdt = () => {
        this.setState(state => {
            return {
                usdtAmt: state.rmbAmt / state.exRate.RMB_BUY,
            };
        });
    };

    payComplete = () => {
        console.log(this.state.orderToken);
        // const payCompleteApi = `/j/Req_Buy2.aspx`;

        // const res = await fetch(payCompleteApi, {
        //     method: "POST",
        //     headers,
        //     body: JSON.stringify({

        //     })
        // })
    };

    confirmPay = async () => {
        const token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        try {
            console.log('call buy2 api');
            const reqBuy2Api = `/j/Req_Buy2.aspx`;

            const res = await fetch(reqBuy2Api, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    Token: this.state.orderToken,
                }),
            });

            const resData = await res.json();

            console.log(resData, 'buy2');
        } catch (error) {
            alert(error);
        }
    };

    handleConfirm = async () => {
        const { usdtAmt, clientName } = this.state;

        const token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        try {
            console.log('call buy1 api');

            const reqBuyApi = `/j/Req_Buy1.aspx`;
            const res = await fetch(reqBuyApi, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ClientName: clientName,
                    UsdtAmt: usdtAmt,
                }),
            });

            const resData = await res.json();

            const {
                data: { order_token },
            } = resData;

            console.log(resData, 'buy-1');

            this.setState(
                {
                    orderToken: order_token,
                },
                () => {
                    this.submitTransaction();
                }
            );
        } catch (error) {
            alert(error);
        }
    };

    showPayDetail = () => {
        this.setState({
            confirmPay: true,
        });
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

            this.getExRate(headers);
        } else {
            return;
        }
    }

    // webSocket 連接
    submitTransaction = () => {
        const { orderToken, loginSession } = this.state;
        const transactionApi = 'j/ws_orderstatus.ashx';
        const url = `ws://10.168.192.1/${transactionApi}?login_session=${loginSession}&order_token=${orderToken}`;

        // 自動重連次數
        // const options = {
        //     maxRetries: null,
        // };

        const client = new ReconnectingWebSocket(url);

        // 1.建立連接
        client.onopen = () => {
            console.log('websocket client connected');
            this.setState({
                isPairing: true,
            });
        };

        // 2.收到server回復
        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data);
            // console.log('got reply!', dataFromServer);

            // 第一次返回後設定state
            this.setState({
                transferData: dataFromServer.data,
            });

            // 配對成功後返回設定狀態
            if (this.state.transferData.Tx_HASH) {
                this.setState({
                    pair: true,
                    isPairing: false,
                    pairFinish: true,
                });
            }
        };

        // 3.錯誤處理
        client.onclose = () => {
            alert('連線異常，請確認網路狀態');
        };
    };

    render() {
        const {
            exRate,
            rmbAmt,
            usdtAmt,
            confirmPay,
            transferData,
            pair,
            isPairing,
            transactionState,
            pairFinish,
        } = this.state;

        return (
            <section className="overview bg_grey">
                <div className="container h_88">
                    <div className="row">
                        <div className="col-12 ">
                            <p className="welcome_txt">歡迎登入</p>
                        </div>
                        <div className="col-12 transaction-card">
                            <div className="history-tab trans-tab">
                                <Link
                                    to="/home"
                                    className={
                                        transactionState === 'buy'
                                            ? 'history-link history-link-active'
                                            : 'history-link'
                                    }
                                >
                                    購買
                                </Link>
                                <Link
                                    to="/home"
                                    className={
                                        transactionState === 'sell'
                                            ? 'history-link history-link-active'
                                            : 'history-link'
                                    }
                                >
                                    出售
                                </Link>

                                <Link
                                    to="/home"
                                    className={
                                        transactionState === 'sell'
                                            ? 'history-link history-link-active'
                                            : 'history-link'
                                    }
                                >
                                    轉帳
                                </Link>
                            </div>

                            <p>購買USDT</p>
                            <div className="pay-info">
                                <p>匯率 : {exRate ? exRate.RMB_BUY : null}</p>
                                <p>付款窗口 : 30分鐘</p>
                                <p>限額 : 200 - 1230</p>
                            </div>

                            {/* 申請購買 */}

                            <div>
                                {confirmPay ? (
                                    <ConfirmBuy
                                        getClientName={this.getClientName}
                                        handleConfirm={this.handleConfirm}
                                        usdtAmt={usdtAmt}
                                        rmbAmt={rmbAmt}
                                        pairFinish={pairFinish}
                                        pair={pair}
                                        isPairing={isPairing}
                                    />
                                ) : (
                                    <BuyCount
                                        showPayDetail={this.showPayDetail}
                                        getRmbAmt={this.getRmbAmt}
                                        getUsdtAmt={this.getUsdtAmt}
                                        usdtAmt={usdtAmt}
                                        rmbAmt={rmbAmt}
                                    />
                                )}

                                {/* 配對成功 */}
                                {
                                    <div>
                                        {isPairing ? null : pair &&
                                          transferData.MasterType === 0 ? (
                                            <div className="pairBox">
                                                <div className="pair-titleBox">
                                                    <p>轉帳資料</p>
                                                    <p>
                                                        剩餘支付時間:
                                                        <span className="payTime">
                                                            <Countdown
                                                                date={Date.now() + 5000}
                                                            ></Countdown>
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="pair-textBox">
                                                    <p>
                                                        付款金額: &emsp;
                                                        <span>{transferData.D2}</span>
                                                    </p>
                                                    <p>收款姓名: {transferData.P2}</p>
                                                    <p>付款帳號: {transferData.P1}</p>
                                                    <p>開戶銀行: {transferData.P3}</p>
                                                    <p>所在省市: {transferData.P4}</p>
                                                </div>
                                                <div className="pairFoot">
                                                    <Button
                                                        variant="primary"
                                                        className="pairFoot-btn"
                                                        onClick={this.confirmPay}
                                                    >
                                                        已完成付款，下一步...
                                                    </Button>
                                                    <p>取消訂單</p>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
