import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ReconnectingWebSocket from 'reconnecting-websocket';
import PubSub from 'pubsub-js';

import PayInfo from '../Buy/PayInfo';
import BuyCount from './BuyCount';
import ConfirmBuy from './ConfirmBuy';
import Paring from './Pairing';

import './index.scss';

export default class Buy extends Component {
    state = {
        orderToken: '',
        loginSession: '',
        clientName: '',
        exRate: null,
        rmbAmt: null,
        usdtAmt: null,
        confirmPay: false,
        transferData: {},
        pair: false,
        isPairing: false,
        pairFinish: false,
        data: {},
        timer: null,
        upperLimit: null,
        lowerLimit: null,
        error: '',
    };

    getRmbAmt = e => {
        if (e.target.id === 'cny') {
            this.setState(
                {
                    rmbAmt: e.target.value.trim(),
                    clearInput: 'usdt',
                    error: '',
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
                    error: '',
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
            error: '',
        });
    };

    transformRmb = () => {
        this.setState(state => {
            return {
                rmbAmt: (this.props.exRate.RMB_BUY * state.usdtAmt).toFixed(2),
            };
        });
    };

    transformToUsdt = () => {
        this.setState(state => {
            return {
                usdtAmt: (state.rmbAmt / this.props.exRate.RMB_BUY).toFixed(2),
            };
        });
    };

    handleConfirm = async () => {
        const { usdtAmt, clientName } = this.state;

        if (!clientName) {
            this.setState({
                error: '請輸入姓名',
            });
            // alert('請輸入姓名');
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
            alert(error, 'transaction');
        }
    };

    showPayDetail = () => {
        const { usdtAmt, rmbAmt } = this.state;

        // 有1~2位小数的正數，且不能為0或0開頭
        let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;

        if (!rule.test(usdtAmt) || !rule.test(rmbAmt)) {
            this.setState({
                error: '請輸入有效數量, (不能為0，最多小數第二位)',
            });
            // alert('請輸入有效數量, (不能為0，最多小數第二位)');
            return;
        }

        this.setState({
            confirmPay: true,
            error: '',
        });
    };

    componentDidMount() {
        this.closeWebSocket();

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

    componentWillUnmount() {
        this.closeWebSocket();
    }

    // webSocket 連接
    submitTransaction = value => {
        console.log('call buy');
        const { orderToken, loginSession } = this.state;
        const transactionApi = 'j/ws_orderstatus.ashx';

        let token;

        if (orderToken) {
            token = orderToken;
        } else {
            token = value;
        }

        // 自動重連次數
        // const options = {
        //     maxRetries: null,
        // };

        let url;

        if (window.location.protocol === 'http:') {
            url = `${process.env.REACT_APP_WEBSOCKET_URL}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
        } else {
            url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
        }

        const client = new ReconnectingWebSocket(url);

        this.setState({
            client,
        });

        // 1.建立連接
        client.onopen = () => {
            console.log('websocket client connected buy');
            this.setState({
                isPairing: true,
            });
        };

        // 2.收到server回復
        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data);
            // console.log('got reply!', dataFromServer);
            const DeltaTime = dataFromServer.data.DeltaTime;

            this.setState({
                transferData: dataFromServer.data,
                DeltaTime,
            });

            // 等待付款
            if (dataFromServer.data.Order_StatusID === 33) {
                this.setState(
                    {
                        pair: true,
                        isPairing: false,
                        pairFinish: true,
                    },
                    () => {
                        if (this.props.location.pathname !== `/home/transaction/buy/${token}`) {
                            this.props.history.replace(`/home/transaction/buy/${token}`);
                        } else {
                            return;
                        }
                    }
                );
            }

            // 收款確認
            if (dataFromServer.data.Order_StatusID === 34) {
                PubSub.publish('statId', 34);
                const data = this.state.transferData;
                PubSub.publish('getData', data);
                // console.log(data);
            }

            // 交易完成
            if (dataFromServer.data.Order_StatusID === 1) {
                PubSub.publish('statId', 1);
                const data = this.state.transferData;
                PubSub.publish('getData', data);
                client.close();
            }
        };

        // 3.錯誤處理
        // client.onclose = () => {
        //     console.log('關閉連線');
        // };

        client.onclose = function (message) {
            // console.log('關閉連線', message);
            // console.log('關閉連線', message.target.url);
            localStorage.removeItem('order_token');
        };
    };

    closeWebSocket = () => {
        const { client } = this.state;

        if (client) {
            client.close();
        } else {
            // console.log('沒有webSocket Client');
        }
    };

    // closeWebsocket = () => {
    //     client.close();
    // };

    render() {
        const {
            rmbAmt,
            usdtAmt,
            confirmPay,
            pair,
            isPairing,
            pairFinish,
            orderToken,
            timer,
            timer2,
            upperLimit,
            lowerLimit,
            error,
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
                                    exRate={this.props.exRate}
                                    error={error}
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
                                    error={error}
                                />
                            )}

                            {isPairing ? (
                                <Paring
                                    show={isPairing}
                                    onHide={() => this.setState({ isPairing: true })}
                                    rmbamt={rmbAmt}
                                    usdtamt={usdtAmt}
                                />
                            ) : null}
                        </div>
                    </Route>

                    <Route
                        path="/home/transaction/buy/:id"
                        // component={props => (
                        //     <PayInfo
                        //         {...props}
                        //         handleConfirm={this.handleConfirm}
                        //         orderToken={orderToken ? orderToken : ''}
                        //         submitTransaction={this.submitTransaction}
                        //     />
                        // )}

                        render={props => (
                            <PayInfo
                                {...props}
                                handleConfirm={this.handleConfirm}
                                orderToken={orderToken ? orderToken : ''}
                                submitTransaction={this.submitTransaction}
                                timer={timer}
                                timer2={timer2}
                                upperLimit={upperLimit}
                                lowerLimit={lowerLimit}
                            />
                        )}
                    />
                </Switch>
            </>
        );
    }
}
