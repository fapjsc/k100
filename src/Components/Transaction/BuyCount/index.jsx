import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import changeMoney from '../../../Assets/i_twoways.png';

import './index.scss';

const BuyCount = props => {
    console.log('buy count mount');
    return (
        <>
            <form className="buyCountForm">
                <Form.Group controlId="usdt">
                    <Form.Control
                        className="buyCount-input"
                        // placeholder={props.usdtAmt ? props.usdtAmt : 'USDT'}
                        placeholder="USDT"
                        value={props.usdtAmt ? props.usdtAmt : ''}
                        // onChange={props.getUsdtAmt}
                        onChange={props.getRmbAmt}
                    />
                    {/* <Form.Text className="text-muted">手續費: 5.00USDT</Form.Text> */}
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
                    />
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
        </>
    );
};

export default BuyCount;
