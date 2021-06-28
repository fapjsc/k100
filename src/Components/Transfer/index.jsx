import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
// import { useMediaQuery } from 'react-responsive';
import QrReader from 'modern-react-qr-reader';

// Components
import OnLoading from './OnLoading';
import FormFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';

// Lang Context
import { useI18n } from '../../lang';

// Context
import TransferContext from '../../context/transfer/TransferContext';
import BalanceContext from '../../context/balance/BalanceContext';
import SellContext from '../../context/sell/SellContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Style
import { Form, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Transfer = () => {
  // Media Query
  // const isMobile = useMediaQuery({ query: '(max-width: 900px)' }); // 小於等於 900 true
  // Router Props
  const history = useHistory();

  // Lang Context
  const { t } = useI18n();

  // Transfer Context
  const transferContext = useContext(TransferContext);
  const { transferOrderToken, transferWebSocket, transferStatus, detailReq, usdtCount, closeWebSocket, setUsdtCount, transferErrText, checkErcAddress, checkTrcAddress } = transferContext;

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance, avb } = balanceContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getExRate, transferHandle, rateAllData, setTransferHandle } = sellContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading, setHttpLoading, errorText, setHttpError } = httpErrorContext;

  // Init State
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const [transferCount, setTransferCount] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [transferAddress, setTransferAddress] = useState({
    val: '',
    isValid: true,
    error: '',
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const [transferLoading, setTransferLoading] = useState(false);

  const [isPairing, setIsPairing] = useState(false);

  const [protocolType, setProtocolType] = useState('');

  const [showCamera, setShowCamera] = useState(false);

  //=========
  // Effect
  //=========
  useEffect(() => {
    getExRate();
    getBalance();
    closeWebSocket();
    setHttpError('');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (scanResultWebCam) {
      setTransferAddress({
        val: scanResultWebCam,
        error: '',
        isValid: true,
      });
    }
    return () => {
      setScanResultWebCam('');
    };
  }, [scanResultWebCam]);

  // Type  --手續費，清空input及error
  useEffect(() => {
    if (protocolType === 'erc') setTransferHandle(rateAllData.TransferHandle);
    if (protocolType === 'trc') setTransferHandle(rateAllData.TransferHandle2);
    setTransferCount({
      val: '',
      isValid: true,
      error: '',
    });

    setTransferAddress({
      val: '',
      isValid: true,
      error: '',
    });

    setHttpError('');
    // eslint-disable-next-line
  }, [protocolType]);

  // 表單驗證後發送轉帳請求，將會拿到order token，驗證錢包地址，確認ｏｋ後直接發送transfer請求
  useEffect(() => {
    if (!formIsValid || !protocolType) return;

    if (protocolType === 'erc') {
      checkErcAddress(transferAddress, transferCount);
    }

    if (protocolType === 'trc') {
      checkTrcAddress(transferAddress, transferCount);
    }
    setFormIsValid(false);
    // eslint-disable-next-line
  }, [formIsValid]);

  // Get Detail
  useEffect(() => {
    if (transferOrderToken) {
      setIsPairing(true);
      detailReq(transferOrderToken);
    }
    // eslint-disable-next-line
  }, [transferOrderToken]);

  useEffect(() => {
    if (usdtCount) {
      transferWebSocket(transferOrderToken);
    }
    // eslint-disable-next-line
  }, [usdtCount]);

  useEffect(() => {
    if (transferStatus === 0) {
    }

    if (transferStatus === 1) {
      getBalance();
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
      closeWebSocket();
      setUsdtCount(null);
    }

    if (transferStatus === 2) {
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
    }
    if (transferStatus === 97) {
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
      closeWebSocket();
      setUsdtCount(null);
    }

    // eslint-disable-next-line
  }, [transferStatus]);

  const onChange = e => {
    setHttpError('');
    if (e.target.name === 'transferCount')
      setTransferCount({
        val: e.target.value.trim(),
        isValid: true,
        error: '',
      });

    if (e.target.name === 'transferAddress') {
      setTransferAddress({
        val: e.target.value.trim(),
        isValid: true,
        error: '',
      });
    }
  };

  const valid = () => {
    setFormIsValid(true);
    setHttpLoading(true);

    // 錢包地址驗證 --ERC
    if (protocolType === 'erc') {
      // --小於40位
      if (transferAddress.val.length < 40) {
        setTransferAddress({
          val: '',
          isValid: false,
          error: t('transfer_address_error'),
        });
        setFormIsValid(false);
        setHttpLoading(false);
      }
    }

    // 錢包地址驗證 --TRC
    if (protocolType === 'trc') {
      if (transferAddress.val.length <= 0) {
        setTransferAddress({
          val: '',
          isValid: false,
          error: t('transfer_address_error'),
        });
        setFormIsValid(false);
        setHttpLoading(false);
      }
    }

    // 輸入的數量小數點超過兩位數
    // let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    // if (!rule.test(transferCount.val)) {
    //   setTransferCount({
    //     val: '',
    //     isValid: false,
    //     error: '請輸入有效數量, (不能為0或是負數，最多小數第二位)',
    //   });
    //   setFormIsValid(false);
    //   setHttpLoading(false);
    // }
    // 不能是負數
    let negative = /^((-\d+(\.\d+)?)|((\.0+)?))$/;
    if (negative.test(transferCount.val)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: t('transfer_error_invalid_number'),
      });
      setFormIsValid(false);
      setHttpLoading(false);
    }

    // 輸入數量大於可提加上手續費
    if (Number(transferCount.val) > Number(avb) - Number(transferHandle)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: t('avb_over_limit'),
      });
      setFormIsValid(false);
      setHttpLoading(false);
    }
  };

  const getAll = async () => {
    setTransferLoading(true);
    await getBalance();
    await getExRate();
    setTransferLoading(false);

    const all = avb - Number(transferHandle);
    if (all <= 0) {
      setTransferCount({
        val: '0',
        isValid: true,
        error: t('avb_insufficient'),
      });
      setFormIsValid(false);

      return;
    }

    setTransferCount({
      val: String(all),
      isValid: true,
      error: '',
    });
  };

  const backToHome = () => {
    setUsdtCount(null);
    history.replace('/home/overview');
  };

  const handleClick = type => {
    setProtocolType(type);
  };

  const inputText = {
    color: '#D7E2F3',
    position: 'absolute',
    top: 34,
    transform: 'translateY(56%)',
    right: 45,
    fontSize: 17,
  };

  const handleErrorWebCam = error => {
    console.log(error);
  };
  const handleScanWebCam = result => {
    if (result) {
      setScanResultWebCam(result);
      setShowCamera(false);
    }
  };

  return (
    <div>
      <OnLoading show={isPairing} usdtCount={usdtCount} onHide={backToHome} />

      <Form className="text-center">
        <Form.Row className="">
          {rateAllData ? (
            <Form.Group as={Col} md={5} sm={12} controlId="transferUsdt" className="pb-0">
              <div className="mb-2 d-flex align-items-center" style={{ height: 30 }}>
                <Form.Label className="mb-0 txt-primary-c" style={{ fontSize: 12 }}>
                  {t('select_protocol')}
                </Form.Label>
              </div>
              <div className="d-flex">
                <Button className={protocolType === 'trc' ? 'walletBtnActive mr-4' : 'walletBtn mr-4'} onClick={() => handleClick('trc')}>
                  {t('protocol_trc20')}
                </Button>
                <Button className={protocolType === 'erc' ? 'walletBtnActive' : 'walletBtn'} onClick={() => handleClick('erc')}>
                  {t('protocol_erc20')}
                </Button>
              </div>

              {protocolType && (
                <p
                  className="mt-4 text-left"
                  style={{
                    color: '#262E45',
                    fontSize: 12,
                  }}
                >
                  {t('transfer_charge')}: {transferHandle && Number(transferHandle).toFixed(2)} USDT
                </p>
              )}
            </Form.Group>
          ) : (
            <BaseSpinner />
          )}

          {protocolType && (
            <>
              <Form.Group as={Col} md={5} sm={12} controlId="transferUsdt" className="">
                <div className="d-flex justify-content-between mb-2">
                  <Form.Label className="mb-0 align-self-center txt-primary-c">{t('transfer_title')}</Form.Label>

                  {transferLoading ? (
                    <Button variant="secondary" disabled className="" style={{}}>
                      <Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                      {t('btn_loading')}...
                    </Button>
                  ) : (
                    <Button onClick={getAll} className="" disabled={transferLoading} variant="outline-primary" size="lg">
                      {t('btn_fetch_all')}
                    </Button>
                  )}
                </div>

                <Form.Control
                  onWheel={event => event.currentTarget.blur()}
                  type="number"
                  placeholder={t('transfer_enter_number')}
                  className="p_sm-2 easy-border"
                  onChange={onChange}
                  value={transferCount.val}
                  autoComplete="off"
                  name="transferCount"
                />
                <span style={inputText}>USDT</span>

                {/* 前端驗證錯誤提示 */}
                {transferCount.error ? (
                  <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                    *{transferCount.error}
                  </Form.Text>
                ) : null}
              </Form.Group>

              {transferCount.val && !transferCount.error ? (
                <Form.Group as={Col} md={10} sm={12} controlId="transferAddress" className="text-left">
                  <Form.Label
                    className="text-left"
                    style={{
                      color: '#262E45',
                      fontSize: 12,
                    }}
                  >
                    {t('transfer_address')}
                  </Form.Label>

                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder={t('transfer_enter_address')}
                      className="p_sm-2 easy-border"
                      onChange={onChange}
                      value={transferAddress.val}
                      autoComplete="off"
                      name="transferAddress"
                    />
                  </div>

                  {/* <h3>Qr Code Scan by Web Cam</h3> */}

                  {/* <h3>Scanned By WebCam Code: {scanResultWebCam}</h3> */}
                  {/* 前端驗證錯誤提示 */}
                  {transferAddress.error ? (
                    <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                      *{transferAddress.error}
                    </Form.Text>
                  ) : null}

                  {/* Http Error 提示 */}
                  {errorText && (
                    <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                      *{errorText}
                    </Form.Text>
                  )}

                  {transferErrText && (
                    <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                      *{transferErrText}
                    </Form.Text>
                  )}
                </Form.Group>
              ) : null}
            </>
          )}
        </Form.Row>

        {protocolType && transferCount.val && !transferCount.error ? (
          <>
            <div className="text-left mt-4">
              <span style={showCameraText} onClick={() => setShowCamera(!showCamera)}>
                {t('open_camera')}
              </span>
            </div>
            {showCamera && <QrReader delay={300} style={{ maxWidth: '360px', margin: '30px auto' }} onError={handleErrorWebCam} onScan={handleScanWebCam} facingMode={'environment'} />}

            <Button
              onClick={valid}
              className="easy-btn smScreen-btn mt-4"
              disabled={httpLoading || transferErrText}
              style={{
                cursor: httpLoading || transferErrText ? 'auto' : 'pointer',
                backgroundColor: httpLoading || transferErrText ? 'grey' : '#3e80f9',
              }}
            >
              {httpLoading && <Spinner animation="grow" variant="danger" />}
              {httpLoading ? `${t('btn_loading')}...` : t('btn_next')}
            </Button>
          </>
        ) : null}
      </Form>

      <FormFooter />
    </div>
  );
};

const showCameraText = {
  color: '#3e80f9',
  cursor: 'pointer',
  borderBottom: '1px solid #3e80f9',
  fontSize: 12,
};

export default Transfer;
