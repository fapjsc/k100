import { Fragment, useState, useContext, useEffect } from 'react';

import { useMediaQuery } from 'react-responsive';

import SellContext from '../../context/sell/SellContext';
import BalanceContext from '../../context/balance/BalanceContext';
import BaseSpinner from '../Ui/BaseSpinner';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import changeMoney from '../../Assets/i_twoways.png';

const SellForm = () => {
  const mobileApp = useMediaQuery({ query: '(max-width: 1199px)' });
  // const smPoint = useMediaQuery({ query: '(max-width: 500px)' });

  const balanceContext = useContext(BalanceContext);
  const { getBalance, wsPairing, avb } = balanceContext;

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
    setWsPairing,
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
  const [showForm, setShowForm] = useState(false);

  // 獲取匯率
  // useEffect(() => {
  //     getExRate();
  //     // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    closeWebSocket();
    getExRate();
    getBalance();

    return () => {
      closeWebSocket();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [wsPairing]);

  // 連接WebSocket
  useEffect(() => {
    if (orderToken) {
      sellWebSocket(orderToken);
      // history.replace(`/home/transaction/sell/${orderToken}`);
    }

    return cleanOrderToken();
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

      setWsPairing(true);
      getOrderToken(data);
      setFormValid(false);
    }

    //eslint-disable-next-line
  }, [formValid]);

  const onChange = e => {
    if (e.target.name === 'usdt') {
      if (e.target.value < 0 || e.target.value === 'e') {
        setUsdt({
          val: '',
          isValid: true,
          error: '',
        });
        return;
      }

      let counter = (e.target.value * exRate).toFixed(2);
      setCny({
        val: counter,
        isValid: true,
        error: '',
      });
      setUsdt({
        val: e.target.value.replace(/^((-\d+(\.\d+)?)|((\.0+)?))$/).trim(),
        isValid: true,
        error: '',
      });
    }

    if (e.target.name === 'cny') {
      if (e.target.value < 0 || e.target.value === 'e') {
        setCny({
          val: '',
          isValid: true,
          error: '',
        });
        return;
      }
      let counter = (e.target.value / exRate).toFixed(2);
      setUsdt({
        val: counter,
        isValid: true,
        error: '',
      });
      setCny({
        val: e.target.value.replace(/^((-\d+)|(0+))$/).trim(),
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

    // 有1~2位小数的正數，且不能為0或0開頭
    // let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    // if (!rule.test(usdt.val) || !rule.test(cny.val)) {
    //     setUsdt({
    //         val: usdt.val,
    //         isValid: false,
    //         error: '請輸入有效數量, (不能為0，最多小數第二位)',
    //     });

    //     setFormValid(false);
    // }

    if (usdt.val > avb - Number(transferHandle)) {
      setUsdt({
        val: usdt.val,
        isValid: false,
        error: '超過最大可提',
      });

      setFormValid(false);
    }

    if (usdt.val === '' || usdt.val <= 0) {
      setUsdt({
        val: '',
        isValid: false,
        error: '請輸入有效數量',
      });

      setFormValid(false);
    }

    if (cny.val === '' || cny.val <= 0) {
      setCny({
        val: '',
        isValid: false,
        error: '請輸入有效數量',
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
      {exRate ? (
        <Form onSubmit={onSubmit}>
          {/* sell count */}
          <Form.Row
            className="mt-4"
            style={{
              marginBottom: '-12px',
            }}
          >
            <Form.Group as={Col} xl={5} className="mb-0 d-flex justify-content-end pr-0">
              {fetchLoading ? (
                <Button variant="secondary" disabled className="" style={{}}>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  Loading...
                </Button>
              ) : (
                <Button
                  disabled={fetchLoading}
                  variant="outline-primary"
                  size="sm"
                  className=""
                  onClick={fetchAll}
                  style={{}}
                >
                  提取所有
                </Button>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Group as={Col} xl={5} controlId="usdt" className="p-0 m-0">
              <Form.Control
                className="easy-border"
                placeholder="請輸入出售數量"
                autoComplete="off"
                type="number"
                isInvalid={!usdt.isValid}
                value={usdt.val}
                name="usdt"
                onChange={onChange}
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />

              {/* 錯誤提示 */}
              {usdt.error && (
                <Form.Text className="" style={{ fontSize: '12px' }}>
                  *{usdt.error}
                </Form.Text>
              )}

              <span style={inputText}>USDT</span>
            </Form.Group>

            {/* img */}
            <Form.Group as={Col} className=" my-3 d-flex align-items-start justify-content-center">
              <img
                className=""
                src={changeMoney}
                alt="change money"
                style={mobileApp ? changeMoneyIconMobile : changeMoneyIcon}
              />
            </Form.Group>

            <Form.Group as={Col} xl={5} controlId="cny" className="m-0 p-0">
              <Form.Control
                className="easy-border"
                autoComplete="off"
                type="number"
                name="cny"
                isInvalid={!cny.isValid}
                value={cny.val}
                onChange={onChange}
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />

              {/* {cny && (
                                <Form.Text className="text-left my-2 h4">{cny.error}</Form.Text>
                            )} */}
              <span style={inputText}>CNY</span>
            </Form.Group>
          </Form.Row>
          <div className="d-flex justify-content-between">
            <Form.Text className="text-left my-2">
              <span className="text-dark">手續費: {transferHandle}</span>
            </Form.Text>
          </div>

          <div className="mt-4">
            <p className="txt_12">電子錢包</p>
            <Button
              variant="outline-primary"
              size="sm"
              className=""
              onClick={() => setShowForm(!showForm)}
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
          <Form.Row className="mt-4">
            <Form.Group as={Col} xl={6} sm={12} controlId="name" className="mt-4">
              <Form.Label>收款姓名</Form.Label>
              <Form.Control
                placeholder="收款姓名"
                name="name"
                isInvalid={!name.isValid}
                value={name.val}
                onChange={onChange}
                autoComplete="off"
                className="easy-border "
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />
              {name.error && (
                <Form.Text className="" style={{ fontSize: '12px' }}>
                  *{name.error}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} xl={6} sm={12} controlId="bank" className="mt-4">
              <Form.Label>開戶銀行</Form.Label>
              <Form.Control
                className="easy-border"
                placeholder="開戶銀行"
                name="bank"
                isInvalid={!bank.isValid}
                value={bank.val}
                onChange={onChange}
                autoComplete="off"
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />
              {bank.error && (
                <Form.Text className="" style={{ fontSize: '12px' }}>
                  *{bank.error}
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="">
            <Form.Group as={Col} xl={6} sm={12} controlId="account" className="mt-4">
              <Form.Label>收款帳號</Form.Label>
              <Form.Control
                className="easy-border"
                placeholder="收款帳號"
                name="account"
                isInvalid={!account.isValid}
                value={account.val}
                onChange={onChange}
                autoComplete="off"
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />
              {account.error && (
                <Form.Text className="" style={{ fontSize: '12px' }}>
                  *{account.error}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} xl={6} sm={12} controlId="city" className="mt-4">
              <Form.Label>所在省市</Form.Label>
              <Form.Control
                className="easy-border"
                placeholder="所在省市"
                name="city"
                isInvalid={!city.isValid}
                value={city.val}
                onChange={onChange}
                autoComplete="off"
                style={{
                  padding: 30,
                  fontSize: 20,
                }}
              />
              {city.error && (
                <Form.Text
                  className=""
                  style={{
                    fontSize: '12px',
                  }}
                >
                  *{city.error}
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>
          <br />
          <br />
          <Button
            type="submit"
            disabled={wsPairing}
            block
            className="easy-btn mw400"
            // variant={!wsPairing ? 'primary' : 'secondary'}
            // style={smPoint ? sellFormBtnSmPoint : sellFormBtn}
            style={{
              backgroundColor: wsPairing && 'grey',
            }}
          >
            下一步
          </Button>

          {/* <button onClick={props.showPayDetail}>下一步</button> */}
        </Form>
      ) : (
        <BaseSpinner />
      )}

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

const changeMoneyIcon = {
  width: 45,
};

const changeMoneyIconMobile = {
  transform: 'rotate(90deg)',
  width: 45,
};

// const sellFormBtn = {
//   height: 50,
//   fontSize: 18,
//   borderRadius: 5,
//   maxWidth: '50%',
// };

// const sellFormBtnSmPoint = {
//   height: 50,
//   fontSize: 18,
//   borderRadius: 5,
//   width: '100%',
// };

const inputText = {
  color: '#D7E2F3',
  position: 'absolute',
  top: 0,
  transform: 'translateY(75%)',
  right: 30,
  fontSize: 17,
};

export default SellForm;
