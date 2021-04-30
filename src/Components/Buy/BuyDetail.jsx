import { useState, useContext, useEffect } from 'react';
import Countdown from 'react-countdown';

// Context
import BuyContext from '../../context/buy/BuyContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import SetAccount from './SetAccount';
import BuyInfoHeader from './BuyInfoHeader';
import Timer from './Timer';
import Cancel from '../universal/Cancel';

// import CancelSell from '../Sell/CancelSell';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import copy from 'copy-to-clipboard';

const InfoDetail = props => {
  // Buy Context
  const buyContext = useContext(BuyContext);
  const {
    buyWsData,
    buyBtnLoading,
    BuyerAlreadyPay,
    buyOrderToken,
    isHideBuyInfo,
    deltaTime,
    setHideBuyInfo,
    setDeltaTime,
    GetDeltaTime,
  } = buyContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Init State
  const [timeLeft, setTimeLeft] = useState(1800);
  const [overTime, setOverTime] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert('複製成功');
    } else {
      alert('複製失敗，請手動複製');
    }
  };

  useEffect(() => {
    return () => {
      setDeltaTime(null);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (deltaTime <= 900) setHideBuyInfo(false);

    if (deltaTime > 900) setHideBuyInfo(true);

    if (deltaTime > 1800) setOverTime(true);

    setTimeLeft((1800 - deltaTime) * 1000);

    // eslint-disable-next-line
  }, [deltaTime]);

  return (
    <>
      <Cancel
        show={showCancel}
        onHide={() => setShowCancel(false)}
        onShow={() => GetDeltaTime(buyOrderToken)}
        onExited={() => GetDeltaTime(buyOrderToken)}
      />
      {/* 第一階段倒數 */}
      {!isHideBuyInfo && (
        <>
          <BuyInfoHeader />
          <Row className="my-4 justify-content-between px-4">
            <Col xl={6} className="txt_12 lightblue_bg pl-3 mt-4">
              {/* Cny */}
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">
                  付款金額: &emsp;
                  <span
                    style={{
                      color: '#3e80f9',
                      fontSize: '17px',
                      fontWeight: 'bold',
                    }}
                  >
                    {buyWsData.cny}
                    CNY
                  </span>
                </p>
                <div
                  onClick={() => handleCopy(buyWsData.cny)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              {/* Name */}
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">收款姓名：{buyWsData.name}</p>
                <div
                  onClick={() => handleCopy(buyWsData.name)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              {/* Account */}
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">付款帳號： {buyWsData.account}</p>
                <div
                  onClick={() => handleCopy(buyWsData.account)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              {/* Bank */}
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">開戶銀行： {buyWsData.bank}</p>
                <div
                  onClick={() => handleCopy(buyWsData.bank)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>

              {/* City */}
              <div className="d-flex align-items-center mb-3">
                <p className="mb-0 mr-3">所在省市： {buyWsData.city}</p>
                <div
                  onClick={() => handleCopy(buyWsData.city)}
                  className="i_copy2"
                  style={{ width: 15, height: 15 }}
                ></div>
              </div>
            </Col>
            <Col xl={5} className="mt-4">
              <SetAccount className="" rmbAmt={buyWsData.cny} usdtAmt={buyWsData.usdt} />
            </Col>
          </Row>

          {errorText && (
            <Row className="mb-4">
              <Col className="text-danger" style={{ fontSize: 12 }}>
                *{errorText}
              </Col>
            </Row>
          )}

          <Row className="justify-content-center">
            <Col className="mw400 text-center">
              <Button
                disabled={buyBtnLoading}
                className={buyBtnLoading ? 'disable-easy-btn w-100' : 'easy-btn w-100'}
                onClick={() => BuyerAlreadyPay(buyOrderToken)}
              >
                {buyBtnLoading && <Spinner animation="grow" variant="danger" />}
                {buyBtnLoading ? '處理中...' : '已完成付款'}
              </Button>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => setShowCancel(true)}
              >
                取消訂單
              </p>
            </Col>
          </Row>
        </>
      )}

      {/* 第二階段倒數 */}
      {isHideBuyInfo && deltaTime ? (
        <>
          {errorText && (
            <Row className="mb-4">
              <Col className="text-danger" style={{ fontSize: 12 }}>
                *{errorText}
              </Col>
            </Row>
          )}
          <Row className="justify-content-center">
            <Col className="mw400 text-center">
              <Button
                disabled={buyBtnLoading || overTime}
                //   className="easy-btn w-100"
                className={buyBtnLoading || overTime ? 'disable-easy-btn w-100' : 'easy-btn w-100'}
                onClick={() => BuyerAlreadyPay(buyOrderToken)}
              >
                <Countdown
                  onComplete={() => setOverTime(true)}
                  renderer={Timer}
                  date={Date.now() + timeLeft}
                />
                <br />
                {buyBtnLoading && <Spinner animation="grow" variant="danger" />}
                {buyBtnLoading ? '處理中...' : '已完成付款'}
              </Button>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => setShowCancel(true)}
              >
                取消訂單
              </p>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};

export default InfoDetail;
