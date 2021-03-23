import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './index.scss';
import Spinner from 'react-bootstrap/Spinner';

const ConfirmBuy = props => {
    console.log('confirm buy mount');
    const [isLoading, setLoading] = useState(false);

    let handleConfirm = props.handleConfirm;

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
        }
    }, [isLoading]);

    // const handleClick = () => setLoading(true);

    const handleClick = () => {
        setLoading(true);
        handleConfirm();
    };

    return (
        <>
            <div>
                {/* 姓名輸入以及submit button */}
                <form className="confirmBuyContent">
                    <div className="confirmBuy-formGroup">
                        <Form.Group controlId="formBasicClientName">
                            <Form.Control
                                placeholder="請輸入銀行卡持有人姓名"
                                onChange={props.getClientName}
                                className="confirmBuyInput"
                                autoComplete="off"
                            />
                            <Form.Text className="text-muted">請輸入銀行卡持有人姓名</Form.Text>
                            <div className="buyCount-btnBox">
                                <Button
                                    className="buyCount-btn"
                                    variant="primary"
                                    disabled={
                                        props.isPairing ||
                                        props.pairFinish ||
                                        props.pair ||
                                        isLoading
                                    }
                                    onClick={!isLoading ? handleClick : null}
                                >
                                    {props.pairFinish ? (
                                        '完成配對'
                                    ) : props.isPairing ? (
                                        <>
                                            <Spinner animation="grow" variant="danger" />
                                            配對中...
                                        </>
                                    ) : (
                                        '開始配對'
                                    )}
                                </Button>
                            </div>
                        </Form.Group>
                    </div>

                    {/* 購買資訊 */}
                    <div className="confirmBuy-textContent">
                        <div className="confirmBuy-textBox">
                            <div className="confirmBuy-title">
                                總價:
                                <p className="confirmBuy-text">
                                    {Number(props.rmbAmt)
                                        .toFixed(2)
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                    CNY
                                </p>
                            </div>
                        </div>

                        <div className="confirmBuy-textBox confirmBuy-textBox-total">
                            <div>
                                數量:
                                <p className="confirmBuy-text text-dark font-weight-bold">
                                    {Number(props.usdtAmt)
                                        .toFixed(2)
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                    USDT
                                </p>
                            </div>
                        </div>

                        {/* <div className="confirmBuy-textBox">
                        <div>
                            單價:
                            <p className="confirmBuy-text">
                                {Number(props.rmbAmt / props.usdtAmt)
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                CNY
                            </p>
                        </div>
                    </div> */}
                    </div>
                </form>
            </div>

            <div>
                <hr className="mt_mb" />
                <p className="txt_12_grey">
                    信息為幣商的指定收款賬戶，請務必按照規則操作，網銀轉賬到賬戶。
                </p>
            </div>
        </>
    );
};

export default ConfirmBuy;