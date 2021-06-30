import React, { useEffect, useState, useRef, Fragment } from 'react';
import Countdown from 'react-countdown';

// Components
import SuccessRegister from '../successRegister';
import ButtonTimer from './ButtonTimer';
import Spinner from '../../../Ui/BaseSpinner';

// Lang Context
import { useI18n } from '../../../../lang';

// Style
import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import './index.scss';

const ValidCode = props => {
  const { phoneNumber, countryCode, password } = props;

  const clockRef = useRef();

  // Lang Context
  const { t } = useI18n();

  const [validNum, setValidNum] = useState(''); // user 輸入驗證碼的值
  const [formIsValid, setFormIsValid] = useState(false);
  const [error, setError] = useState('');
  const [resendValidCode, setResendValidCode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  // const [inputValid, setInputValid] = useState(false);
  const [timer] = useState(120000);
  const [token, setToken] = useState();

  // 驗證碼如果是六位數的話
  const handleValidCode = event => {
    setValidNum(event.target.value.trim());
  };

  useEffect(() => {
    if (validNum.length === 6) {
      setError('');
      handleSubmit(phoneNumber, countryCode);
    } else {
      setFormIsValid(false);
      setError('');
    }
    // eslint-disable-next-line
  }, [validNum]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('expiresIn');
    };
  }, []);

  const handleHttpError = data => {
    if (data.code === '1') {
      setError(t('http_error_code_1'));
      return;
    }

    if (data.code === '10') {
      setError(t('http_error_code_10'));
      return;
    }

    if (data.code === '11') {
      setError(t('http_error_code_11'));
      return;
    }

    if (data.code === '12') {
      setError(t('http_error_code_12'));
      return;
    }

    if (data.code === '13') {
      setError(t('http_error_code_13'));
      return;
    }
    if (data.code === '14') {
      setError(t('http_error_code_14'));
      return;
    }

    if (data.code === '15') {
      setError(t('http_error_code_15'));
      return;
    }

    if (data.code === '16') {
      setError(t('http_error_code_16'));
      return;
    }

    if (data.code === '17') {
      setError(t('http_error_code_17'));
      return;
    }

    if (data.code === '20') {
      setError(t('http_error_code_20'));
      return;
    }

    if (data.code === '21') {
      setError(t('http_error_code_21'));
      return;
    }

    if (data.code === '30') {
      setError(t('http_error_code_30'));
      return;
    }

    if (data.code === '31') {
      setError(t('http_error_code_31'));
      return;
    }

    if (data.code === 'ˇ32') {
      setError(t('http_error_code_32'));
      return;
    }

    if (data.code === 'ˇ91') {
      setError(t('http_error_code_91'));
      return;
    }
  };

  // 請求發送驗證碼
  const getValidCode = async () => {
    setResendValidCode(false);
    handleStart(true);
    let { phoneNumber, countryCode } = props;

    const registerApi = `/j/Req_oneTimePwd.aspx`;
    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
    }
    try {
      const res = await fetch(registerApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
        }),
      });
      const resData = await res.json();

      setIsLoading(false);

      handleHttpError(resData);
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };

  // 驗證碼確認是否ＯＫ
  const handleSubmit = async (phoneNumber, countryCode) => {
    // event.preventDefault(); //防止表單提交
    setIsLoading(true);
    setResendValidCode(true);

    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
    }

    const timePwdApi = `/j/ChkoneTimePwd.aspx`;

    try {
      const res = await fetch(timePwdApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
          OneTimePwd: validNum,
        }),
      });

      const resData = await res.json();
      setIsLoading(false);

      if (resData.code === 200) {
        const token = resData.data;
        setError('');
        setFormIsValid(true);
        setToken(token);
      } else {
        setValidNum('');
        setError(`*${t('http_error_code_22')}`);
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  // 註冊最後一步
  const registerClient = async (token, countryCode, phoneNumber, password) => {
    setIsLoading(true);

    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
    }

    const registerClientApi = `/j/req_RegClient.aspx`;

    const res = await fetch(registerClientApi, {
      method: 'POST',
      body: JSON.stringify({
        reg_countrycode: countryCode,
        reg_tel: phoneNumber,
        reg_pwd: password,
        reg_token: token,
      }),
    });

    const resData = await res.json();

    if (resData.code !== 200) {
      handleHttpError(resData);
      setIsLoading(false);
      return;
    }

    if (resData.code === 200) {
      setIsRegister(true);
      setIsLoading(false);
    }
  };

  const handleCountDownComplete = () => {
    setResendValidCode(true);
  };

  const handleStart = () => clockRef.current.start();

  return (
    <Fragment>
      {isLoading ? (
        <div className="mt-4">
          <Spinner />
        </div>
      ) : isRegister && !isLoading ? (
        <SuccessRegister setIsRegister={setIsRegister} />
      ) : (
        <Form className="mx-auto">
          <Form.Row className="align-items-center">
            <Form.Group as={Col} sm={12} controlId="formBasicValidCode" className="">
              <Form.Label className="mb-4 fs_15">{t('click_and_send_valid_code')}</Form.Label>
              <InputGroup className="mb-2 mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>VEK&nbsp;-</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control placeholder={t('one_time_code')} className="form-input mb-0" onChange={handleValidCode} value={validNum} autoComplete="off" type="number" isValid={formIsValid} />
              </InputGroup>

              {error ? <Form.Text className="text-muted">*{error}</Form.Text> : null}
            </Form.Group>

            <Form.Group as={Col}>
              <Countdown
                autoStart={false}
                ref={clockRef}
                onComplete={handleCountDownComplete}
                date={Date.now() + timer}
                renderer={props => <ButtonTimer t={t} resendValidCode={resendValidCode} getValidCode={getValidCode} {...props} />}
                className="mt-4"
              ></Countdown>
            </Form.Group>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Group as={Col}>
              <Button
                onClick={() => registerClient(token, countryCode, phoneNumber, password)}
                // variant="primary"
                variant={!formIsValid ? 'secondary' : 'primary'}
                type="submit"
                size="lg"
                block
                className="fs_20"
                disabled={!formIsValid}
              >
                {t('btn_confirm')}
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      )}
    </Fragment>
  );
};

export default ValidCode;
