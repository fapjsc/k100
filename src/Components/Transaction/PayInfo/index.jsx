import React, { Component } from 'react';

import InfoDetail from './InfoDetail';
import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';

import Countdown from 'react-countdown';
import Button from 'react-bootstrap/Button';

export default class index extends Component {
    state = {
        showInfo: true,
        timer: 5000,
    };

    setInfo = () => {
        this.setState({
            showInfo: false,
        });
    };

    render() {
        const { transferData, pair, isPairing, getConfirmPay } = this.props;
        const { showInfo, timer } = this.state;

        return (
            <div>
                {isPairing ? null : pair && transferData.MasterType === 0 ? (
                    <div className="pairBox">
                        <div className="pair-titleBox">
                            <p>轉帳資料</p>
                            {showInfo ? (
                                <p>
                                    剩餘支付時間:
                                    <span className="payTime">
                                        <Countdown
                                            date={Date.now() + timer}
                                            renderer={Timer}
                                            setInfo={this.setInfo}
                                        ></Countdown>
                                    </span>
                                </p>
                            ) : null}
                        </div>

                        {showInfo ? (
                            <>
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
                                    date={Date.now() + timer}
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
