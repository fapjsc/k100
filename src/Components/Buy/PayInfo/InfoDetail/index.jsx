import { useState } from 'react';

import SetAccount from '../../SetAccount';
import CancelSell from '../../../Sell/CancelSell';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import copy from 'copy-to-clipboard';

const InfoDetail = props => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = () => {
    setBtnLoading(true);
    if (!isClick) {
      props.getConfirmPay();
    }
    setIsClick(true);
  };

  const handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert('複製成功');
    } else {
      alert('複製失敗，請手動複製');
    }
  };

  return (
    <>
      {confirmCancel && props.transferData ? (
        <CancelSell
          show={confirmCancel}
          hash={props.transferData.txHASH}
          handleClose={setConfirmCancel}
          orderToken={props.orderToken}
          cancelOrder={props.cancelOrder}
        />
      ) : null}

      {!props.transferData ? null : (
        <>
          <Row className="my-4 justify-content-between pl-4">
            <Col xl={6} className="txt_12 lightblue_bg mb-4 pl-3">
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">
                  付款金額: &emsp;
                  <span
                    style={{
                      color: '#3e80f9',
                      fontSize: '17px',
                      fontWeight: 'bold',
                    }}
                  >
                    {props.transferData.rmb} CNY
                  </span>
                </p>
                <div
                  onClick={() => handleCopy(props.transferData.rmb)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">收款姓名： {props.transferData.payee}</p>
                <div
                  onClick={() => handleCopy(props.transferData.payee)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">付款帳號： {props.transferData.account}</p>
                <div
                  onClick={() => handleCopy(props.transferData.account)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">開戶銀行： {props.transferData.bank}</p>
                <div
                  onClick={() => handleCopy(props.transferData.bank)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              <p>所在省市： {props.transferData.branch}</p>
            </Col>
            <Col xl={5} className="">
              <SetAccount rmbAmt={props.transferData.rmb} usdtAmt={props.transferData.usdtAmt} />
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col className="mw400 text-center">
              <Button
                disabled={isClick}
                className="easy-btn w-100"
                onClick={handleSubmit}
                style={{
                  cursor: btnLoading ? 'auto' : 'pointer',
                }}
              >
                {btnLoading && <Spinner animation="grow" variant="danger" />}
                {btnLoading ? '處理中...' : '已完成付款'}
              </Button>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={setConfirmCancel}
              >
                取消訂單
              </p>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default InfoDetail;
