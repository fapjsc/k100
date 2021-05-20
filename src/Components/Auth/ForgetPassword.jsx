import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validator from 'validator';
import Countdown from 'react-countdown';

// Context
import AuthContext from '../../context/auth/AuthContext';

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
import Fade from 'react-bootstrap/Fade';

const ForgetPassword = () => {
  const authContext = useContext(AuthContext);

  const history = useHistory();

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
  } = authContext;

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
      if (e.target.value.includes('中國')) {
        setCountryCode({
          val: 86,
          isValid: true,
          error: '',
        });
      }

      if (e.target.value.includes('台灣')) {
        setCountryCode({
          val: 886,
          isValid: true,
          error: '',
        });
      }

      if (e.target.value.includes('香港')) {
        setCountryCode({
          val: 852,
          isValid: true,
          error: '',
        });
      }
    }

    if (e.target.name === 'phoneNumber') {
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
        error: '請輸入有效的電話號碼',
      });

      setPhoneValid(false);
    }

    //驗證區碼
    if (countryCode.val === '' || countryCode.val === null || countryCode.val === '區號') {
      setCountryCode({
        val: '區號',
        isValid: false,
        error: '請選擇區號',
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
    await getValidCode(data);
    setLoading(false);
  };

  const validPassword = () => {
    setPasswordValid(true);
    //驗證密碼
    if (
      newPassword.val === '' ||
      !validator.isAlphanumeric(newPassword.val) ||
      newPassword.val.length < 6
    ) {
      setNewPassword({
        val: '',
        isValid: false,
        error: '密碼只能是英文及數字，且至少六位數',
      });

      setPasswordValid(false);
    }

    if (newPassword.val !== confirmPassword.val) {
      setConfirmPassword({
        val: confirmPassword.val,
        isValid: false,
        error: '兩次密碼不一致',
      });

      setPasswordValid(false);
    }
  };

  const goToLogin = () => {
    cleanErr();
    history.replace('/auth/login');
  };

  useEffect(() => {
    if (validCode.val.length === 6) {
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
        phoneNumber.val = phoneNumber.val.substr(1);
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
    <div className="user-auth">
      <Card
        body
        className="mt_120 mx-auto p_sm"
        style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '500px' }}
      >
        {showErrorModal.show && (
          <ErrorModal
            show={showErrorModal.show}
            title={showErrorModal.text}
            status={showErrorModal.status}
            onHide={showErrorModal.status === 'fail' ? cleanErr : goToLogin}
          />
        )}
        <Form className="mx400">
          <h1 className="mb-4 text-center">忘記密碼</h1>

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
                    defaultValue="區號"
                    className="form-select"
                    disabled={phoneValid || showNewPw}
                    name="countryCode"
                    onChange={handleChange}
                  >
                    <option disabled>區號</option>
                    <option>中國＋86</option>
                    <option>台灣＋886</option>
                    <option>香港＋852</option>
                  </Form.Control>
                  {countryCode.error && (
                    <Form.Text style={{ fontSize: 12 }}>*{countryCode.error}</Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="" as={Col} md={8} controlId="phoneNumber">
                  <Form.Control
                    className="form-select"
                    size="lg"
                    type="tel"
                    placeholder="手機號碼"
                    autoComplete="off"
                    disabled={phoneValid || showNewPw}
                    name="phoneNumber"
                    value={phoneNumber.val}
                    onChange={handleChange}
                  />
                  {phoneNumber.error && (
                    <Form.Text style={{ fontSize: 12 }}>*{phoneNumber.error}</Form.Text>
                  )}
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
                    繼續
                  </Button>

                  {/* {!showValid && <Form.Text>*點擊按鈕後發送一次性密碼</Form.Text>} */}
                </Form.Group>
              </Form.Row>

              <Fade in={countryCode.val === 86}>
                <div id="example-fade-text" className="text-danger">
                  <div className="d-flex align-items-center mb-2">
                    <svg
                      xmlns="../../Assets/cone-striped.svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-cone-striped"
                      viewBox="0 0 16 16"
                    >
                      <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
                    </svg>
                    <p className="ml-3 mb-0" style={{ fontSize: 12 }}>
                      請注意！
                    </p>
                  </div>
                  <p style={{ fontSize: '12px' }}>
                    因你身處地區受當地電訊條例限制，可能會較慢受到系統發出的簡訊，請耐心等候或重新申請一次。
                    如仍未能成功或其他問題，請聯絡我們客戶服務微信號，即有專人協助。微信帳號：
                    238bien
                  </p>
                </div>
              </Fade>

              <Collapse in={phoneValid && !showNewPw}>
                <Form.Row className="mx-auto justify-content-between align-items-center mb-4">
                  <Form.Group as={Col} xl={8} className="">
                    <Form.Control
                      className="form-select "
                      type="number"
                      placeholder="輸入驗證碼"
                      autoComplete="off"
                      name="validCode"
                      value={validCode.val}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} className="mb-4" xl={4}>
                    {isSendValidCode && expiredTime ? (
                      // <>
                      //   <Button
                      //     aria-controls="example-collapse-text"
                      //     aria-expanded={phoneValid}
                      //     className="w-100 easy-btn-bs"
                      //     disabled
                      //   >
                      //     驗證碼已發送
                      //   </Button>

                      //   <Form.Text className="pl-2">*輸入六位數驗證碼後系統自動驗證</Form.Text>
                      // </>

                      <Countdown
                        // date={expirTime ? expirTime : Date.now() + 1000 * 60 * 2}
                        date={expiredTime}
                        onComplete={() => setCountDown(false)}
                        renderer={props => (
                          <Timer phoneValid={phoneValid} setExpirTime={setExpirTime} {...props} />
                        )}
                      ></Countdown>
                    ) : (
                      // <button disabled={timing} onClick={() => setTiming(true)}>
                      //   {timing ? 'Timing ' + second : 'Go'}
                      // </button>
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
                          {isLoading && (
                            <Spinner className="mr-3" animation="grow" variant="danger" />
                          )}

                          {!isLoading ? <span>發送驗證碼</span> : <span>Loading...</span>}
                        </Button>
                      </>
                    )}
                  </Form.Group>
                  <Form.Text className="pl-2" style={{ fontSize: 12 }}>
                    *點擊按鈕後發送一次性驗證碼
                  </Form.Text>
                </Form.Row>
              </Collapse>

              <Collapse in={showNewPw}>
                <Form.Row className="mx-auto justify-content-between">
                  <Form.Group as={Col} xl={12} className="mb-4">
                    <Form.Control
                      className="form-select"
                      type="password"
                      placeholder="輸入新密碼"
                      autoComplete="off"
                      name="newPassword"
                      value={newPassword.val}
                      onChange={handleChange}
                    />
                    {newPassword.error && (
                      <Form.Text style={{ fontSize: 12 }}>*{newPassword.error}</Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} xl={12} className="mb-4">
                    <Form.Control
                      className="form-select"
                      type="password"
                      placeholder="確認密碼"
                      autoComplete="off"
                      name="confirmPassword"
                      value={confirmPassword.val}
                      onChange={handleChange}
                    />
                    {confirmPassword.error && (
                      <Form.Text style={{ fontSize: 12 }}>*{confirmPassword.error}</Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} className="" xl={12}>
                    <Button onClick={validPassword} className="w-100 h-100 easy-btn-bs">
                      確定
                    </Button>
                  </Form.Group>
                </Form.Row>
              </Collapse>

              <Form.Row className="mt-4">
                <Form.Group as={Col} xl={12} className="mb-0">
                  <Button
                    className="easy-btn-bs w-100 bg-white"
                    style={{ backgroundColor: '#f2f2f2', color: 'grey' }}
                    onClick={goToLogin}
                  >
                    回登入頁面
                  </Button>
                </Form.Group>
              </Form.Row>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ForgetPassword;
