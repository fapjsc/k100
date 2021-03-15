import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './index.scss';
import Spinner from 'react-bootstrap/Spinner';

const ConfirmBuy = props => {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            props.handleConfirm().then(() => {
                setLoading(false);
            });
        }
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    return (
        <div>
            <form className="confirmBuyContent">
                <Form.Group controlId="formBasicEmail">
                    <Form.Control
                        placeholder="請輸入銀行卡持有人姓名"
                        onChange={props.getClientName}
                        className="confirmBuyInput"
                    />
                    <Form.Text className="text-muted">請輸入銀行卡持有人姓名</Form.Text>
                    <Button
                        className="buyCount-btn"
                        variant="primary"
                        disabled={props.isPairing || props.pairFinish || props.pair || isLoading}
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
                </Form.Group>
                <div className="confirmBuy-textContent">
                    <div className="confirmBuy-textBox">
                        <div className="confirmBuy-title">
                            總價:
                            <p className="confirmBuy-text">{props.rmbAmt} CNY</p>
                        </div>
                    </div>

                    <div className="confirmBuy-textBox">
                        <div>
                            數量:
                            <p className="confirmBuy-text text-dark">{props.usdtAmt} USDY</p>
                        </div>
                    </div>

                    <hr />

                    <div className="confirmBuy-textBox">
                        <div>
                            單價:
                            <p className="confirmBuy-text">{props.rmbAmt / props.usdtAmt} CNY</p>
                        </div>
                    </div>
                </div>

                {/* <Button onClick={props.handleConfirm} variant="primary">
                開始配對
            </Button> */}
            </form>
        </div>
    );
};

export default ConfirmBuy;
