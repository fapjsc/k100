import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ReconnectingWebSocket from 'reconnecting-websocket';
import PubSub from 'pubsub-js';

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
        transferData: {},
        pair: false,
        isPairing: false,
        pairFinish: false,
        data: {},
        timer: null,
        upperLimit: null,
        lowerLimit: null,
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

            const {
                data: { order_token },
            } = resData;

            console.log(order_token);

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
        } else {
            return;
        }
    }

    componentWillUnmount() {
        this.closeWebSocket();
    }

    // webSocket 連接
    submitTransaction = value => {
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
            console.log('websocket client connected');
            this.setState({
                isPairing: true,
            });
        };

        // 2.收到server回復
        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data);
            console.log('got reply!', dataFromServer);
            const DeltaTime = dataFromServer.data.DeltaTime;

            let totalTime = 1800; //  一次 15分鐘，共計算兩次所以是 30分鐘

            let upperLimit = (totalTime / 2) * 1000;
            let lowerLimit = upperLimit / 2;

            let timer = ((totalTime - DeltaTime) * 1000) / 2;

            let timer2 = ((totalTime - DeltaTime) * 1000) / 2;

            console.log(DeltaTime);
            console.log(timer);

            this.setState({
                transferData: dataFromServer.data,
                timer,
                timer2,
                upperLimit,
                lowerLimit,
            });

            // 配對中
            // if (dataFromServer.data.Order_StatusID === 31) {
            //     this.setState(
            //         {
            //             transferData: dataFromServer.data,
            //         },
            //         () => {
            //             console.log(this.state);
            //         }
            //     );
            // }

            // 等待付款
            if (dataFromServer.data.Order_StatusID === 33) {
                // console.log('33');
                // this.setState({
                //     pair: true,
                //     isPairing: false,
                //     pairFinish: true,
                // });

                // console.log(this.state.transferData);
                // console.log(object)

                this.setState(
                    {
                        pair: true,
                        isPairing: false,
                        pairFinish: true,
                    },
                    () => {
                        // const data = this.state.transferData;
                        // const path = {
                        //     pathname: `/home/transaction/buy/${token}`,
                        //     state: data,
                        // };
                        // path.state.orderToken = token;
                        // this.props.history.replace(path);
                        if (this.props.location.pathname !== `/home/transaction/buy/${token}`) {
                            this.props.history.replace(`/home/transaction/buy/${token}`);
                        } else {
                            return;
                        }
                    }
                );
                // PubSub.publish('updateTransaction', 33);
            }

            // 收款確認
            if (dataFromServer.data.Order_StatusID === 34) {
                console.log('34***********************');

                PubSub.publish('statId', 34);
                const data = this.state.transferData;
                PubSub.publish('getData', data);
                // console.log(data);
            }

            // 交易完成
            if (dataFromServer.data.Order_StatusID === 1) {
                console.log('1***********************');
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
            orderToken,
            timer,
            timer2,
            upperLimit,
            lowerLimit,
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
