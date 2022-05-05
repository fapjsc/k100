import { useState, useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
// import Countdown from "react-countdown";
import copy from "copy-to-clipboard";

import { useSelector } from "react-redux";

// Context
import BuyContext from "../../context/buy/BuyContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

// Lang Context
import { useI18n } from "../../lang";

// Utils
import { locationMoneyPrefix } from "../../lib/utils";

// Components
import SetAccount from "./SetAccount";
import BuyInfoHeader from "./BuyInfoHeader";
// import Timer from "./Timer";
import Cancel from "../universal/Cancel";

// import CancelSell from '../Sell/CancelSell';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import warningImg from "../../Assets/warning.png";

const InfoDetail = (props) => {
  // Lang Context
  const { t } = useI18n();

  // Redux

  const { orderStatus } = useSelector((state) => state.order);
  const { Order_StatusID: statusID, Tx_HASH: statusHash } = orderStatus || {};

  // Router Props
  const match = useRouteMatch();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const {
    buyWsData,
    buyBtnLoading,
    BuyerAlreadyPay,
    buyOrderToken,
    // isHideBuyInfo,
    deltaTime,
    setHideBuyInfo,
    setDeltaTime,
    GetDeltaTime,
  } = buyContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText } = httpErrorContext;

  // Init State
  // eslint-disable-next-line
  const [timeLeft, setTimeLeft] = useState(
    Date.now() + (1000 * 60 * 30 - deltaTime * 1000)
  );

  // eslint-disable-next-line
  const [overTime, setOverTime] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleCopy = (value) => {
    copy(value);

    if (copy(value)) {
      alert(t("btn_copy"));
    } else {
      alert(t("btn_copy_fail"));
    }
  };

  useEffect(() => {
    GetDeltaTime(match.params.id);
    return () => {
      setDeltaTime(null);
      setOverTime(false);
      setHideBuyInfo(false);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (deltaTime <= 900) setHideBuyInfo(false);
    if (deltaTime > 900) setHideBuyInfo(true);
    if (deltaTime > 1800) setOverTime(true);
    setTimeLeft(Date.now() + (1000 * 60 * 30 - deltaTime * 1000));
    // eslint-disable-next-line
  }, [deltaTime]);


  return (
    <>
      <Cancel
        show={showCancel}
        onHide={() => setShowCancel(false)}
        onShow={() => GetDeltaTime(buyOrderToken)}
        onExited={() => GetDeltaTime(buyOrderToken)}
        hash={statusHash}
      />
      {/* 第一階段倒數 */}
      <>
        <BuyInfoHeader />
        <Row className="mb-4 justify-content-between px-4">
          <Col xl={6} className="txt_12 lightblue_bg pl-3 mt-4">
            {/* Cny */}
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 mr-3">
                {t("amount")}: &emsp;
                <span
                  style={{
                    color: "#3e80f9",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(buyWsData.cny).toFixed(2)}
                  {locationMoneyPrefix()}
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
              <p className="mb-0 mr-3">
                {t("payee")}：{buyWsData.name}
              </p>
              <div
                onClick={() => handleCopy(buyWsData.name)}
                className="i_copy2"
                style={{ width: 15, height: 15 }}
              ></div>
            </div>

            {/* Account */}
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 mr-3">
                {t("payee_account")}： {buyWsData.account}
              </p>
              <div
                onClick={() => handleCopy(buyWsData.account)}
                className="i_copy2"
                style={{ width: 15, height: 15 }}
              ></div>
            </div>

            {/* Bank */}
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 mr-3">
                {t("bank")}： {buyWsData.bank}
              </p>
              <div
                onClick={() => handleCopy(buyWsData.bank)}
                className="i_copy2"
                style={{ width: 15, height: 15 }}
              ></div>
            </div>

            {/* City */}
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 mr-3">
                {t("city")}： {buyWsData.city}
              </p>
              <div
                onClick={() => handleCopy(buyWsData.city)}
                className="i_copy2"
                style={{ width: 15, height: 15 }}
              ></div>
            </div>
          </Col>
          <Col xl={5} className="mt-4">
            <SetAccount
              className=""
              rmbAmt={buyWsData.cny}
              usdtAmt={buyWsData.usdt}
            />
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
            {statusID === 33 && (
              <>
                <Button
                  disabled={buyBtnLoading}
                  className={
                    buyBtnLoading ? "disable-easy-btn w-100" : "easy-btn w-100"
                  }
                  onClick={() => BuyerAlreadyPay(buyOrderToken)}
                >
                  {buyBtnLoading && (
                    <Spinner animation="grow" variant="danger" />
                  )}
                  {buyBtnLoading
                    ? `${t("btn_loading")}...`
                    : t("btn_already_pay")}
                </Button>

                <span
                  style={{
                    cursor: "pointer",
                    paddingBottom: "2px",
                    borderBottom: "1px solid #262e45",
                    borderColor: "#262e45",
                    fontSize: 12,
                    color: "#262e45",
                  }}
                  onClick={() => setShowCancel(true)}
                >
                  {t("btn_cancel_order")}
                </span>
              </>
            )}

            {statusID === 35 && (
              <div style={{}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    style={{ width: "5rem", height: "5rem" }}
                    src={warningImg}
                    alt="warning"
                  />
                  <h5 className="txt26" style={{ marginBottom: 0 }}>
                    申訴中
                  </h5>
                </div>
                <div className="text-center">
                  <span
                    style={{
                      cursor: "pointer",
                      paddingBottom: "2px",
                      borderBottom: "1px solid #262e45",
                      borderColor: "#262e45",
                      fontSize: 12,
                      color: "#262e45",
                    }}
                    onClick={() => setShowCancel(true)}
                  >
                    {t("btn_cancel_order")}
                  </span>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </>
    </>
  );
};

export default InfoDetail;
