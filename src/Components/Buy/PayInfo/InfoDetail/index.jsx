import { useState } from 'react';

import SetAccount from '../../SetAccount';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CancelSell from '../../../Sell/CancelSell';

const InfoDetail = props => {
  const [confirmCancel, setConfirmCancel] = useState(false);

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
          <Row className="my-4">
            <Col xl={6} className="txt_12 lightblue_bg mb-4">
              <p>
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
              <p>收款姓名： {props.transferData.payee}</p>
              <p>付款帳號： {props.transferData.account}</p>
              <p>開戶銀行： {props.transferData.bank}</p>
              <p>所在省市： {props.transferData.branch}</p>
            </Col>
            <Col xl={6} className="px-0">
              <SetAccount rmbAmt={props.transferData.rmb} usdtAmt={props.transferData.usdtAmt} />
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col className="mw400 text-center">
              <button className="easy-btn w-100" onClick={props.getConfirmPay}>
                已完成付款
              </button>
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
