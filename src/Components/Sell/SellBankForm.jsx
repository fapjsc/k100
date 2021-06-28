import { useState, useEffect, useContext } from 'react';

// Context
import SellContext from '../../context/sell/SellContext';

// Lang Context
import { useI18n } from '../../lang';

// Style
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SellBankForm = () => {
  // Lang Context
  const { t } = useI18n();

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

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getOrderToken, setWsPairing, sellCount, wsPairing } = sellContext;

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
        error: t('sell_error_enter_payee'),
      });

      setFormValid(false);
    }

    if (bank.val === '') {
      setBank({
        val: '',
        isValid: false,
        error: t('sell_error_enter_bank'),
      });

      setFormValid(false);
    }

    if (account.val === '') {
      setAccount({
        val: '',
        isValid: false,
        error: t('sell_error_enter_payee_account'),
      });

      setFormValid(false);
    }

    if (city.val === '') {
      setCity({
        val: '',
        isValid: false,
        error: t('sell_error_enter_city'),
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
            placeholder={t('sell_payee')}
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
          <Form.Label className="input-label">{t('sell_payee')}</Form.Label>

          {name.error && (
            <Form.Text className="" style={{ fontSize: '12px' }}>
              *{name.error}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} xl={6} sm={12} controlId="account" className="mt-20 input-fill-x">
          <Form.Control
            className="easy-border input-fill"
            placeholder={t('sell_payee_account')}
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
          <Form.Label className="input-label">{t('sell_payee_account')}</Form.Label>

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
            placeholder={t('sell_bank')}
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
          <Form.Label className="input-label">{t('sell_bank')}</Form.Label>

          {bank.error && (
            <Form.Text className="" style={{ fontSize: '12px' }}>
              *{bank.error}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} xl={6} sm={12} controlId="city" className="mt-20 input-fill-x">
          <Form.Control
            className="easy-border input-fill"
            placeholder={t('sell_city')}
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
          <Form.Label className="input-label">{t('sell_city')}</Form.Label>

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
          <Button onClick={validForm} disabled={wsPairing} block className={wsPairing ? 'disable-easy-btn w-100' : 'easy-btn w-100'}>
            {t('btn_next')}
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
};

export default SellBankForm;
