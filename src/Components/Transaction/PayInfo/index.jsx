import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';

import Countdown from 'react-countdown';
import Button from 'react-bootstrap/Button';

export default class index extends Component {
    state = {
        showInfo: true,
        // time: 1000 * 60 * 15, // 15分鐘
        time: 5000,
    };

    setInfo = () => {
        this.setState({
            showInfo: false,
        });
    };

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
                                <InfoDetail transferData={transferData} />
                                <div className="pairFoot">
                                    <Button
                                        variant="primary"
                                        className="pairFoot-btn"
                                        onClick={getConfirmPay}
                                    >
                                        已完成付款，下一步...
                                    </Button>
                                    <p>取消訂單</p>
                                </div>
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
