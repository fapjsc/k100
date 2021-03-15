import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import changeMoney from '../../../Assets/i_twoways.png';

import './index.scss';

const BuyCount = props => {
    return (
        <>
            <form className="buyCountForm">
                <Form.Group controlId="usdt">
                    <Form.Control
                        className="buyCount-input"
                        placeholder={props.usdtAmt ? props.usdtAmt : 'USDT'}
                        onChange={props.getUsdtAmt}
                    />
                    {/* <Form.Text className="text-muted">手續費: 5.00USDT</Form.Text> */}
                </Form.Group>

                <div className="transaction-twoWay">
                    <img className="twoWay-icon" src={changeMoney} alt="change money" />
                </div>

                <Form.Group controlId="cny">
                    <Form.Control
                        className="buyCount-input"
                        placeholder={props.rmbAmt ? props.rmbAmt : 'CNY'}
                        onChange={props.getRmbAmt}
                    />
                </Form.Group>

                {/* <button onClick={props.showPayDetail}>下一步</button> */}
            </form>

            <p>手續費: 5.00USDT</p>
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
        </>
    );
};

export default BuyCount;
