import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
// import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';
import BaseSpinner from '../../Ui/BaseSpinner';
import Chat from '../../Chat';
import CountDownUnreset from '../CountDownUnreset';

// import Countdown from 'react-countdown';
import PubSub from 'pubsub-js';

import TalkIcon from '../../../Assets/i_talk.png';
import './index.scss';
import Button from 'react-bootstrap/Button';

export default class PayInfo extends Component {
    state = {
        headers: {},
        showInfo: true,
        transactionDone: false,
        data: null,
        masterType: null,
        isCompletePay: false,
        client: {},
        isChat: true,
        message: [],
        timer: 900,
        timer2: 1800,
        minutes: null,
        seconds: null,
        minutes2: null,
        seconds2: null,
        completed: false,
        overTime: false,
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
            const reqBuy2Api = `/j/Req_Buy2.aspx`;
            const res = await fetch(reqBuy2Api, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    Token: this.state.orderToken,
                }),
            });

            const resData = await res.json();

            if (resData.code === 200) {
                this.setState({
                    isCompletePay: true,
                });
            } else {
                alert(resData.msg);
            }
        } catch (error) {
            alert(error);
        }
    };

    getStatId = (_, data) => {
        this.setState({
            stateId: data,
            isCompletePay: true,
        });

        if (data === 1) {
            this.setState({
                transactionDone: true,
            });
        }
    };

    openChat = () => {
        const { orderToken } = this.state;
        this.props.submitTransaction(orderToken);
        this.setState({
            isChat: !this.state.isChat,
        });
    };

    componentDidMount() {
        this.setState(
            {
                orderToken: this.props.match.params.id,
            },
            () => {
                this.detailReq();
                const { orderToken } = this.state;
                this.props.submitTransaction(orderToken);
                this.getDeltaTime();
            }
        );

        PubSub.subscribe('statId', this.getStatId);
    }

    getDeltaTime2 = async () => {
        console.log('call 2');
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const { orderToken } = this.state;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        const detailApi = '/j/GetTxDetail.aspx';

        const res = await fetch(detailApi, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                Token: orderToken,
            }),
        });
        const resData = await res.json();

        const { data } = resData;

        const { timer2 } = this.state;
        let countTimer = timer2 - data.DeltaTime;

        if (countTimer <= 0) {
            this.setState({
                completed: true,
            });
        }

        let minutesTime;

        if (data.DeltaTime === 900) {
            minutesTime = countTimer / 60 + 1;
        } else {
            minutesTime = countTimer / 60;
        }

        let secondsTime = (minutesTime - Math.trunc(minutesTime)) * 60;

        this.setState({
            minutes2: minutesTime,
            seconds2: secondsTime,
        });
    };

    getDeltaTime = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const { orderToken } = this.state;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        const detailApi = '/j/GetTxDetail.aspx';

        const res = await fetch(detailApi, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                Token: orderToken,
            }),
        });
        const resData = await res.json();

        const { data } = resData;
        const { timer } = this.state;
        let countTimer = timer - data.DeltaTime;

        if (countTimer <= 0) {
            this.getDeltaTime2();
            this.setState({
                overTime: true,
                showInfo: false,
            });
            return;
        }

        // console.log(7600 / 60);
        // console.log((7600 / 60 - Math.trunc(7600 / 60)) * 60);

        let minutesTime;

        if (data.DeltaTime === 0) {
            minutesTime = countTimer / 60 + 1;
        } else {
            minutesTime = countTimer / 60;
        }

        let secondsTime = (minutesTime - Math.trunc(minutesTime)) * 60;

        this.setState({
            minutes: minutesTime,
            seconds: secondsTime,
        });
    };

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
            transactionDone,
            master,
            stateId,
            Tx_HASH,
            isChat,
            minutes,
            seconds,
            minutes2,
            seconds2,
            overTime,
            completed,
        } = this.state;

        return (
            <div>
                <div className="pairBox">
                    {showInfo && !isCompletePay && !overTime && stateId === 33 ? (
                        <>
                            <div className="pair-titleBox">
                                <p>轉帳資料</p>
                                <p>
                                    剩餘支付時間:
                                    <span className="payTime">
                                        {minutes && (
                                            <CountDownUnreset
                                                minutes={minutes}
                                                seconds={seconds}
                                                setInfo={this.setInfo}
                                            />
                                        )}
                                        {/* <Countdown
                                            date={Date.now() + timer}
                                            renderer={Timer}
                                            onComplete={() => this.setInfo(false)}
                                        ></Countdown> */}
                                    </span>
                                </p>
                            </div>

                            <InfoDetail transferData={master} getConfirmPay={this.getConfirmPay} />
                            <ul className="txt_12_grey">
                                <li>請勿向上述地址充值任何非USDT資産，否則資産將不可找回。</li>
                                <br />
                                <li>
                                    您充值至上述地址後，需要整個網絡節點的確認，12次網絡確認後到賬，12次網絡確認後可提幣。
                                </li>
                                <br />
                                <li>
                                    最小充值金額：1 USDT，小于最小金額的充值將不會上賬且無法退回。
                                </li>
                                <br />
                                <li>
                                    您的充值地址不會經常改變，可以重複充值；如有更改，我們會盡量通過網站公告或郵件通知您。
                                </li>
                                <br />
                                <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
                                <li>
                                    USDT充幣僅支持以太坊transfer和transferFrom方法，使用其他方法的充幣暫時無法上賬，請您諒解。
                                </li>
                            </ul>
                            <Chat {...this.props} isChat={isChat} Tx_HASH={Tx_HASH} />
                            <Button
                                variant="primary"
                                className="talk-iconBox"
                                onClick={this.openChat}
                            >
                                <img src={TalkIcon} alt="talk icon" className="mr-2" />
                                <span>對話</span>
                            </Button>
                        </>
                    ) : !showInfo && !isCompletePay && stateId === 33 ? (
                        <>
                            {/* <Countdown
                                date={Date.now() + 10000}
                                renderer={ButtonTimer}
                                getConfirmPay={this.getConfirmPay}
                            ></Countdown> */}

                            <ButtonTimer
                                minutes={minutes2}
                                seconds={seconds2}
                                isCompleted={completed}
                                getConfirmPay={this.getConfirmPay}
                                getDeltaTime2={this.getDeltaTime2}
                            />

                            <Chat {...this.props} isChat={isChat} Tx_HASH={Tx_HASH} />
                            <Button
                                variant="primary"
                                className="talk-iconBox"
                                onClick={this.openChat}
                            >
                                <img src={TalkIcon} alt="talk icon" className="mr-2" />
                                <span>對話</span>
                            </Button>
                        </>
                    ) : stateId === 34 && isCompletePay && !transactionDone ? (
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
                            <Chat {...this.props} isChat={isChat} Tx_HASH={Tx_HASH} />
                            <Button
                                variant="primary"
                                className="talk-iconBox"
                                onClick={this.openChat}
                            >
                                <img src={TalkIcon} alt="talk icon" className="mr-2" />
                                <span>對話</span>
                            </Button>
                        </div>
                    ) : stateId === 1 || (isCompletePay && transactionDone) ? (
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
                            <Chat {...this.props} isChat={isChat} Tx_HASH={Tx_HASH} />
                            <Button
                                variant="primary"
                                className="talk-iconBox"
                                onClick={this.openChat}
                            >
                                <img src={TalkIcon} alt="talk icon" className="mr-2" />
                                <span>對話</span>
                            </Button>
                        </div>
                    ) : (
                        <BaseSpinner />
                    )}
                    {/* <Button onClick={this.openChat} variant="primary">
                        幫助
                    </Button> */}
                </div>
            </div>
        );
    }
}
