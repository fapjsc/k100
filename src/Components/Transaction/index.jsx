import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';

import Spinner from 'react-bootstrap/Spinner';
import './index.scss';

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

    handleConfirm = async () => {
        const { usdtAmt, clientName } = this.state;

        const token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        try {
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
            this.setState({
                loginSession: token,
            });
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('login_session', token);

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

        const options = {
            maxRetries: 1,
        };

        const client = new ReconnectingWebSocket(url, [], options);

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
            console.log('got reply!');

            // 第一次返回後設定state
            this.setState({
                transferData: dataFromServer.data,
            });

            // 配對成功後返回設定狀態
            if (this.state.transferData.Tx_HASH) {
                this.setState({
                    pair: true,
                    isPairing: false,
                });
            }
        };

        // 3.錯誤處理
        client.onclose = () => {
            alert('連線異常，請確認網路狀態');
        };
    };

    render() {
        const { exRate, rmbAmt, usdtAmt, confirmPay, transferData, pair, isPairing } = this.state;

        return (
            <section className="overview bg_grey">
                <div className="container h_88">
                    <div className="row">
                        <div className="col-12 ">
                            <p className="welcome_txt">歡迎登入</p>
                        </div>
                        <div className="col-12 transaction-card">
                            {/* <nav>
                                <Link>購買</Link>
                                <Link>出售</Link>
                                <Link>轉帳</Link>
                            </nav> */}

                            <div>
                                <p>購買USDT</p>
                                <p>匯率 : {exRate ? exRate.RMB_BUY : null}</p>
                                <p>付款窗口 : 30分鐘</p>
                                <p>限額 : 200 - 1230</p>
                            </div>

                            {/* 申請購買 */}
                            <div>
                                <div>
                                    <input
                                        placeholder={usdtAmt ? usdtAmt : 'USDT'}
                                        onChange={this.getUsdtAmt}
                                    />
                                    <p>手續費: 5.00USDT</p>
                                </div>

                                <div>
                                    <input
                                        placeholder={rmbAmt ? rmbAmt : 'CNY'}
                                        onChange={this.getRmbAmt}
                                    />
                                </div>

                                <div>
                                    <br />

                                    <div>
                                        <input
                                            placeholder="請輸入姓名"
                                            onChange={this.getClientName}
                                        />
                                        <p>請輸入真實姓名</p>
                                    </div>
                                    <button onClick={this.showPayDetail}>下一步</button>
                                </div>
                            </div>

                            <br />
                            <br />
                            <br />
                            <br />
                            <br />

                            {/* 配對成功 */}

                            <div>
                                {confirmPay ? (
                                    <>
                                        <div>
                                            <p>總價: {rmbAmt}</p>
                                            <p>數量: {usdtAmt}</p>
                                            <p>單價: {rmbAmt / usdtAmt}</p>
                                            <button onClick={this.handleConfirm}>開始配對</button>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                        </div>
                                    </>
                                ) : null}

                                <div>
                                    {isPairing ? (
                                        <Spinner animation="grow" variant="danger" />
                                    ) : pair && transferData.MasterType === 0 ? (
                                        <>
                                            <div>
                                                <p>轉帳資料</p>
                                                <p>剩餘支付時間: 15分40秒</p>
                                            </div>
                                            <p>付款金額: {rmbAmt}</p>
                                            <p>收款姓名: {transferData.P2}</p>
                                            <p>付款帳號: {transferData.P1}</p>
                                            <p>開戶銀行: {transferData.P3}</p>
                                            <p>所在省市: {transferData.P4}</p>
                                            <button>已完成付款，下一步</button>
                                            <p>取消訂單</p>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
