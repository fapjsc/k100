import { Fragment, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import SellContext from '../../context/sell/SellContext';
import BalanceContext from '../../context/balance/BalanceContext';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import changeMoney from '../../Assets/i_twoways.png';

const SellForm = () => {
    const history = useHistory();

    const balanceContext = useContext(BalanceContext);
    const { getBalance, wsPairing } = balanceContext;

    const sellContext = useContext(SellContext);
    const {
        sellWebSocket,
        closeWebSocket,
        getExRate,
        getOrderToken,
        transferHandle,
        exRate,
        orderToken,
        cleanOrderToken,
    } = sellContext;

    const [usdt, setUsdt] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [cny, setCny] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [name, setName] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [bank, setBank] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [account, setAccount] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [city, setCity] = useState({
        val: '',
        isValid: true,
        error: '',
    });

    const [formValid, setFormValid] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    // 獲取匯率
    useEffect(() => {
        getExRate();
        // eslint-disable-next-line
    }, []);

    // 連接WebSocket
    useEffect(() => {
        if (orderToken) {
            console.log('call ws connect');
            sellWebSocket(orderToken);
            // history.replace(`/home/transaction/sell/${orderToken}`);
        }

        cleanOrderToken();

        // eslint-disable-next-line
    }, [orderToken]);

    // 表單驗證後發送請求
    useEffect(() => {
        if (!formValid) {
            return;
        } else {
            const data = {
                usdt: usdt.val,
                name: name.val,
                bank: bank.val,
                account: account.val,
                city: city.val,
            };

            getOrderToken(data);

            setFormValid(false);
        }

        //eslint-disable-next-line
    }, [formValid]);

    const onChange = e => {
        if (e.target.name === 'usdt') {
            let counter = (e.target.value * exRate).toFixed(2);
            setCny({
                val: counter,
                isValid: true,
                error: '',
            });
            setUsdt({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }

        if (e.target.name === 'cny') {
            let counter = (e.target.value / exRate).toFixed(2);
            setUsdt({
                val: counter,
                isValid: true,
                error: '',
            });
            setCny({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }

        if (e.target.name === 'name') {
            setName({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }

        if (e.target.name === 'bank') {
            setBank({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }

        if (e.target.name === 'account') {
            setAccount({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }

        if (e.target.name === 'city') {
            setCity({
                val: e.target.value.trim(),
                isValid: true,
                error: '',
            });
        }
    };

    // 提取所有
    const fetchAll = async () => {
        setFetchLoading(true);
        const balance = await getBalance();

        let usdtCount = (balance.Avb_Balance - Number(transferHandle)).toFixed(2);
        let cnyCount = (usdtCount * Number(exRate)).toFixed(2);

        setUsdt({
            val: usdtCount,
            isValid: true,
            error: '',
        });

        setCny({
            val: cnyCount,
            isValid: true,
            error: '',
        });

        setFetchLoading(false);
    };

    // 表單驗證
    const validForm = () => {
        setFormValid(true);

        if (usdt.val === '') {
            setUsdt({
                val: '',
                isValid: false,
                error: '請輸入數量',
            });

            setFormValid(false);
        }

        if (cny.val === '') {
            setCny({
                val: '',
                isValid: false,
                error: '請輸入數量',
            });

            setFormValid(false);
        }

        if (name.val === '') {
            setName({
                val: '',
                isValid: false,
                error: '請輸入收款人姓名',
            });

            setFormValid(false);
        }

        if (bank.val === '') {
            setBank({
                val: '',
                isValid: false,
                error: '請輸入開戶銀行',
            });

            setFormValid(false);
        }

        if (account.val === '') {
            setAccount({
                val: '',
                isValid: false,
                error: '請輸入收款帳號',
            });

            setFormValid(false);
        }

        if (city.val === '') {
            setCity({
                val: '',
                isValid: false,
                error: '請輸入所在省市',
            });

            setFormValid(false);
        }
    };

    const onSubmit = e => {
        e.preventDefault();
        validForm();
    };

    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                {/* sell count */}
                <Row className="d-flex align-items-center ">
                    <Col lg={5} md={12} sm={12}>
                        <Form.Group controlId="usdt" className="text-right">
                            {fetchLoading ? (
                                <Button
                                    variant="secondary"
                                    disabled
                                    style={{
                                        marginBottom: -30,
                                    }}
                                >
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading...
                                </Button>
                            ) : (
                                <Button
                                    disabled={fetchLoading}
                                    variant="outline-primary"
                                    size="sm"
                                    className=""
                                    onClick={fetchAll}
                                    style={{
                                        marginBottom: -30,
                                    }}
                                >
                                    提取所有
                                </Button>
                            )}

                            <Form.Control
                                className=""
                                placeholder="USDT"
                                autoComplete="off"
                                type="number"
                                isInvalid={!usdt.isValid}
                                value={usdt.val}
                                name="usdt"
                                onChange={onChange}
                                style={{
                                    padding: 25,
                                    marginTop: 30,
                                    fontSize: 20,
                                }}
                            />
                            <div className="d-flex justify-content-between">
                                {usdt && (
                                    <Form.Text className="text-left my-2 h4">
                                        {usdt.error}
                                    </Form.Text>
                                )}
                                <Form.Text className="text-left my-2">
                                    <span className="text-dark">手續費: {transferHandle}</span>
                                </Form.Text>
                            </div>
                        </Form.Group>
                    </Col>

                    {/* img */}
                    <Col className="text-center">
                        <img
                            className=""
                            src={changeMoney}
                            alt="change money"
                            style={{
                                width: 45,
                            }}
                        />
                    </Col>

                    <Col lg={5} md={12} sm={12}>
                        <Form.Group controlId="cny">
                            <Form.Control
                                className=""
                                placeholder="CNY"
                                autoComplete="off"
                                type="number"
                                name="cny"
                                isInvalid={!cny.isValid}
                                value={cny.val}
                                onChange={onChange}
                                style={{
                                    padding: 25,
                                    marginTop: 19,
                                    fontSize: 20,
                                }}
                            />

                            {/* {cny && (
                                <Form.Text className="text-left my-2 h4">{cny.error}</Form.Text>
                            )} */}
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mt-4">
                    <p
                        style={{
                            fontSize: 16,
                        }}
                    >
                        電子錢包
                    </p>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className=""
                        style={{
                            fontSize: 20,
                            paddingLeft: 30,
                            paddingRight: 30,
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderRadius: 6,
                        }}
                    >
                        銀行卡
                    </Button>
                </div>

                {/* info */}
                <Row>
                    <Col>
                        <Form.Group controlId="name">
                            <Form.Control
                                className="buyCount-input"
                                placeholder="收款姓名"
                                name="name"
                                isInvalid={!name.isValid}
                                value={name.val}
                                onChange={onChange}
                                autoComplete="off"
                            />
                        </Form.Group>
                        {name.error && (
                            <Form.Text className="text-left my-2 h4">{name.error}</Form.Text>
                        )}
                    </Col>
                    <Col>
                        <Form.Group controlId="bank">
                            <Form.Control
                                className="buyCount-input"
                                placeholder="開戶銀行"
                                name="bank"
                                isInvalid={!bank.isValid}
                                value={bank.val}
                                onChange={onChange}
                                autoComplete="off"
                            />
                        </Form.Group>
                        {bank.error && (
                            <Form.Text className="text-left my-2 h4">{bank.error}</Form.Text>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group controlId="account">
                            <Form.Control
                                className="buyCount-input"
                                placeholder="收款帳號"
                                name="account"
                                isInvalid={!account.isValid}
                                value={account.val}
                                onChange={onChange}
                                autoComplete="off"
                            />
                        </Form.Group>
                        {account.error && (
                            <Form.Text className="text-left my-2 h4">{account.error}</Form.Text>
                        )}
                    </Col>
                    <Col>
                        <Form.Group controlId="city">
                            <Form.Control
                                className="buyCount-input"
                                placeholder="所在省市"
                                name="city"
                                isInvalid={!city.isValid}
                                value={city.val}
                                onChange={onChange}
                                autoComplete="off"
                            />
                        </Form.Group>
                        {city.error && (
                            <Form.Text className="text-left my-2 h4">{city.error}</Form.Text>
                        )}
                    </Col>
                </Row>
                <br />
                <br />
                <Button
                    type="submit"
                    disabled={wsPairing}
                    block
                    className="m-auto"
                    variant={!wsPairing ? 'primary' : 'secondary'}
                    style={{
                        height: 50,
                        fontSize: 18,
                        width: 300,
                        borderRadius: 5,
                    }}
                >
                    下一步
                </Button>

                {/* <button onClick={props.showPayDetail}>下一步</button> */}
            </form>
            <hr className="mt_mb" />
            <p className="txt_12_grey">
                由于数字资产价格随时存在较⼤波动，第⼆步交易报价的有效期为20分钟（即：您下单付款到⼴告⽅放币的时间需控制在20分钟内）。
                <br />
                <br />
                如果您对新的报价不予接受的，将直接获得第⼀步交易购入的USDT。
                <br />
                <br />
                USDT是系统根据您所需购买⾦额（或数量）和付款⽅式匹配出的最低价格，并且您可随时使⽤USDT在币币交易兑换其他数字资产。
            </p>
        </Fragment>
    );
};

export default SellForm;
