import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';
import CompletePay from '../CompletePay';

import Countdown from 'react-countdown';

export default class PayInfo extends Component {
    state = {
        headers: {},
        showInfo: true,
        data: null,
        time: 1000 * 60 * 15, // 15分鐘
        // time: 3000,
    };

    setInfo = () => {
        this.setState({
            showInfo: false,
        });
    };

    getConfirmPay = async () => {
        console.log('pay info mount');
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
                    Token: this.props.orderToken,
                }),
            });

            const resData = await res.json();

            console.log(resData, 'buy2');
        } catch (error) {
            alert(error);
        }
    };

    componentDidMount() {}

    render() {
        const {
            transactionDone,
            history,
            isCompletePay,
            transferData,
            location: { state },
        } = this.props;
        const { showInfo, time } = this.state;

        return (
            <div>
                <div className="pairBox">
                    {showInfo === true && !isCompletePay ? (
                        <>
                            <div className="pair-titleBox">
                                <p>轉帳資料</p>
                                <p>
                                    剩餘支付時間:
                                    <span className="payTime">
                                        <Countdown
                                            date={Date.now() + time}
                                            renderer={Timer}
                                            onComplete={() => this.setInfo(false)}
                                        ></Countdown>
                                    </span>
                                </p>
                            </div>

                            <InfoDetail transferData={state} getConfirmPay={this.getConfirmPay} />
                        </>
                    ) : showInfo === false && !isCompletePay ? (
                        <>
                            <Countdown
                                date={Date.now() + time}
                                renderer={ButtonTimer}
                                getConfirmPay={this.getConfirmPay}
                            ></Countdown>
                        </>
                    ) : isCompletePay ? (
                        <CompletePay
                            history={history}
                            transferData={state}
                            transactionDone={transactionDone}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}
