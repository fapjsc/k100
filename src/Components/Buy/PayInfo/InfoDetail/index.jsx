import SetAccount from '../../SetAccount';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const infoDetail = props => {
  return (
    <>
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
                  {props.transferData.rmb}
                </span>
              </p>
              <p>收款姓名： {props.transferData.payee}</p>
              <p>付款帳號： {props.transferData.account}</p>
              <p>開戶銀行： {props.transferData.bank}</p>
              <p>所在省市： {props.transferData.branch}</p>
            </Col>
            <Col xl={6} className="align-self-center">
              <SetAccount rmbAmt={props.transferData.rmb} usdtAmt={props.transferData.usdtAmt} />
            </Col>
          </Row>

          <div className="text-center">
            <button className="easy-btn smScreen-btn" onClick={props.getConfirmPay}>
              已完成付款
            </button>
            <p>取消訂單</p>
          </div>
        </>
      )}
    </>
  );
};

export default infoDetail;
