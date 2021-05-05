import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'copy-to-clipboard';

// Components
import OnLoading from './OnLoading';
import FormFooter from '../Layout/FormFooter';

// Context
import TransferContext from '../../context/transfer/TransferContext';
import BalanceContext from '../../context/balance/BalanceContext';
import SellContext from '../../context/sell/SellContext';

// Style
import { Form, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import CopyIcon from '../../Assets/i_copy.png';
// import ScanIcon from '../../Assets/i_scan_qr.png';

const Transfer = () => {
  const history = useHistory();
  const transferContext = useContext(TransferContext);
  const {
    sendTransferReq,
    transferOrderToken,
    transferWebSocket,
    transferStatus,
    detailReq,
    usdtCount,
    closeWebSocket,
    handleBtnLoading,
    setHandleBtnLoading,
    setUsdtCount,
    setErrorText,
    transferErrText,
  } = transferContext;

  const balanceContext = useContext(BalanceContext);
  const { getBalance, avb } = balanceContext;

  const sellContext = useContext(SellContext);
  const { getExRate, transferHandle } = sellContext;

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

  useEffect(() => {
    getExRate();
    getBalance();
    closeWebSocket();

    return () => {
      setErrorText('');
    };

    // eslint-disable-next-line
  }, []);

  // 表單驗證後發送轉帳請求，將會拿到order token
  useEffect(() => {
    if (formIsValid) {
      sendTransferReq(transferAddress, transferCount);
      setFormIsValid(false);
    }

    // eslint-disable-next-line
  }, [formIsValid]);

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
      console.log('pairing');
    }

    if (transferStatus === 1) {
      console.log('success');
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
      closeWebSocket();
      setUsdtCount(null);
    }

    if (transferStatus === 2) {
      console.log('轉帳中');
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
    }
    if (transferStatus === 97) {
      console.log('fail');
      setIsPairing(false);
      history.replace(`/home/transaction/transfer/${transferOrderToken}`);
      closeWebSocket();
      setUsdtCount(null);
    }

    // eslint-disable-next-line
  }, [transferStatus]);

  const onChange = e => {
    setErrorText('');
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
    setHandleBtnLoading(true);

    // 錢包地址小於40位
    if (transferAddress.val.length < 40) {
      setTransferAddress({
        val: '',
        isValid: false,
        error: '錢包地址錯誤',
      });
      setFormIsValid(false);
      setHandleBtnLoading(false);
    }
    // 輸入的數量小數點超過兩位數
    let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    if (!rule.test(transferCount.val)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: '請輸入有效數量, (不能為0或是負數，最多小數第二位)',
      });
      setFormIsValid(false);
      setHandleBtnLoading(false);
    }
    // 不能是負數
    let negative = /^((-\d+(\.\d+)?)|((\.0+)?))$/;
    if (negative.test(transferCount.val)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: '請輸入有效的數量',
      });
      setFormIsValid(false);
      setHandleBtnLoading(false);
    }
    // 輸入數量大於可提加上手續費
    if (Number(transferCount.val) > avb + Number(transferHandle)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: '超出最大可提',
      });
      setFormIsValid(false);
      setHandleBtnLoading(false);
    }
    // 可提為0
    // if (Number(Avb_Balance <= 0)) {
    //   // this.setState({
    //   //   transfercount: {
    //   //     val: '',
    //   //     isValid: false,
    //   //     error: '超出最大可提',
    //   //   },
    //   // });
    //   setTransfercount({
    //     val: '',
    //     isValid: false,
    //     error: '超出最大可提',
    //   });
    //   setFormIsValid(false);
    // }
    // 是否為有效的數字
    // if (
    //   !validator.isNumeric(transfercount.val) ||
    //   transfercount.val <= 0 ||
    //   transfercount.val === ''
    // ) {
    //   // this.setState({
    //   //   transfercount: {
    //   //     val: '',
    //   //     isValid: false,
    //   //     error: '請輸入有效的數量',
    //   //   },
    //   //   formIsValid: false,
    //   // });
    //   // setTransfercount({
    //   //   val: '',
    //   //   isValid: false,
    //   //   error: '請輸入有效的數量',
    //   // });
    //   setFormIsValid(false);
    // }
  };

  const getAll = async () => {
    setTransferLoading(true);
    await getBalance();
    await getExRate();
    setTransferLoading(false);

    const all = (avb - Number(transferHandle)).toFixed(2);
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

  // const handleCopy = value => {
  //   copy(value);

  //   if (copy(value)) {
  //     alert('複製成功');
  //   } else {
  //     alert('複製失敗，請手動複製');
  //   }
  // };

  const inputText = {
    color: '#D7E2F3',
    position: 'absolute',
    top: 0,
    transform: 'translateY(56%)',
    right: 45,
    fontSize: 17,
  };

  return (
    <div>
      <OnLoading show={isPairing} usdtCount={usdtCount} onHide={backToHome} />

      <Form className="text-center">
        <Form.Row className="">
          <Form.Group as={Col} sm={12} md={6} className="text-right ">
            {transferLoading ? (
              <Button variant="secondary" disabled className="" style={{}}>
                <Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                Loading...
              </Button>
            ) : (
              <Button
                onClick={getAll}
                disabled={transferLoading}
                variant="outline-primary"
                size="lg"
              >
                提取所有
              </Button>
            )}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md={6} sm={12} controlId="transferUsdt" className="">
            <Form.Control
              onWheel={event => event.currentTarget.blur()}
              type="number"
              placeholder="請輸入轉帳數量"
              className="p_sm-2 easy-border"
              onChange={onChange}
              value={transferCount.val}
              autoComplete="off"
              name="transferCount"
              // onKeyUp={this.countryInput}
            />
            <span style={inputText}>USDT</span>
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

          <Form.Group as={Col} md={12} sm={12} controlId="transferAddress" className="text-left">
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

              {/* <img
                style={{
                  position: 'absolute',
                  top: -30,
                  right: 70,
                  cursor: 'pointer',
                }}
                src={CopyIcon}
                alt="copy icon"
                onClick={() => handleCopy(transferAddress.val)}
              />

              <img
                style={{
                  position: 'absolute',
                  top: -30,
                  right: 30,
                }}
                src={ScanIcon}
                alt="copy icon"
              /> */}
            </div>

            {transferAddress.error ? (
              <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                *{transferAddress.error}
              </Form.Text>
            ) : null}

            {transferErrText && (
              <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                *{transferErrText}
              </Form.Text>
            )}
          </Form.Group>
        </Form.Row>
        {/* <Form.Row>
          <Form.Group as={Col} className="text-right" style={{}}>
            <span className="text-dark">手續費: {transferHandle} USDT</span>
          </Form.Group>
        </Form.Row> */}

        <Button
          onClick={valid}
          className="easy-btn smScreen-btn mt-4"
          disabled={handleBtnLoading || transferErrText}
          style={{
            cursor: handleBtnLoading || transferErrText ? 'auto' : 'pointer',
            backgroundColor: handleBtnLoading || transferErrText ? 'grey' : '#3e80f9',
          }}
        >
          {handleBtnLoading && <Spinner animation="grow" variant="danger" />}
          {handleBtnLoading ? '處理中...' : '下一步'}
        </Button>
      </Form>

      <FormFooter />
    </div>
  );
};

export default Transfer;
