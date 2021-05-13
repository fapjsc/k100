import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import OnLoading from './OnLoading';
import FormFooter from '../Layout/FormFooter';

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
  // Router Props
  const history = useHistory();

  // Transfer Context
  const transferContext = useContext(TransferContext);
  const {
    transferOrderToken,
    transferWebSocket,
    transferStatus,
    detailReq,
    usdtCount,
    closeWebSocket,
    setUsdtCount,
    transferErrText,
    checkErcAddress,
    checkTrcAddress,
  } = transferContext;

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

  const handleClick = type => {
    setProtocolType(type);
  };

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
          error: '錢包地址錯誤',
        });
        setFormIsValid(false);
        setHttpLoading(false);
      }
    }

    // 錢包地址驗證 --TRC
    if (protocolType === 'trc') {
      // do something...
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
        error: '請輸入有效的數量',
      });
      setFormIsValid(false);
      setHttpLoading(false);
    }

    // 輸入數量大於可提加上手續費
    if (Number(transferCount.val) > Number(avb) - Number(transferHandle)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: '超出最大可提',
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
        error: '可提不足',
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

  const inputText = {
    color: '#D7E2F3',
    position: 'absolute',
    top: 34,
    transform: 'translateY(56%)',
    right: 45,
    fontSize: 17,
  };

  return (
    <div>
      <OnLoading show={isPairing} usdtCount={usdtCount} onHide={backToHome} />

      <Form className="text-center">
        <Form.Row>
          <Form.Group as={Col} md={5} sm={12} controlId="transferUsdt" className="pb-0">
            <div className="mb-2 d-flex align-items-center" style={{ height: 30 }}>
              <Form.Label className="mb-0 txt-primary-c">請選擇協議種類</Form.Label>
            </div>
            <div className="d-flex">
              <Button
                className={protocolType === 'trc' ? 'walletBtnActive mr-4' : 'walletBtn mr-4'}
                onClick={() => handleClick('trc')}
              >
                TRC20
              </Button>
              <Button
                className={protocolType === 'erc' ? 'walletBtnActive' : 'walletBtn'}
                onClick={() => handleClick('erc')}
              >
                ERC20
              </Button>
            </div>
          </Form.Group>

          {protocolType && (
            <>
              <Form.Group as={Col} md={5} sm={12} controlId="transferUsdt" className="">
                <div className="d-flex justify-content-between mb-2">
                  <Form.Label className="mb-0 align-self-center txt-primary-c">轉帳USDT</Form.Label>

                  {transferLoading ? (
                    <Button variant="secondary" disabled className="" style={{}}>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </Button>
                  ) : (
                    <Button
                      onClick={getAll}
                      className=""
                      disabled={transferLoading}
                      variant="outline-primary"
                      size="lg"
                    >
                      提取所有
                    </Button>
                  )}
                </div>

                <Form.Control
                  onWheel={event => event.currentTarget.blur()}
                  type="number"
                  placeholder="請輸入數量"
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

              <Form.Group as={Col} md={12} className="text-left" style={{ marginBottom: 50 }}>
                <span
                  className=""
                  style={{
                    color: '#262E45',
                    fontSize: 12,
                  }}
                >
                  手續費: {transferHandle} USDT
                </span>
              </Form.Group>

              <Form.Group
                as={Col}
                md={10}
                sm={12}
                controlId="transferAddress"
                className="text-left"
              >
                <Form.Label
                  className="text-left"
                  style={{
                    color: '#262E45',
                    fontSize: 12,
                  }}
                >
                  轉帳地址
                </Form.Label>

                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="請輸入收款地址"
                    className="p_sm-2 easy-border"
                    onChange={onChange}
                    value={transferAddress.val}
                    autoComplete="off"
                    name="transferAddress"
                  />
                </div>

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
            </>
          )}
        </Form.Row>

        {protocolType && (
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
            {httpLoading ? '處理中...' : '下一步'}
          </Button>
        )}
      </Form>

      <FormFooter />
    </div>
  );
};

export default Transfer;
