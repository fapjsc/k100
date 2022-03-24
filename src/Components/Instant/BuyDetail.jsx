import { useContext, useEffect, useState } from "react";

import { useRouteMatch, useHistory } from "react-router-dom";
import Countdown from "react-countdown";

import { useDispatch, useSelector } from "react-redux";

// Context
import InstantContext from "../../context/instant/InstantContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import BuyContext from "../../context/buy/BuyContext";

// Lang Context
import { useI18n } from "../../lang";

// Actions
import { setOrderStatus } from "../../store/actions/orderActions";

// Components
import FromFooter from "../Layout/FormFooter";
import BaseSpinner from "../Ui/BaseSpinner";
import CompleteStatus from "../universal/CompleteStatus";
import InstantNav from "./InstantNav";
import CountDownTimer from "../universal/countDownTimer";

// Hooks
import useHttp from "../../hooks/useHttp";

// Apis
import { orderAppeal, confirmReceived } from "../../lib/api";

// Actions
// import { setInstantOrderData } from "../../store/actions/instantActions";

// Style
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import warningImg from "../../Assets/warning.png";

const BuyDetail = () => {
  // Lang Context
  const { t } = useI18n();

  const { orderStatus } = useSelector((state) => state.order);
  const { Order_StatusID: statusID } = orderStatus || {};

  const dispatch = useDispatch();

  // Appeal http
  const {
    sendRequest: appealReq,
    data: appealData,
    status: appealStatus,
    error: appealError,
  } = useHttp(orderAppeal);

  // Buy2 http
  const {
    sendRequest: confirmReceivedReq,
    data: confirmReceivedData,
    status: confirmReceivedStatus,
    error: confirmReceivedError,
  } = useHttp(confirmReceived);

  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  const orderToken = match.params.id;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError, httpLoading } = httpErrorContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { deltaTime, GetDeltaTime } = buyContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    buy1Data,
    buyMatch2,
    statusWs,
    wsStatusData,
    wsStatusClient,
    cleanAll,
    paymentName,
    // sell1Data,
  } = instantContext;

  // Init State
  const [showComplete, setShowComplete] = useState(false);
  const [tab, setTab] = useState("all");
  const [timeLeft, setTimeLeft] = useState(
    Date.now() + 1000 * 60 * 30 - deltaTime * 1000
  );
  const [overTime, setOverTime] = useState(false);

  // ===========
  //  UseEffect
  // ===========

  useEffect(() => {
    if (buy1Data) {
      dispatch(setOrderStatus(buy1Data));
    }
  }, [buy1Data, dispatch]);

  useEffect(() => {
    statusWs(match.params.id);
    GetDeltaTime(match.params.id);
    return () => {
      if (wsStatusClient) wsStatusClient.close();
      setOverTime(false);
      setTimeLeft(null);
      cleanAll();
    };
    //eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   dispatch(getExpiredOrder());
  // }, [dispatch]);

  useEffect(() => {
    setTimeLeft(Date.now() + 1000 * 60 * 30 - deltaTime * 1000);
    if (deltaTime > 1800) setOverTime(true);
    // eslint-disable-next-line
  }, [deltaTime]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError("");
    };
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (tab === "onGoing") history.replace("/home/overview");
    // eslint-disable-next-line
  }, [tab]);

  useEffect(() => {
    // console.log("instant buy", wsStatusData, statusID, showComplete);
    if (wsStatusData === 35) setShowComplete(false);

    if (wsStatusData === 99 || wsStatusData === 98 || wsStatusData === 1) {
      // console.log("set true");
      setShowComplete(true);
    }

    // eslint-disable-next-line
  }, [wsStatusData]);

  useEffect(() => {
    if (appealData && appealStatus === "completed" && !appealError) {
      // console.log("set true", appealData, appealStatus, appealError);
      dispatch(setOrderStatus(appealData));
    }
  }, [appealData, appealStatus, appealError, dispatch]);

  useEffect(() => {
    if (
      confirmReceivedData &&
      confirmReceivedStatus === "completed" &&
      !confirmReceivedError
    ) {
      dispatch(setOrderStatus(confirmReceivedData));
      // console.log("set true");
      setShowComplete(true);
    }
  }, [
    confirmReceivedData,
    confirmReceivedStatus,
    confirmReceivedError,
    dispatch,
  ]);

  useEffect(() => {
    if (buy1Data) {
      // dispatch(setInstantOrderData(buy1Data));
    }
  }, [buy1Data, dispatch]);

  useEffect(() => {
    if (statusID === 35) {
      setShowComplete(false);
    }
  }, [statusID]);

  // ===========
  //  function
  // ===========
  const handleClick = () => {
    buyMatch2(match.params.id);
  };

  const backToHome = () => {
    history.replace("/home/overview");
    cleanAll();
  };

  console.log(statusID);

  return (
    <div className="row mt-4">
      <div className="col-xl-8 col-12">
        <p className="welcome_txt pl-0" style={{ marginTop: 20 }}>
          {t("welcome_text")}
        </p>
        <div className="contentbox">
          <InstantNav tab={tab} setTab={setTab} jumpTo={true} />
          <div className="txt_12 pt_20">{t("instant_transaction")}</div>
          <div id="buy" className="tabcontent">
            {buy1Data && !showComplete ? (
              <>
                <div className="d-flex justify-content-between flex-column-mobile">
                  {/* Block-1  --pay info */}
                  <div className="w45_m100 mobile-width">
                    {/* Pay Timer */}
                    <div className="easy_counter mt-4 d-flex justify-content-start align-items-center mb-2">
                      <span className="txt_12 mr-auto">
                        {t("instant_payee_data")}
                      </span>
                      <span className="i_clock mr-1 mb-1" />

                      {wsStatusData !== 35 && (
                        <>
                          <span className="txt_12">
                            {t("instant_pay_time")}：
                          </span>
                          <Countdown
                            onComplete={() => setOverTime(true)}
                            renderer={CountDownTimer}
                            date={timeLeft}
                          />
                        </>
                      )}
                    </div>
                    {/* 收款方資料 */}
                    <div className="lightblue_bg txt_12 d-flex flex-column py-4">
                      <span className="txt_12_grey mb-4">
                        {t("instant_payee_name")}：{buy1Data.P2}
                      </span>
                      <span className="txt_12_grey mb-4">
                        {t("instant_payee_account")}：{buy1Data.P1}
                      </span>
                      <span className="txt_12_grey mb-4">
                        {t("instant_bank")}：{buy1Data.P3}
                      </span>
                      <span className="txt_12_grey">
                        {t("instant_city")}：{buy1Data.P4}
                      </span>
                    </div>
                    {/* 付款方資料 */}
                    <div className="w45_m100 mobile-width w-100">
                      <p className="txt_12 pt_20 mb-2">
                        {t("instant_payer_data")}
                      </p>
                      <p className="txt_12_grey lightblue_bg py-4">
                        {t("instant_payer_name")}：{paymentName}
                      </p>
                    </div>
                  </div>

                  {/* Block-2  --交易資料 */}
                  <div className="easy_info mobile-width h-50 flex-order1-mobile p-4">
                    <div className="inline">
                      <div className="txt_12_grey">{t("instant_exRate")}：</div>
                      <span className="">{buy1Data.D1.toFixed(2)}</span>
                    </div>

                    <div className="right_txt16">
                      <span className="i_red" />
                      <span className="red">{t("instant_sell")}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="txt_12_grey mb-0 ">
                          {t("instant_price")}
                        </p>
                        <p className="c_blue ">{buy1Data.D2.toFixed(2)} CNY</p>
                      </div>

                      <div>
                        <p className="txt_12_grey text-right mb-0 ">
                          {t("instant_qua")}
                        </p>
                        <p className="">
                          {Math.abs(buy1Data.UsdtAmt).toFixed(2)} USDT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button */}
                {wsStatusData === 33 ? (
                  <button className="mw400 disable-easy-btn mobile-width">
                    <span className="i_ready"></span>
                    {t("btn_preparing")}
                  </button>
                ) : null}

                {wsStatusData === 34 && !httpLoading ? (
                  <>
                    <Button
                      onClick={handleClick}
                      className="easy-btn mw400 mobile-width"
                      style={{}}
                    >
                      {t("btn_buyer_already_pay")}
                    </Button>

                    <Button
                      onClick={() => appealReq(match.params.id)}
                      className="easy-btn mw400 mobile-width"
                      style={{ backgroundColor: "#bfbfbf" }}
                      disabled={appealStatus === "pending"}
                    >
                      {appealStatus === "pending" ? "loading..." : "申诉"}
                    </Button>
                  </>
                ) : null}

                {wsStatusData === 34 && httpLoading ? (
                  <Button
                    className="disable-easy-btn mobile-width mw400"
                    disabled
                  >
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {t("btn_loading")}...
                  </Button>
                ) : null}

                {wsStatusData === 35 && (
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
                    <Button
                      onClick={handleClick}
                      className="easy-btn mw400 mobile-width"
                      style={{}}
                      disabled={httpLoading}
                    >
                      {httpLoading ? "Loading..." : "確認已收款"}
                    </Button>
                  </div>
                )}

                <FromFooter />
              </>
            ) : showComplete && statusID && buy1Data ? (
              <CompleteStatus
                // instantData={instantData}
                confirm={handleClick}
                statusID={statusID}
                confirmReceivedReq={confirmReceivedReq}
                orderToken={orderToken}
                confirmReceivedStatus={confirmReceivedStatus}
                wsStatus={wsStatusData}
                backToHome={backToHome}
                hash={buy1Data.Tx_HASH}
                setShowComplete={setShowComplete}
                type="sell"
                action="confirm"
              />
            ) : (
              <BaseSpinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyDetail;
