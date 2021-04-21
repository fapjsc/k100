import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import './index.scss';
import Spinner from 'react-bootstrap/Spinner';

import ExRate from '../ExRate';

const ConfirmBuy = props => {
  const [isLoading, setLoading] = useState(false);

  // let handleConfirm = props.handleConfirm;

  useEffect(() => {
    if (isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  // const handleClick = () => setLoading(true);

  const handleClick = () => {
    setLoading(true);
    props.handleConfirm();
  };

  const thousandBitSeparator = num => {
    return (
      num &&
      (num.toString().indexOf('.') != -1
        ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ',';
          })
        : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
            return $1 + ',';
          }))
    );
  };

  return (
    <>
      <div>
        <ExRate title="購買USDT" />
        {/* 姓名輸入以及submit button */}
        <Form className="confirmBuyContent">
          <Form.Row>
            <Form.Group
              as={Col}
              md={6}
              sm={12}
              className="mr-4 mt-3 d-flex flex-column justify-content-center px-0"
              controlId="formBasicClientName"
            >
              <Form.Control
                placeholder="請輸入銀行卡持有人姓名"
                onChange={props.getClientName}
                className="confirmBuyInput easy-border"
                autoComplete="off"
                isInvalid={props.error}
              />

              {props.error && <Form.Text className="">*{props.error}</Form.Text>}
              <p
                style={{
                  color: '#eb0303',
                  fontSize: 12,
                }}
                className=""
              >
                *請輸入轉帳銀行卡持有人的真實姓名
              </p>
            </Form.Group>

            {/* 購買資訊 */}
            <Form.Group as={Col} className="confirmBuy-textContent px-4">
              <div className="confirmBuy-textBox">
                <p className="txt_12_grey mb-0">總價</p>
                <p className="confirmBuy-text c_blue mb-0">
                  {thousandBitSeparator(Number(props.rmbAmt).toFixed(2).toString())}
                  CNY
                </p>
              </div>

              <div className="confirmBuy-textBox text-right">
                <p className="txt_12_grey mb-0">數量</p>
                <p className="confirmBuy-text mb-0 text-dark">
                  {/* 小數第二位，千分逗號 */}
                  {thousandBitSeparator(Number(props.usdtAmt).toFixed(2).toString())}
                  USDT
                </p>
              </div>
            </Form.Group>
          </Form.Row>

          <Form.Row className="justify-content-center mt-4">
            <Form.Group as={Col} className="mw400 px-0">
              <Button
                style={{
                  fontSize: 17,
                  borderRadius: '5px',
                }}
                className="easy-btn w-100"
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
          </Form.Row>
        </Form>
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
