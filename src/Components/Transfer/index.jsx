import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import OnLoading from './OnLoading';

import TransferContext from '../../context/transfer/TransferContext';
import BalanceContext from '../../context/balance/BalanceContext';
import SellContext from '../../context/sell/SellContext';

import { Form, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

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

  const [btnLoading, setBtnLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  const [isPairing, setIsPairing] = useState(false);

  useEffect(() => {
    getExRate();
    getBalance();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (handleBtnLoading) {
      setBtnLoading(false);
    }
    return setHandleBtnLoading(false);
    // eslint-disable-next-line
  }, [handleBtnLoading]);

  useEffect(() => {
    if (formIsValid) {
      sendTransferReq(transferAddress, transferCount);
      setFormIsValid(false);
    }

    // eslint-disable-next-line
  }, [formIsValid]);

  useEffect(() => {
    if (transferOrderToken) {
      detailReq(transferOrderToken);
    }

    // eslint-disable-next-line
  }, [transferOrderToken]);

  useEffect(() => {
    if (usdtCount) {
      setIsPairing(true);
      transferWebSocket(transferOrderToken);
      setBtnLoading(false);
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
    }

    // eslint-disable-next-line
  }, [transferStatus]);

  const onChange = e => {
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
    setBtnLoading(true);

    // 錢包地址小於40位
    if (transferAddress.val.length < 40) {
      setTransferAddress({
        val: '',
        isValid: false,
        error: '錢包地址錯誤',
      });
      setFormIsValid(false);
      setBtnLoading(false);
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
      setBtnLoading(false);
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
      setBtnLoading(false);
    }
    // 輸入數量大於可提加上手續費
    if (Number(transferCount.val) > avb + Number(transferHandle)) {
      setTransferCount({
        val: '',
        isValid: false,
        error: '超出最大可提',
      });
      setFormIsValid(false);
      setBtnLoading(false);
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

    setTransferLoading(false);
  };

  const backToHome = () => {
    history.replace('/home/overview');
  };

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

          <Form.Group as={Col} md={6} sm={12} controlId="transferAddress" className="">
            <Form.Control
              type="text"
              placeholder="請輸入收款地址"
              className="p_sm-2 easy-border"
              onChange={onChange}
              value={transferAddress.val}
              autoComplete="off"
              name="transferAddress"
            />

            {transferAddress.error ? (
              <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                *{transferAddress.error}
              </Form.Text>
            ) : null}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} className="text-right" style={{}}>
            <span className="text-dark">手續費: {transferHandle} USDT</span>
          </Form.Group>
        </Form.Row>

        <Button
          onClick={valid}
          className="easy-btn smScreen-btn mt-4"
          disabled={btnLoading}
          style={{
            cursor: btnLoading ? 'auto' : 'pointer',
            backgroundColor: btnLoading ? 'grey' : '#3e80f9',
          }}
        >
          {btnLoading && <Spinner animation="grow" variant="danger" />}
          {btnLoading ? '處理中...' : '下一步'}
        </Button>
      </Form>

      <div>
        <hr className="mt_mb" />
        <ul className="txt_12_grey">
          <li>本平台目前只提供USDT交易，其他數字貨幣交易將不予受理</li>
          <br />
          <li>本平台錢包地址充值或轉出，都是經由 USDT區塊鏈系統網絡確認。</li>
          <br />
          <li>本平台錢包地址可以重複充值或轉出；如因系統更新，我們會通過網站或口訊通知。</li>
          <br />
          <li>請勿向錢包地址充值任何非USDT資産，否則資産將不可找回。</li>
          <br />
          <li>最小充值金額：100 USDT，小于最小金額的充值將不會上賬且無法退回。</li>
          <br />
          <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
          <br />
          <li>如有其他問題或要求提出爭議，可透過網頁上的客服對話窗聯絡我們。</li>
        </ul>
      </div>
    </div>
  );
};

export default Transfer;
