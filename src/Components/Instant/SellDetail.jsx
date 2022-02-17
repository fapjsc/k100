import { useContext, useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import Countdown from "react-countdown";

import { useSelector } from "react-redux";

// Context
import InstantContext from "../../context/instant/InstantContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import BuyContext from "../../context/buy/BuyContext";

// Lang Context
import { useI18n } from "../../lang";

// Components
import FromFooter from "../Layout/FormFooter";
import BaseSpinner from "../Ui/BaseSpinner";
import CompleteStatus from "../universal/CompleteStatus";
import Cancel from "../universal/Cancel";
import InstantNav from "../Instant/InstantNav";
import CountDownTimer from "../universal/countDownTimer";
import Timer from "../Buy/Timer";

// Style
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import warningImg from "../../Assets/warning.png";

const SellDetail = () => {
  console.log("instant sell");
  // Lang Context
  const { t } = useI18n();
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  const { orderStatus } = useSelector((state) => state.order);

  const { Order_StatusID: statusID } = orderStatus || {};

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError, httpLoading } = httpErrorContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { deltaTime, GetDeltaTime, setDeltaTime } = buyContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    sell1Data,
    sellMatch1,
    sellMatch2,
    statusWs,
    wsStatusData,
    wsStatusClient,
    cleanAll,
    paymentName,
  } = instantContext;

  // Init State
  const [overTime1, setOvertime1] = useState(false);
  const [overTime2, setOvertime2] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [tab, setTab] = useState("all");
  const [timeLeft, setTimeLeft] = useState(
    Date.now() + 1000 * 60 * 15 - deltaTime * 1000
  );
  const [timeLeft2, setTimeLeft2] = useState(
    Date.now() + 1000 * 60 * 30 - deltaTime * 1000
  );

  console.log(wsStatusData);

  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    statusWs(match.params.id);
    GetDeltaTime(match.params.id);

    if (!sell1Data) sellMatch1(match.params.id);
    return () => {
      if (wsStatusClient) wsStatusClient.close();
      setDeltaTime(null);
      cleanAll();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeLeft(Date.now() + 1000 * 60 * 15 - deltaTime * 1000);
    setTimeLeft2(Date.now() + 1000 * 60 * 30 - deltaTime * 1000);

    if (deltaTime > 1800) setOvertime2(true);
    if (deltaTime > 900 && deltaTime <= 1800) setOvertime1(true);
  }, [deltaTime]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError("");
    };
    //eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (wsStatusData === 35) {
      setShowComplete(false);
    }

    if (wsStatusData === 99 || wsStatusData === 98) {
      setShowComplete(true);
      setShowCancel(false);
    }

    if (wsStatusData === 34 || wsStatusData === 1) setShowComplete(true);

    // eslint-disable-next-line
  }, [wsStatusData]);

  // ===========
  //  function
  // ===========
  const handleClick = () => {
    sellMatch2(match.params.id);
  };

  const handleCancel = () => {
    setShowCancel(true);
  };

  const handleCountDownComplete = () => {
    setOvertime1(true);
  };

  const handleCountDownComplete2 = () => {
    setOvertime2(true);
  };

  const backToHome = () => {
    if (wsStatusClient) wsStatusClient.close();
    history.replace("/home/overview");
    setOvertime1(false);
    setOvertime2(false);
    setDeltaTime(null);
    cleanAll();
  };

  return (
    <>
      <Cancel
        show={showCancel}
        onHide={() => setShowCancel(false)}
        hash={sell1Data.Tx_HASH}
        token={match.params.id}
        type="instant"
      />
      <div className="row mt-4">
        <div className="col-xl-8 col-12">
          <p className="welcome_txt pl-0" style={{ marginTop: 20 }}>
            {t("welcome_text")}
          </p>
          <div className="contentbox">
            <InstantNav tab={tab} setTab={setTab} jumpTo={true} />
            <div className="txt_12 pt_20">{t("instant_nav_all")}</div>
            <div id="sell" className="tabcontent">
              {sell1Data && !showComplete ? (
                <>
                  {/* 第一階段倒數結束前 */}
                  <div className="d-flex justify-content-between flex-column-mobile">
                    {/* Block-1  --pay info */}
                    <div className="w45_m100 mobile-width">
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
                              onComplete={handleCountDownComplete}
                              renderer={CountDownTimer}
                              date={timeLeft}
                            />
                          </>
                        )}
                      </div>
                      {/* 收款方資料 */}
                      <div className="lightblue_bg txt_12 d-flex flex-column py-4">
                        <span className="txt_12_grey mb-4">
                          {t("instant_payee_name")}：{sell1Data.P2}
                        </span>
                        <span className="txt_12_grey mb-4">
                          {t("instant_payee_account")}：{sell1Data.P1}
                        </span>
                        <span className="txt_12_grey mb-4">
                          {t("instant_bank")}：{sell1Data.P3}
                        </span>
                        <span className="txt_12_grey">
                          {t("instant_city")}：{sell1Data.P4}
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
                        <div className="txt_12_grey">
                          {t("instant_exRate")}：
                        </div>
                        <span className="">{sell1Data.D1.toFixed(2)}</span>
                      </div>

                      <div className="right_txt16">
                        <span className="i_blue1" />
                        <span className="blue">{t("instant_buy")}</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="txt_12_grey mb-0">
                            {t("instant_price")}
                          </p>
                          <p className="c_blue">
                            {sell1Data.D2.toFixed(2)} CNY
                          </p>
                        </div>
                        <div>
                          <p className="txt_12_grey text-right mb-0">
                            {t("instant_qua")}
                          </p>
                          <p className="">
                            {Math.abs(sell1Data.UsdtAmt).toFixed(2)} USDT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* {wsStatusData === 34 && !httpLoading ? (
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
                  ) : null} */}

                  {wsStatusData === 33 && (
                    <div>
                      <Button
                        onClick={handleClick}
                        disabled={overTime1 || httpLoading}
                        className="easy-btn mw400 mobile-width"
                        style={{
                          marginTop: 50,
                        }}
                      >

                        {httpLoading ? 'loading...' : t("btn_already_pay")}
                      </Button>
                      <div className="text-center">
                        <span
                          style={{
                            cursor: "pointer",
                            paddingBottom: "2px",
                            borderBottom: "1px solid #262e45",
                            fontSize: 12,
                            color: "#262e45",
                            borderColor: "#262e45",
                          }}
                          onClick={handleCancel}
                        >
                          {t("btn_cancel_order")}
                        </span>
                      </div>
                    </div>
                  )}

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
                      <div className="text-center">
                        <span
                          style={{
                            cursor: "pointer",
                            paddingBottom: "2px",
                            borderBottom: "1px solid #262e45",
                            fontSize: 12,
                            color: "#262e45",
                            borderColor: "#262e45",
                          }}
                          onClick={handleCancel}
                        >
                          {t("btn_cancel_order")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 第二階段倒數結束 */}
                  {/* {overTime2 && (
                    <div>
                      <h2
                        className="txt_18 text-center my-4"
                        style={{ color: "#242e47" }}
                      >
                        {t("instant_over_time")}
                      </h2>
                      <Button
                        onClick={backToHome}
                        className="easy-btn mw400 mobile-width"
                        variant="primary"
                      >
                        {t("btn_back_home")}
                      </Button>
                    </div>
                  )} */}

                  {/* Button --正常 */}
                  {/* {!overTime1 && (
                    <>
                      {httpLoading ? (
                        <Button
                          variant="secondary"
                          className="easy-btn mw400 mobile-width"
                          style={{ marginTop: 50 }}
                          disabled
                        >
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {t("btn_loading")}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleClick}
                          disabled={overTime1}
                          className="easy-btn mw400 mobile-width"
                          style={{
                            marginTop: 50,
                          }}
                        >
                          {t("btn_already_pay")}...
                        </Button>
                      )}
                    </>
                  )} */}

                  {/* Button --倒數 */}
                  {/* {overTime1 && !overTime2 ? (
                    <>
                      {httpLoading ? (
                        <Button
                          variant="secondary"
                          className="easy-btn mw400 mobile-width"
                          style={{ marginTop: 50 }}
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
                      ) : (
                        <Button
                          onClick={handleClick}
                          disabled={overTime2}
                          className="easy-btn mw400 mobile-width"
                          style={{
                            marginTop: 50,
                          }}
                        >
                          <Countdown
                            onComplete={handleCountDownComplete2}
                            renderer={Timer}
                            date={timeLeft2}
                          />
                          &nbsp; {t("btn_already_pay")}
                        </Button>
                      )}
                    </>
                  ) : null}

                  <div className="text-center">
                    <span
                      style={{
                        cursor: "pointer",
                        paddingBottom: "2px",
                        borderBottom: "1px solid #262e45",
                        fontSize: 12,
                        color: "#262e45",
                        borderColor: "#262e45",
                      }}
                      // onClick={() => setShowCancel(true)}
                      onClick={handleCancel}
                    >
                      {t("btn_cancel_order")}
                    </span>
                  </div> */}
                  <FromFooter />
                </>
              ) : sell1Data && showComplete ? (
                // 交易結果
                <CompleteStatus
                  statusID={statusID}
                  wsStatus={wsStatusData}
                  backToHome={backToHome}
                  hash={sell1Data.Tx_HASH}
                  type="buy"
                  action="confirm"
                />
              ) : (
                <BaseSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellDetail;
