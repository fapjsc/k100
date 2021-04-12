import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import changeMoney from '../../../Assets/i_twoways.png';

import './index.scss';

const BuyCount = props => {
    return (
        <>
            <p>購買USDT</p>
            <div className="pay-info">
                <p>
                    匯率 :<span>{props.exRate ? props.exRate.RMB_BUY : null}</span>
                </p>
                <p>
                    付款窗口 :<span>30分鐘</span>
                </p>
                <p>
                    限額 :<span>100 - 10000</span>
                </p>
            </div>
            <form className="buyCountForm">
                <Form.Group controlId="usdt">
                    <Form.Control
                        className="buyCount-input"
                        // placeholder={props.usdtAmt ? props.usdtAmt : 'USDT'}
                        placeholder="USDT"
                        value={props.usdtAmt ? props.usdtAmt : ''}
                        // onChange={props.getUsdtAmt}
                        onChange={props.getRmbAmt}
                        autoComplete="off"
                        type="number"
                    />
                    {props.error && (
                        <Form.Text className="text-muted">
                            <span className="">{props.error}</span>
                        </Form.Text>
                    )}
                </Form.Group>

                <div className="transaction-twoWay">
                    {/* <span className="twoWay-icon "></span> */}
                    <img className="twoWay-icon" src={changeMoney} alt="change money" />
                </div>

                <Form.Group controlId="cny">
                    <Form.Control
                        className="buyCount-input"
                        // placeholder={props.rmbAmt ? props.rmbAmt : 'CNY'}
                        placeholder="CNY"
                        value={props.rmbAmt ? props.rmbAmt : ''}
                        onChange={props.getRmbAmt}
                        autoComplete="off"
                    />
                    {/* <Form.Text>adf</Form.Text> */}
                </Form.Group>

                <div className="btn-box">
                    <Button
                        size="lg"
                        className="buyCount-btn"
                        onClick={props.showPayDetail}
                        variant="primary"
                    >
                        下一步
                    </Button>
                </div>

                {/* <button onClick={props.showPayDetail}>下一步</button> */}
            </form>
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

export default BuyCount;
