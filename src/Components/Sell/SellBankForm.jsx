import { useState, useEffect, useContext } from 'react';

// Context
import SellContext from '../../context/sell/SellContext';
// import BalanceContext from '../../context/balance/BalanceContext';
// import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Style
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SellBankForm = () => {
  // Init State
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

  // // Balance Context
  // const balanceContext = useContext(BalanceContext);
  // const { wsPairing } = balanceContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getOrderToken, setWsPairing, sellCount, wsPairing } = sellContext;

  //   // Http Error Context
  //   const httpErrorContext = useContext(HttpErrorContext);
  //   const { errorText, setHttpError } = httpErrorContext;

  // ===========
  //  Function
  // ===========
  const onChange = e => {
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

  // 表單驗證
  const validForm = () => {
    setFormValid(true);

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

  // ===========
  //  UseEffect
  // ===========
  // 表單驗證後發送請求
  useEffect(() => {
    if (!formValid) return;

    const data = {
      usdt: sellCount.usdt,
      name: name.val,
      bank: bank.val,
      account: account.val,
      city: city.val,
    };

    setWsPairing(true);
    getOrderToken(data);
    setFormValid(false);

    //eslint-disable-next-line
  }, [formValid]);

  return (
    <Form>
      <Form.Row className="mt-20">
        <Form.Group as={Col} xl={6} sm={12} controlId="name" className="input-fill-x  mt-20">
          <Form.Control
            placeholder="收款姓名"
            name="name"
            isInvalid={!name.isValid}
            value={name.val}
            onChange={onChange}
            autoComplete="off"
            className="easy-border input-fill"
            style={{
              padding: 30,
              fontSize: 20,
            }}
          />
          <Form.Label className="input-label">收款姓名</Form.Label>

          {name.error && (
            <Form.Text className="" style={{ fontSize: '12px' }}>
              *{name.error}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} xl={6} sm={12} controlId="account" className="mt-20 input-fill-x">
          <Form.Control
            className="easy-border input-fill"
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
          <Form.Label className="input-label">收款帳號</Form.Label>

          {account.error && (
            <Form.Text className="" style={{ fontSize: '12px' }}>
              *{account.error}
            </Form.Text>
          )}
        </Form.Group>
      </Form.Row>

      <Form.Row className="">
        <Form.Group as={Col} xl={6} sm={12} controlId="bank" className="mt-20 input-fill-x">
          <Form.Control
            className="easy-border input-fill"
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
          <Form.Label className="input-label">開戶銀行</Form.Label>

          {bank.error && (
            <Form.Text className="" style={{ fontSize: '12px' }}>
              *{bank.error}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} xl={6} sm={12} controlId="city" className="mt-20 input-fill-x">
          <Form.Control
            className="easy-border input-fill"
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
          <Form.Label className="input-label">所在省市</Form.Label>

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

      <Form.Row className="justify-content-center">
        <Form.Group as={Col} className="mw400 px-0">
          <Button
            onClick={validForm}
            disabled={wsPairing}
            block
            className={wsPairing ? 'disable-easy-btn w-100' : 'easy-btn w-100'}
          >
            下一步
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
};

export default SellBankForm;
