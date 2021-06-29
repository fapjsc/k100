import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import validator from 'validator';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

// Lang Context
import { useI18n } from '../../../lang';

// Components
import ValidCode from './ValidCode';

// Style
import { Form, Button, Col, Fade, Spinner } from 'react-bootstrap';
import './index.scss';

const RegisterForm = () => {
  // Lang Context
  const { t } = useI18n();

  // Router Props
  const history = useHistory();

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

  const [confirmPassword, setConfirmPassword] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [countryCode, setCountryCode] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [captcha, setCaptcha] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [checkAccountErr, setCheckAccountErr] = useState('');

  const [agree, setAgree] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [showValidCode, setShowValidCode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handlePhoneNumber = event => {
    setPhoneNumber({
      val: event.target.value.trim(),
      isValid: true,
      error: '',
    });
  };

  const handlePassword = event => {
    setPassword({
      val: event.target.value.trim(),
      isValid: true,
      error: '',
    });
  };

  const handleConfirmPassword = event => {
    setConfirmPassword({
      val: event.target.value.trim(),
      isValid: true,
      error: '',
    });
  };

  const handleCountryCode = e => {
    if (e.target.value.includes('中國')) {
      setCountryCode({
        val: 86,
        isValid: true,
        error: '',
      });
      setShowAlert(true);
    }

    if (e.target.value.includes('台灣')) {
      setCountryCode({
        val: 886,
        isValid: true,
        error: '',
      });

      setShowAlert(false);
    }
    if (e.target.value.includes('香港')) {
      setCountryCode({
        val: 852,
        isValid: true,
        error: '',
      });
      setShowAlert(false);
    }
  };

  const handleCaptcha = e => {
    setCaptcha({
      val: e.target.value,
      isValid: true,
      error: '',
    });
  };

  const handleAgree = event => {
    setAgree(event.target.checked);
  };

  const validRegister = async () => {
    setFormIsValid(true);

    // captcha
    if (!validateCaptcha(captcha.val)) {
      setCaptcha({
        val: '',
        isValid: false,
        error: '驗證碼錯誤',
      });
      setFormIsValid(false);
      setBtnLoading(false);
    }

    //驗證區碼
    if (countryCode.val === '' || countryCode.val === null) {
      setCountryCode({
        val: null,
        isValid: false,
        error: '請選擇區碼',
      });
      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證中國手機是否為11碼
    if (countryCode.val === 86 && phoneNumber.val.length !== 11) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: '請輸入有效的電話號碼',
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證香港手機是否為8碼
    if (countryCode.val === 852 && phoneNumber.val.length !== 8) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: '請輸入有效的電話號碼',
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    // 驗證電話號碼
    if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: '請輸入有效的電話號碼',
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    //驗證密碼
    if (password.val === '' || !validator.isAlphanumeric(password.val) || password.val.length < 6) {
      setPassword({
        val: '',
        isValid: false,
        error: '密碼只能是英文及數字，且至少六位數',
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }

    if (password.val !== confirmPassword.val) {
      setConfirmPassword({
        val: confirmPassword.val,
        isValid: false,
        error: '兩次密碼不一致',
      });

      setFormIsValid(false);
      setBtnLoading(false);
    }
  };

  const gotToAgreePage = () => {
    history.push('/agreement');
  };

  const checkAccountExists = async data => {
    const checkAccount = `/j/ChkLoginExists.aspx`;

    const res = await fetch(checkAccount, {
      method: 'POST',
      body: JSON.stringify({
        reg_countrycode: data.countryCode,
        reg_tel: data.phoneNumber,
      }),
    });

    const resData = await res.json();

    if (resData.code === 200) {
      setShowValidCode(true);
    }

    if (resData.code === '11') {
      setCheckAccountErr('此手機號碼已經註冊過');
      setFormIsValid(false);
      setBtnLoading(false);
    }

    setBtnLoading(false);
  };

  const handleRegisterSubmit = async event => {
    event.preventDefault(); //防止表單提交

    setBtnLoading(true);

    await validRegister();
  };

  useEffect(() => {
    if (formIsValid) {
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
      };

      checkAccountExists(data);
    }
    return () => {
      setFormIsValid(false);
    };
    // eslint-disable-next-line
  }, [formIsValid]);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  return (
    <>
      <div className="form-container">
        {!showValidCode ? (
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
                  onChange={handleCountryCode}
                  isInvalid={!countryCode.isValid}
                >
                  <option disabled>區號</option>
                  <option>中國＋86</option>
                  <option>台灣＋886</option>
                  <option>香港＋852</option>
                </Form.Control>
                {countryCode.error && (
                  <Form.Text
                    style={{
                      fontSize: '12px',
                    }}
                    className="mb-4"
                  >{`*${countryCode.error}`}</Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} md="8" controlId="formBasicPhoneNumber">
                <Form.Control className="form-select mb-4" size="lg" type="tel" placeholder="手機號碼" onChange={handlePhoneNumber} isInvalid={!phoneNumber.isValid} autoComplete="off" />
                {phoneNumber.error && (
                  <Form.Text
                    style={{
                      fontSize: '12px',
                    }}
                    className="mb-4"
                  >{`*${phoneNumber.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12} controlId="formBasicPassword">
                <Form.Control className="form-select mb-4" size="lg" type="password" placeholder="設置密碼" onChange={handlePassword} isInvalid={!password.isValid} />
                {password.error && (
                  <Form.Text
                    style={{
                      fontSize: '12px',
                    }}
                    className="mb-4"
                  >{`*${password.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12} controlId="formConfirmPassword">
                <Form.Control className="form-select mb-4" size="lg" type="password" placeholder="確認密碼" onChange={handleConfirmPassword} />
                {confirmPassword.error && (
                  <Form.Text
                    style={{
                      fontSize: '12px',
                    }}
                    className="mb-4"
                  >{`*${confirmPassword.error}`}</Form.Text>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={12}>
                <Form.Control
                  isInvalid={captcha.error}
                  style={{
                    fontSize: '12px',
                  }}
                  className="form-select mb-4"
                  size="lg"
                  placeholder="驗證碼區分大小寫"
                  value={captcha.val}
                  onChange={handleCaptcha}
                  autoComplete="off"
                />
                {captcha.error && <Form.Text className="mb-4" style={{ fontSize: '12px' }}>{`*${captcha.error}`}</Form.Text>}

                {checkAccountErr && <Form.Text className="mb-4" style={{ fontSize: '12px' }}>{`*${checkAccountErr}`}</Form.Text>}
                <LoadCanvasTemplate style={{ width: 150, height: 30 }} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group controlId="formBasicCheckbox" className="user-agreement">
                <Form.Check className="user-agreement__check" type="checkbox" label="我已閱讀並同意" onChange={handleAgree} checked={agree} />
                <span
                  style={{
                    cursor: 'pointer',
                    fontSize: 12,
                    alignSelf: 'flex-end',
                    marginBottom: 1,
                  }}
                  onClick={gotToAgreePage}
                >{`《用戶協議》`}</span>
              </Form.Group>
            </Form.Row>

            <Button
              onClick={handleRegisterSubmit}
              className="form-btn"
              // variant="primary"
              variant={!agree || btnLoading ? 'secondary' : 'primary'}
              block
              type="submit"
              disabled={!agree || btnLoading}
            >
              {btnLoading && <Spinner as="span" animation="grow" size="md" role="status" aria-hidden="true" />}
              {btnLoading ? '處理中..' : '下一步'}
            </Button>
            <br />
            {showAlert && (
              <Fade in={showAlert}>
                <div id="example-fade-text" className="text-danger">
                  <div className="d-flex align-items-center mb-2">
                    <svg xmlns="../../../Assets/cone-striped.svg" width="16" height="16" fill="red" class="bi bi-cone-striped" viewBox="0 0 16 16">
                      <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
                    </svg>
                    <p className="ml-3 mb-0" style={{ color: 'red' }}>
                      請注意！
                    </p>
                  </div>
                  <p style={{ color: 'red' }}>
                    因你身處地區受當地電訊條例限制，可能會較慢受到系統發出的簡訊，請耐心等候或重新申請一次。 如仍未能成功或其他問題，請聯絡我們客戶服務微信號，即有專人協助。微信帳號： 238bien
                  </p>
                </div>
              </Fade>
            )}
          </Form>
        ) : (
          <ValidCode phoneNumber={phoneNumber.val} countryCode={countryCode.val} password={password.val} />
        )}
      </div>
    </>
  );
};

export default RegisterForm;
