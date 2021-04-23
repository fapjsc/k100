import ExRate from '../ExRate';

import Spinner from '../../Ui/BaseSpinner';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import changeMoney from '../../../Assets/i_twoways.png';

import './index.scss';

const BuyCount = props => {
  return (
    <>
      <ExRate title="購買USDT" />
      {/* <p
        style={{
          letterSpacing: '1.5px',
          color: '#3242e47',
          fontSize: '12px',
        }}
      >
        購買USDT
      </p>
      <div className="pay-info txt_12 mb-4">
        <p className="mb-0">
          匯率 :<span>{props.exRate ? props.exRate.RMB_BUY : null}</span>
        </p>
        <p className="mb-0">
          付款窗口 :<span>15分鐘</span>
        </p>
        <p className="mb-0">
          限額 :<span>100 - 10000</span>
        </p>
      </div> */}
      {props.exRate ? (
        <Form style={formStyle}>
          <Form.Row className="align-items-center">
            <Form.Group as={Col} xl={5} controlId="usdt" className="">
              <Form.Control
                style={formInput}
                className="align-self-center easy-border"
                // placeholder={props.usdtAmt ? props.usdtAmt : 'USDT'}
                placeholder="請輸入購買數量"
                value={props.usdtAmt ? props.usdtAmt : ''}
                // onChange={props.getUsdtAmt}
                onChange={props.getRmbAmt}
                autoComplete="off"
                type="number"
                isInvalid={props.error}
              />

              <span style={inputText}>USDT</span>
              {props.error && (
                <Form.Text
                  className=""
                  style={{
                    fontSize: '12px',
                  }}
                >
                  <span className="">*{props.error}</span>
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} className="transaction-twoWay">
              {/* <span className="twoWay-icon "></span> */}
              <img className="twoWay-icon" src={changeMoney} alt="change money" />
            </Form.Group>

            <Form.Group className="" as={Col} xl={5} controlId="cny">
              <Form.Control
                style={formInput}
                // placeholder={props.rmbAmt ? props.rmbAmt : 'CNY'}
                value={props.rmbAmt ? props.rmbAmt : ''}
                onChange={props.getRmbAmt}
                autoComplete="off"
                type="number"
                className="easy-border "
              />
              {/* <Form.Text>adf</Form.Text> */}
              <span style={inputText}>CNY</span>
            </Form.Group>
          </Form.Row>
          {/* <p
          style={{
            letterSpacing: 1.5,
            marginBottom: 20,
          }}
        >
          手續費：5.00USDT
        </p> */}
          {/* <Form.Row className="mb-4 ">
            <Form.Group as={Col} className="text-right">
              <TransferHandle />
            </Form.Group>
          </Form.Row> */}

          <Form.Row className="mb-4">
            <Form.Group as={Col}>
              <p className="txt_12">付款方式</p>
              <Button
                disabled
                style={{
                  marginTop: -8,
                  padding: 10,
                  fontSize: 17,
                }}
                size="lg"
                variant="outline-primary"
              >
                銀行卡
              </Button>
            </Form.Group>
          </Form.Row>

          <Form.Row
            className="text-center"
            style={{
              maxWidth: 400,
              margin: 'auto',
            }}
          >
            <Form.Group as={Col}>
              <button
                style={{ width: '100%' }}
                className="easy-btn mw400"
                onClick={props.showPayDetail}
              >
                下一步
              </button>
            </Form.Group>
          </Form.Row>

          {/* <button onClick={props.showPayDetail}>下一步</button> */}
        </Form>
      ) : (
        <Spinner />
      )}

      <div>
        <hr className="mt_mb" />
        <ul className="txt_12_grey">
          <li>本平台目前只提供USDT（ERC20 & TRC)交易，其他數字貨幣交易將不予受理</li>
          <br />
          <li>本平台錢包地址充值或轉出，都是經由 USDT區塊鏈系統網絡確認。</li>
          <br />
          <li>本平台錢包地址可以重複充值或轉出；如因系統更新，我們會通過網站或口訊通知。</li>
          <br />
          <li>請勿向錢包地址充值任何非USDT資産，否則資産將不可找回。</li>
          <br />
          <li>最小充值金額：100USDT，小于最小金額的充值將不會上賬且無法退回。</li>
          <br />
          <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
          <br />
          <li>如有其他問題或要求提出爭議，可透過網頁上的客服對話窗聯絡我們。</li>
        </ul>
      </div>
    </>
  );
};

const formStyle = {
  marginTop: 20,
};

const formInput = {
  padding: 30,
};

const inputText = {
  color: '#D7E2F3',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-45%)',
  right: 35,
  fontSize: 17,
};

export default BuyCount;
