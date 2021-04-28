import { useState, useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator';

import AuthContext from '../../context/auth/AuthContext';

import { Form, Col, Spinner, Button } from 'react-bootstrap';
import './Login/index.scss';

const LoginForm = () => {
  const authContext = useContext(AuthContext);
  const { login, loginLoading, errorText, setErrorText } = authContext;

  const [countryCode, setCountryCode] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [phoneNumber, setPhoneNumber] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [password, setPassword] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (formIsValid) {
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
        password: password.val,
      };

      login(data);

      return setFormIsValid(false);
    }
  }, [formIsValid]);

  const onChange = e => {
    setErrorText('');
    if (e.target.name === 'countryCode') {
      if (e.target.value.includes('中國')) {
        setCountryCode({
          val: '86',
          isValid: true,
          error: '',
        });
      }

      if (e.target.value.includes('台灣')) {
        setCountryCode({
          val: '886',
          isValid: true,
          error: '',
        });
      }

      if (e.target.value.includes('香港')) {
        setCountryCode({
          val: '852',
          isValid: true,
          error: '',
        });
      }
    }

    if (e.target.name === 'phoneNumber') {
      setPhoneNumber({
        val: e.target.value.trim(),
        isValid: true,
        error: '',
      });
    }

    if (e.target.name === 'password') {
      setPassword({
        val: e.target.value.trim(),
        isValid: true,
        error: '',
      });
    }
  };

  // valid
  const validateForm = async () => {
    setFormIsValid(true);

    // 驗證區碼
    if (!countryCode.val) {
      setCountryCode({
        val: '',
        isValid: false,
        error: '請選擇區碼',
      });

      setFormIsValid(false);
    }

    // 驗證電話號碼
    if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: '請輸入有效的電話號碼',
      });

      setFormIsValid(false);
    }

    //驗證密碼
    if (password.val === '' || !validator.isAlphanumeric(password.val) || password.val.length < 6) {
      setPassword({
        val: '',
        isValid: false,
        error: '密碼只能是英文及數字，且至少六位數',
      });
      setFormIsValid(false);
    }
  };

  return (
    <Fragment>
      <div className="form-container">
        <Form>
          <Form.Row>
            <Form.Group as={Col} md="4" controlId="CountryCode">
              <Form.Control
                style={{
                  fontSize: '17px',
                  color: '#495057',
                }}
                as="select"
                defaultValue="區號"
                className="form-select mb-4 pl-3"
                name="countryCode"
                onChange={onChange}
                isInvalid={countryCode.error}
              >
                <option disabled>區號</option>
                <option>中國＋86</option>
                <option>台灣＋886</option>
                <option>香港＋852</option>
              </Form.Control>
              {countryCode.error && (
                <Form.Text
                  className="mb-4"
                  style={{ fontSize: '12px' }}
                >{`*${countryCode.error}`}</Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} md="8" controlId="formBasicPhoneNumber">
              <Form.Control
                isInvalid={phoneNumber.error}
                className="form-select mb-4"
                name="phoneNumber"
                size="lg"
                type="tel"
                placeholder="手機號碼"
                onChange={onChange}
                value={phoneNumber.val}
                // onChange={this.setPhoneNumber}
                autoComplete="off"
              />
              {phoneNumber.error && (
                <Form.Text
                  className="mb-4"
                  style={{ fontSize: '12px' }}
                >{`*${phoneNumber.error}`}</Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} xl={12} controlId="formBasicPassword">
              <Form.Control
                isInvalid={password.error}
                className="form-select mb-4"
                name="password"
                size="lg"
                type="password"
                placeholder="密碼"
                onChange={onChange}
                value={password.val}
                // onChange={this.setPassword}
                autoComplete="off"
              />
              {password.error && (
                <Form.Text
                  className="mb-4"
                  style={{ fontSize: '12px' }}
                >{`*${password.error}`}</Form.Text>
              )}

              {errorText && (
                <Form.Text
                  className="mb-4"
                  style={{ fontSize: '12px' }}
                >{`*${errorText}`}</Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Button
            onClick={validateForm}
            style={{
              display: 'block',
              width: '100%',
              background: loginLoading ? 'grey' : '#3e80f9',
              cursor: loginLoading ? 'auto' : 'pointer',
            }}
            disabled={loginLoading}
            className="easy-btn"
            type="button"
          >
            {loginLoading && (
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                className="mr-2"
              />
            )}

            <span>{loginLoading ? '處理中' : '登入'}</span>
          </Button>
          <div className="forget_pw-box">
            <Link to="/forget-pw" className="forget_pw-link">
              <span className="forget_pw"></span>
              <u>忘記密碼</u>
            </Link>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};

export default LoginForm;
