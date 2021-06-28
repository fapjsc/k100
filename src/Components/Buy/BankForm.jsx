import { useContext, useState, useEffect } from 'react';

// Context
import BuyContext from '../../context/buy/BuyContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';
import { useI18n } from '../../lang';

// Style
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const BankFrom = () => {
  // Lang Context
  const { t } = useI18n();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyBtnLoading, buyCount, setErrorText, confirmBuy } = buyContext;

  // Http Error context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  const [accountName, setAccountName] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // unMount後清除錯誤提示
  useEffect(() => {
    return () => {
      setHttpError(''); // http錯誤提示
      setErrorText(''); // 前端表單驗證錯誤提示
    };
    // eslint-disable-next-line
  }, []);

  // Get Order Token for Connect Web Socket
  useEffect(() => {
    if (formIsValid) {
      confirmBuy(accountName.val);
    }

    return setFormIsValid(false);

    // eslint-disable-next-line
  }, [formIsValid]);

  // Handle Form Input Change
  const onChange = e => {
    setHttpError('');
    setAccountName({
      val: e.target.value.trim(),
      isValid: true,
      error: '',
    });
  };

  // Handle Key Up
  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      validForm();
    }
  };

  // Valid Form
  const validForm = () => {
    const { usdt, rmb } = buyCount;
    setFormIsValid(true);

    if (accountName.val === '') {
      setAccountName({
        val: '',
        isValid: false,
        error: t('no_account_name'),
      });

      setFormIsValid(false);
    }

    if (usdt <= 0 || usdt === '' || rmb <= 0 || rmb === '') {
      setErrorText(t('invalid_number'));
      setFormIsValid(false);
    }
  };

  // 換算千分位
  const thousandBitSeparator = num => {
    return (
      num &&
      // eslint-disable-next-line
      (num.toString().indexOf('.') != -1
        ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ',';
          })
        : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
            return $1 + ',';
          }))
    );
  };
  return (
    <>
      <Form className="confirmBuyContent">
        <Form.Row className="justify-content-between align-items-start">
          <Form.Group as={Col} md={6} sm={12} className="mr-4 mt-0 d-flex flex-column justify-content-center px-0" controlId="formBasicClientName">
            <Form.Control
              placeholder={t('account_name_placeholder')}
              onChange={onChange}
              value={accountName.val}
              className="confirmBuyInput easy-border"
              autoComplete="off"
              onKeyUp={handleKeyUp}
              isInvalid={accountName.error}
            />
            {/* 前端驗證錯誤訊息 */}
            {accountName.error && (
              <Form.Text
                style={{
                  fontSize: '12px',
                }}
                className=""
              >
                *{accountName.error}
              </Form.Text>
            )}

            {/* http 請求錯誤訊息 */}
            {errorText && (
              <Form.Text
                style={{
                  fontSize: '12px',
                }}
                className=""
              >
                *{errorText}
              </Form.Text>
            )}

            {/* 輸入提示 */}
            <p
              style={{
                color: '#eb0303',
                fontSize: 12,
              }}
              className=""
            >
              {t('account_name_prompt')}
            </p>
          </Form.Group>

          {/* 購買資訊 */}
          <Form.Group as={Col} className="">
            <Form.Row className="confirmBuy-textContent p-4">
              <Form.Group as={Col} className="mb-0">
                <div className="">
                  <p className="txt_12_grey mb-0">{t('buy_total')}</p>
                  <p className="confirmBuy-text c_blue mb-0">
                    {thousandBitSeparator(Number(buyCount.rmb).toFixed(2).toString())}
                    &nbsp; CNY
                  </p>
                </div>
              </Form.Group>
              <Form.Group as={Col} className=" text-right mb-0">
                <p className="txt_12_grey mb-0">{t('buy_quantity')}</p>
                <p className="confirmBuy-text mb-0 text-dark">
                  {/* 小數第二位，千分逗號 */}
                  {thousandBitSeparator(Number(buyCount.usdt).toFixed(2).toString())}
                  &nbsp; USDT
                </p>
              </Form.Group>
            </Form.Row>
          </Form.Group>
        </Form.Row>

        <Form.Row className="justify-content-center mt-4">
          <Form.Group as={Col} className="mw400 px-0">
            <Button className={buyBtnLoading ? 'disable-easy-btn w-100' : 'easy-btn w-100'} disabled={buyBtnLoading} onClick={validForm}>
              {buyBtnLoading ? (
                <>
                  <Spinner animation="grow" variant="danger" />
                  {t('btn_pairing')}
                </>
              ) : (
                t('btn_pair_start')
              )}
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
};

export default BankFrom;
