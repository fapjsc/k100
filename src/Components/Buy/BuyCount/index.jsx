import TransferHandle from '../TransferHandle';
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
          <TransferHandle />

          <Form.Row className="mb-4">
            <Form.Group as={Col}>
              <p>付款方式</p>
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
                style={{}}
                block
                className="easy-btn mw400"
                onClick={props.showPayDetail}
                variant="primary"
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
        <p className="txt_12_grey">
          請注意,透過網上銀行、流動銀行、付款服務、微型電郵或其他第三者付款平臺,直接轉帳予賣方。
          “如果您已經把錢匯給賣方，您絕對不能按賣方的付款方式單擊”取消交易”。
          除非你的付款帳戶已收到退款,否則沒有真正付款,切勿按交易規則所不允許的「付款」鍵。”
          <br />
          <br />
          OTC 貿易區目前只提供BCTC/USDT/TES/EOS/HT/HUST/XRP/LTC/BCH。
          如果你想用其他數字資產進行交易，請用貨幣進行交易。
          <br />
          <br />
          如你有其他問題或爭議,你可透過網頁聯絡。
        </p>
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
