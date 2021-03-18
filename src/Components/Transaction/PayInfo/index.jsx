import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';

import Countdown from 'react-countdown';

export default class index extends Component {
    state = {
        showInfo: true,
        time: 1000 * 60 * 15, // 15分鐘
        // time: 1000 * 60 * 60,
    };

    setInfo = () => {
        this.setState({
            showInfo: false,
        });
    };

    componentDidMount() {
        console.log('pay info mount');
        console.log(this.props);
    }

    render() {
        const { transferData, pair, isPairing, getConfirmPay } = this.props;
        const { showInfo, time } = this.state;

        return (
            <div>
                {isPairing ? null : pair && transferData.MasterType === 0 ? (
                    <div className="pairBox">
                        {showInfo ? (
                            <>
                                <div className="pair-titleBox">
                                    <p>轉帳資料</p>
                                    <p>
                                        剩餘支付時間:
                                        <span className="payTime">
                                            <Countdown
                                                date={Date.now() + time}
                                                renderer={Timer}
                                                onComplete={this.setInfo}
                                            ></Countdown>
                                        </span>
                                    </p>
                                </div>

                                <InfoDetail
                                    transferData={transferData}
                                    getConfirmPay={getConfirmPay}
                                />
                            </>
                        ) : (
                            <>
                                <Countdown
                                    date={Date.now() + time}
                                    renderer={ButtonTimer}
                                    getConfirmPay={getConfirmPay}
                                ></Countdown>
                            </>
                        )}
                    </div>
                ) : null}
            </div>
        );
    }
}
