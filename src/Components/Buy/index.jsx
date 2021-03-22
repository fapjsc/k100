import React, { Component } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ReconnectingWebSocket from 'reconnecting-websocket';

import PayInfo from '../Buy/PayInfo';

import BuyCount from './BuyCount';
import ConfirmBuy from './ConfirmBuy';
import Paring from './Pairing';

import './index.scss';

export default class Transaction extends Component {
    state = {
        orderToken: '',
        loginSession: '',
        clientName: '',
        exRate: null,
        rmbAmt: null,
        usdtAmt: null,
        confirmPay: false,
        transferData: null,
        pair: false,
        isPairing: false,
        pairFinish: false,
        data: {},
        transactionDone: false,
        isCompletePay: false,
    };

    // 獲取匯率
    getExRate = async headers => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('token 過期');
        }

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

    getRmbAmt = e => {
        if (e.target.id === 'cny') {
            this.setState(
                {
                    rmbAmt: e.target.value.trim(),
                    clearInput: 'usdt',
                },
                () => {
                    this.transformToUsdt();
                }
            );
        }

        if (e.target.id === 'usdt') {
            this.setState(
                {
                    usdtAmt: e.target.value.trim(),
                    clearInput: 'cny',
                },
                () => {
                    this.transformRmb();
                }
            );
        }
    };

    getClientName = e => {
        this.setState({
            clientName: e.target.value.trim(),
        });
    };

    transformRmb = () => {
        this.setState(state => {
            return {
                rmbAmt: (state.exRate.RMB_BUY * state.usdtAmt).toFixed(2),
            };
        });
    };

    transformToUsdt = () => {
        this.setState(state => {
            return {
                usdtAmt: (state.rmbAmt / state.exRate.RMB_BUY).toFixed(2),
            };
        });
    };

    // payComplete = () => {
    //     console.log(this.state.orderToken);
    //     const payCompleteApi = `/j/Req_Buy2.aspx`;

    //     const res = await fetch(payCompleteApi, {
    //         method: "POST",
    //         headers,
    //         body: JSON.stringify({

    //         })
    //     })
    // };

    handleConfirm = async () => {
        const { usdtAmt, clientName } = this.state;

        if (!clientName) {
            alert('請輸入姓名');
            return;
        }

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

            console.log(resData, 'buy1');

            const {
                data: { order_token },
            } = resData;

            this.setState(
                {
                    orderToken: order_token,
                },
                () => {
                    localStorage.setItem('order_token', this.state.orderToken);
                    this.submitTransaction();
                }
            );
        } catch (error) {
            alert(error, 'transaction');
        }
    };

    showPayDetail = () => {
        const { usdtAmt, rmbAmt } = this.state;

        console.log(typeof usdtAmt, typeof rmbAmt);

        // 有1~2位小数的正數，且不能為0或0開頭
        let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;

        if (!rule.test(usdtAmt) || !rule.test(rmbAmt)) {
            alert('請輸入有效數量, (不能為0，最多小數第二位)');
            return;
        }

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

            // const orderToken = localStorage.getItem('order_token');

            // if (orderToken) {
            //     this.setState({
            //         isCompletePay: true,
            //         pairFinish: true,
            //     });
            // }
        } else {
            return;
        }
    }

    componentWillUnmount() {
        console.log('transaction will unmount');
        this.closeWebSocket();
    }

    // webSocket 連接
    submitTransaction = () => {
        console.log(this.props);
        const { orderToken, loginSession } = this.state;
        const transactionApi = 'j/ws_orderstatus.ashx';

        // 自動重連次數
        // const options = {
        //     maxRetries: null,
        // };

        let url;

        if (window.location.protocol === 'http:') {
            url = `ws://10.168.192.1/${transactionApi}?login_session=${loginSession}&order_token=${orderToken}`;
        } else {
            url = `wss://k100u.com/${transactionApi}?login_session=${loginSession}&order_token=${orderToken}`;
        }

        const client = new ReconnectingWebSocket(url);

        this.setState({
            client,
        });

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
            console.log('got reply!', dataFromServer);

            // 返回後設定state
            this.setState({
                transferData: dataFromServer.data,
            });

            // 配對成功後返回設定狀態
            // if (this.state.transferData.Tx_HASH) {
            //     this.setState({
            //         pair: true,
            //         isPairing: false,
            //         pairFinish: true,
            //     });
            // }

            // 等待付款
            if (dataFromServer.data.Order_StatusID === 33) {
                this.setState(
                    {
                        pair: true,
                        isPairing: false,
                        pairFinish: true,
                    },
                    () => {
                        this.props.history.push(`/home/transaction/buy/${this.state.orderToken}`);
                    }
                );
            }

            // 收款確認
            if (dataFromServer.data.Order_StatusID === 34) {
                this.setState({
                    isCompletePay: true,
                });
            }

            // 交易完成
            if (dataFromServer.data.Order_StatusID === 1) {
                this.setState(
                    {
                        transactionDone: true,
                    },
                    () => {
                        client.close();
                    }
                );
            }
        };

        // 3.錯誤處理
        // client.onclose = () => {
        //     console.log('關閉連線');
        // };

        client.onclose = function () {
            console.log('關閉連線');
            localStorage.removeItem('order_token');
        };
    };

    closeWebSocket = () => {
        const { client } = this.state;

        if (client) {
            client.close();
            console.log(client.readyState);
        } else {
            console.log('沒有webSocket Client');
        }
    };

    // closeWebsocket = () => {
    //     client.close();
    // };

    render() {
        console.log('buy render');
        const {
            rmbAmt,
            usdtAmt,
            confirmPay,
            pair,
            isPairing,
            pairFinish,
            transactionDone,
            orderToken,
            isCompletePay,
        } = this.state;

        // 千分位逗號
        // if (usdtAmt) {
        //     usdtAmt = usdtAmt.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        // }

        // if (rmbAmt) {
        //     rmbAmt = usdtAmt.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        // }

        return (
            <>
                <Switch>
                    <Route exact path="/home/transaction/buy">
                        <div>
                            {!confirmPay ? (
                                <BuyCount
                                    showPayDetail={this.showPayDetail}
                                    getRmbAmt={this.getRmbAmt}
                                    getUsdtAmt={this.getUsdtAmt}
                                    usdtAmt={usdtAmt}
                                    rmbAmt={rmbAmt}
                                />
                            ) : (
                                <ConfirmBuy
                                    getClientName={this.getClientName}
                                    handleConfirm={this.handleConfirm}
                                    usdtAmt={usdtAmt}
                                    rmbAmt={rmbAmt}
                                    pairFinish={pairFinish}
                                    pair={pair}
                                    isPairing={isPairing}
                                />
                            )}

                            {isPairing ? (
                                <Paring
                                    show={isPairing}
                                    onHide={() => this.setState({ isPairing: false })}
                                    rmbamt={rmbAmt}
                                    usdtamt={usdtAmt}
                                />
                            ) : null}
                        </div>
                    </Route>

                    <Route
                        path="/home/transaction/buy/:id"
                        component={props => (
                            <PayInfo
                                {...this.state}
                                {...props}
                                handleConfirm={this.handleConfirm}
                                transactionDone={transactionDone}
                                orderToken={orderToken ? orderToken : ''}
                                isCompletePay={isCompletePay}
                                submitTransaction={this.submitTransaction}
                            />
                        )}
                    />
                </Switch>
            </>
        );
    }
}
