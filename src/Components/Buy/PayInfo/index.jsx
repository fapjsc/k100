import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';
import BaseSpinner from '../../Ui/BaseSpinner';
import Chat from '../../Chat';

import Countdown from 'react-countdown';
import PubSub from 'pubsub-js';
import ReconnectingWebSocket from 'reconnecting-websocket';

import Button from 'react-bootstrap/Button';
import './index.scss';

export default class PayInfo extends Component {
    state = {
        headers: {},
        showInfo: true,
        // transactionDone: false,
        data: null,
        masterType: null,
        isCompletePay: false,
        client: {},
        isChat: true,
        message: [],
    };

    setInfo = () => {
        this.setState({
            showInfo: false,
        });
    };

    getConfirmPay = async () => {
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
            this.setState({
                isCompletePay: true,
            });
        } catch (error) {
            alert(error);
        }
    };

    getStatId = (_, data) => {
        this.setState({
            stateId: data,
        });
    };

    getTransData = (_, data) => {};

    openChat = () => {
        this.setState({
            isChat: !this.state.isChat,
        });
    };

    componentDidMount() {
        console.log('pay info render');
        this.setState(
            {
                orderToken: this.props.match.params.id,
            },
            () => {
                this.detailReq();
                const { orderToken } = this.state;
                this.props.submitTransaction(orderToken);
            }
        );

        PubSub.subscribe('statId', this.getStatId);
    }

    componentWillUnmount() {}

    // stateId = value => {
    //     console.log(value, '====== call stateI  =====');
    //     this.setState({
    //         stateId: value,
    //     });
    // };

    detailReq = async () => {
        // PubSub.subscribe('getData', this.getTransData);

        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const { orderToken } = this.state;
        // this.props.submitTransaction(orderToken);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        const detailApi = '/j/GetTxDetail.aspx';

        try {
            const res = await fetch(detailApi, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    Token: orderToken,
                }),
            });
            const resData = await res.json();

            const { data } = resData;

            this.setState({
                masterType: data.MasterType,
                stateId: data.Order_StatusID,
                Tx_HASH: data.Tx_HASH,
                DeltaTime: data.DeltaTime,
            });

            if (data.MasterType === 1 || data.MasterType === 0) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        account: data.P1,
                        payee: data.P2,
                        bank: data.P3,
                        branch: data.P4,
                        exchangePrice: data.D1,
                        rmb: data.D2,
                        charge: data.D3,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }

            if (data.MasterType === 2) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        receivingAddress: data.P1,
                        charge: data.D1,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }

            if (data.MasterType === 3) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }
        } catch (error) {
            alert(error);
            return;
        }
    };

    backToHome = () => {
        this.props.history.replace('/home/overview');
    };

    render() {
        const {
            showInfo,
            isCompletePay,
            // transactionDone,
            master,
            stateId,
            Tx_HASH,
            DeltaTime,
            isChat,
        } = this.state;

        let totalTime = 18000000; //  一次 15分鐘，共計算兩次所以是 30分鐘
        let upperLimit = (totalTime / 2) * 1000;
        let lowerLimit = upperLimit / 2;

        let timer = ((totalTime - DeltaTime) * 1000) / 2;

        return (
            <div>
                <div className="pairBox">
                    {showInfo &&
                    !isCompletePay &&
                    stateId === 33 &&
                    timer <= upperLimit &&
                    timer > lowerLimit ? (
                        <>
                            <div className="pair-titleBox">
                                <p>轉帳資料</p>
                                <p>
                                    剩餘支付時間:
                                    <span className="payTime">
                                        <Countdown
                                            date={Date.now() + timer}
                                            renderer={Timer}
                                            onComplete={() => this.setInfo(false)}
                                        ></Countdown>
                                    </span>
                                </p>
                            </div>

                            <InfoDetail transferData={master} getConfirmPay={this.getConfirmPay} />
                        </>
                    ) : (!showInfo && !isCompletePay && stateId === 33) ||
                      (timer < lowerLimit && stateId === 33) ? (
                        <Countdown
                            date={Date.now() + timer}
                            renderer={ButtonTimer}
                            getConfirmPay={this.getConfirmPay}
                        ></Countdown>
                    ) : stateId === 34 || isCompletePay ? (
                        <div>
                            <div className="txt_12 pt_20">購買USDT</div>
                            <div className="text-center">
                                <div className="i_notyet" />
                                <h4 className="c_blue">已提交，等待確認中</h4>
                                <p className="txt_12_grey">
                                    交易回執：
                                    {/* {props.transferData.Tx_HASH ? props.transferData.Tx_HASH : props.hash} */}
                                    {Tx_HASH}
                                    <br />
                                    購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                                </p>
                                <button onClick={this.backToHome} className="easy-btn mw400">
                                    返回主頁
                                </button>
                            </div>
                        </div>
                    ) : stateId === 1 || isCompletePay ? (
                        <div>
                            <div className="txt_12 pt_20">購買USDT</div>
                            <div className="text-center">
                                <div className="i_done" />
                                <h4 className="c_blue">交易完成</h4>
                                <p className="txt_12_grey">
                                    交易回執：
                                    {Tx_HASH}
                                    <br />
                                    購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                                </p>
                                <button onClick={this.backToHome} className="easy-btn mw400">
                                    返回主頁
                                </button>
                                <br />
                                <p>詳細購買紀錄</p>
                            </div>
                        </div>
                    ) : (
                        <BaseSpinner />
                    )}
                    <Button onClick={this.openChat} variant="primary">
                        幫助
                    </Button>
                    {isChat ? <Chat {...this.props} /> : null}
                </div>
            </div>
        );
    }
}
