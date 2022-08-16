import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validator from 'validator';
import Countdown from 'react-countdown';

// Context
import AuthContext from '../../context/auth/AuthContext';

// Lang Context
import { useI18n } from '../../lang';

// Components
import BaseSpinner from '../Ui/BaseSpinner';
import ErrorModal from '../Ui/ErrorModal';
import Timer from './Timer';

// Style
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';

const ForgetPassword = () => {
  // Lang Context
  const { t } = useI18n();
  // Router Props
  const history = useHistory();

  // Auth Context
  const authContext = useContext(AuthContext);
  const {
    getValidCode,
    isSendValidCode,
    checkValidCode,
    authLoading,
    validToken,
    forgetPassword,
    showErrorModal,
    cleanErr,
    setCountDown,
    expiredTime,
    checkAccountExists,
    accountIsExists,
    setAccountExists,
    setErrorText,
    removeValidToken,
  } = authContext;

  // Init State
  const [errText, setErrText] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  // phone Data
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

  const [phoneValid, setPhoneValid] = useState(false);

  // 驗證碼
  const [validCode, setValidCode] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  // 密碼
  const [newPassword, setNewPassword] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [confirmPassword, setConfirmPassword] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [passwordValid, setPasswordValid] = useState(false);

  // loading
  const [isLoading, setLoading] = useState(false);

  // eslint-disable-next-line
  const [expirTime, setExpirTime] = useState(null);

  const handleChange = e => {

    if (e.target.name === 'countryCode') {
      setAccountExists('notYetConfirm');

      if (e.target.value === '86') {
        setCountryCode({
          val: 86,
          isValid: true,
          error: '',
        });
      }

      if (e.target.value === '886') {
        setCountryCode({
          val: 886,
          isValid: true,
          error: '',
        });
      }
      if (e.target.value === '852') {
        setCountryCode({
          val: 852,
          isValid: true,
          error: '',
        });
      }
    }

    if (e.target.name === 'phoneNumber') {
      if (e.target.value.startsWith("0")) {
        e.target.value = e.target.value.split("0")[1];
      }
      setAccountExists('notYetConfirm');
      setPhoneNumber({
        val: e.target.value,
        isValid: true,
        error: '',
      });
    }

    if (e.target.name === 'validCode') {
      setValidCode({
        val: e.target.value,
        isValid: true,
        error: '',
      });
    }

    if (e.target.name === 'newPassword') {
      setNewPassword({
        val: e.target.value,
        isValid: true,
        error: '',
      });
    }

    if (e.target.name === 'confirmPassword') {
      setConfirmPassword({
        val: e.target.value,
        isValid: true,
        error: '',
      });
    }
  };

  const validPhoneNumber = () => {
    setPhoneValid(true);

    // 驗證電話號碼
    if (phoneNumber.val === '' || !validator.isMobilePhone(phoneNumber.val)) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: t('invalid_phoneNumber'),
      });

      setPhoneValid(false);
    }

    //驗證區碼
    if (countryCode.val === '' || countryCode.val === null || countryCode.val === t('countryCode')) {
      setCountryCode({
        val: t('countryCode'),
        isValid: false,
        error: t('no_countryCode'),
      });

      setPhoneValid(false);
    }

    // 驗證中國手機是否為11碼
    if (countryCode.val === 86 && phoneNumber.val.length !== 11) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: t('invalid_phoneNumber'),
      });

      setPhoneValid(false);
    }

    // 驗證香港手機是否為8碼
    if (countryCode.val === 852 && phoneNumber.val.length !== 8) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: t('invalid_phoneNumber'),
      });

      setPhoneValid(false);
    }

    // 驗證台灣手機是否為或9碼
    if (countryCode.val === 886 && phoneNumber.val.length !== 9) {
      setPhoneNumber({
        val: '',
        isValid: false,
        error: t('invalid_phoneNumber'),
      });

      setPhoneValid(false);
    }
  };

  // send valid code
  const sendValidCode = async () => {
    setLoading(true);

    const data = {
      countryCode: countryCode.val,
      phoneNumber: phoneNumber.val,
    };

    console.log(data)
    await getValidCode(data);
    setLoading(false);
  };

  const validPassword = () => {
    setPasswordValid(true);
    //驗證密碼
    if (newPassword.val === '' || !validator.isAlphanumeric(newPassword.val) || newPassword.val.length < 6) {
      setNewPassword({
        val: '',
        isValid: false,
        error: t('invalid_password'),
      });

      setPasswordValid(false);
    }

    if (newPassword.val !== confirmPassword.val) {
      setConfirmPassword({
        val: confirmPassword.val,
        isValid: false,
        error: t('confirm_password_fail'),
      });

      setPasswordValid(false);
    }
  };

  const goToLogin = () => {
    cleanErr();
    // setAccountExists('notYetConfirm');
    // setErrorText('');
    // setShowNewPw(false);
    history.replace('/auth/login');
  };

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    return () => {
      setAccountExists('notYetConfirm');
      setErrorText('');
      setShowNewPw(false);
      removeValidToken();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (accountIsExists === 'notExists') setErrText(t('no_account'));
    if (accountIsExists === 'exists' || accountIsExists === 'notYetConfirm') setErrText('');
    // eslint-disable-next-line
  }, [accountIsExists]);

  useEffect(() => {
    if (errText) setPhoneValid(false);
  }, [errText]);

  useEffect(() => {
    if (phoneValid) {
      // 驗證帳號是否已經註冊
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
      };
      checkAccountExists(data);
    }
    // eslint-disable-next-line
  }, [phoneValid]);

  useEffect(() => {
    if (validCode.val.length === 6) {
      console.log(phoneNumber.val)
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
        validCode: validCode.val,
      };

      checkValidCode(data);
    }

    // eslint-disable-next-line
  }, [validCode]);

  useEffect(() => {
    if (validToken) {
      setShowNewPw(true);
    }
  }, [validToken]);

  useEffect(() => {
    if (passwordValid) {
      if (countryCode.val === 886) {
        console.log(phoneNumber.val)
        // phoneNumber.val = phoneNumber.val.substr(1);
      }
      const data = {
        countryCode: countryCode.val,
        phoneNumber: phoneNumber.val,
        password: newPassword.val,
        token: validToken,
      };
      forgetPassword(data);
    }

    // eslint-disable-next-line
  }, [passwordValid]);

  return (
    <div className="authBg">
      <div className="user-auth">
        <Card body className="mt_120 mx-auto p_sm" style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '500px' }}>
          {showErrorModal.show && <ErrorModal show={showErrorModal.show} title={showErrorModal.text} status={showErrorModal.status} onHide={showErrorModal.status === 'fail' ? cleanErr : goToLogin} />}
          <Form className="mx400">
            <h1 className="mb-4 text-center">{t('btn_forget_password')}</h1>

            <br />
            {authLoading ? (
              <BaseSpinner />
            ) : (
              <>
                <Form.Row className="mx-auto d-flex justify-content-between">
                  <Form.Group className="" as={Col} md={4} controlId="CountryCode">
                    <Form.Control
                      style={{
                        fontSize: '17px',
                        color: '#495057',
                      }}
                      as="select"
                      defaultValue={t('countryCode')}
                      className="form-select"
                      disabled={phoneValid || showNewPw}
                      name="countryCode"
                      onChange={handleChange}
                    >
                      <option disabled value={t('countryCode')}>
                        {t('countryCode')}
                      </option>
                      <option value="86">{t('china')}</option>
                      <option value="886">{t('taiwan')}</option>
                      <option value="852">{t('hk')}</option>
                    </Form.Control>
                    {countryCode.error && <Form.Text style={{ fontSize: 12 }}>*{countryCode.error}</Form.Text>}
                  </Form.Group>

                  <Form.Group className="" as={Col} md={8} controlId="phoneNumber">
                    <Form.Control
                      className="form-select"
                      size="lg"
                      type="number"
                      placeholder={t('phoneNumber')}
                      autoComplete="off"
                      disabled={phoneValid || showNewPw}
                      name="phoneNumber"
                      value={phoneNumber.val}
                      onChange={handleChange}
                      onWheel={(event) => {
                        event.currentTarget.blur();
                      }}
                    />
                    {phoneNumber.error && <Form.Text style={{ fontSize: 12 }}>*{phoneNumber.error}</Form.Text>}
                  </Form.Group>
                </Form.Row>

                <Form.Row className="mx-auto justify-content-center">
                  <Form.Group as={Col} xl={12} className="">
                    <Button
                      onClick={validPhoneNumber}
                      aria-controls="example-collapse-text"
                      aria-expanded={phoneValid}
                      className="easy-btn w-100"
                      disabled={phoneValid || showNewPw}
                      // variant={showNewPw && 'secondary'}
                      style={{
                        cursor: phoneValid || showNewPw ? 'not-allowed' : 'pointer',
                        backgroundColor: phoneValid || showNewPw ? 'grey' : '#3e80f9',
                      }}
                    >
                      {t('btn_continue')}
                    </Button>
                    {errText && <Form.Text style={{ marginBottom: 10, fontSize: 12, color: 'red' }}>*{errText}</Form.Text>}
                  </Form.Group>
                </Form.Row>

                <Collapse in={countryCode.val === 86}>
                  <div id="example-fade-text" className="text-danger">
                    <div className="d-flex align-items-center mb-2">
                      <svg xmlns="../../Assets/cone-striped.svg" width="16" height="16" fill="red" className="bi bi-cone-striped" viewBox="0 0 16 16">
                        <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
                      </svg>
                      <p className="ml-3 mb-0" style={{ fontSize: 12, color: 'red' }}>
                        {t('china_area_alert_1')}
                      </p>
                    </div>
                    <p style={{ fontSize: '12px', color: 'red' }}>{t('china_area_alert_2')}</p>
                  </div>
                </Collapse>

                <Collapse in={accountIsExists === 'exists' && !showNewPw}>
                  <Form.Row className="mx-auto justify-content-between align-items-center mb-4">
                    <Form.Group as={Col} xl={8} className="">
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon3">VEK&nbsp;-</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control className="form-select " type="number" placeholder={t('enter_valid')} autoComplete="off" name="validCode" value={validCode.val} onChange={handleChange} />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-4" xl={4}>
                      {isSendValidCode && expiredTime ? (
                        <Countdown date={expiredTime} onComplete={() => setCountDown(false)} renderer={props => <Timer phoneValid={phoneValid} setExpirTime={setExpirTime} {...props} />}></Countdown>
                      ) : (
                        <>
                          <Button
                            onClick={sendValidCode}
                            aria-controls="example-collapse-text"
                            aria-expanded={phoneValid}
                            className="w-100 easy-btn-bs"
                            disabled={isLoading}
                            style={{
                              cursor: isLoading ? 'auto' : 'pointer',
                              backgroundColor: isLoading ? 'grey' : '#3e80f9',
                            }}
                          >
                            {isLoading && <Spinner className="mr-3" animation="grow" variant="danger" />}

                            {!isLoading ? <span>{t('btn_send_valid_code')}</span> : <span>{t('btn_loading')}...</span>}
                          </Button>
                        </>
                      )}
                    </Form.Group>
                    <Form.Text className="pl-2" style={{ fontSize: 12 }}>
                      {t('alert_text_1')}
                    </Form.Text>
                  </Form.Row>
                </Collapse>

                <Collapse in={showNewPw}>
                  <Form.Row className="mx-auto justify-content-between">
                    <Form.Group as={Col} xl={12} className="mb-4">
                      <Form.Control
                        className="form-select"
                        type="password"
                        placeholder={t('enter_new_password')}
                        autoComplete="off"
                        name="newPassword"
                        value={newPassword.val}
                        onChange={handleChange}
                      />
                      {newPassword.error && <Form.Text style={{ fontSize: 12 }}>*{newPassword.error}</Form.Text>}
                    </Form.Group>

                    <Form.Group as={Col} xl={12} className="mb-4">
                      <Form.Control
                        className="form-select"
                        type="password"
                        placeholder={t('enter_confirm_password')}
                        autoComplete="off"
                        name="confirmPassword"
                        value={confirmPassword.val}
                        onChange={handleChange}
                      />
                      {confirmPassword.error && <Form.Text style={{ fontSize: 12 }}>*{confirmPassword.error}</Form.Text>}
                    </Form.Group>

                    <Form.Group as={Col} className="" xl={12}>
                      <Button onClick={validPassword} className="w-100 h-100 easy-btn-bs">
                        {t('btn_confirm')}
                      </Button>
                    </Form.Group>
                  </Form.Row>
                </Collapse>

                <Form.Row className="">
                  <Form.Group as={Col} xl={12} className="mb-0">
                    <Button className="easy-btn-bs w-100 bg-white" style={{ backgroundColor: '#f2f2f2', color: 'grey' }} onClick={goToLogin}>
                      {t('btn_back_to_login')}
                    </Button>
                  </Form.Group>
                </Form.Row>
              </>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgetPassword;
