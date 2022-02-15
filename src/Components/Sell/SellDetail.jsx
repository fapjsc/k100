import { useContext, useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import { useSelector } from "react-redux";

// Context
import SellContext from "../../context/sell/SellContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import BuyContext from "../../context/buy/BuyContext";

// lang Context
import { useI18n } from "../../lang";

// Hooks
import useHttp from "../../hooks/useHttp";

// Apis
import { orderAppeal } from "../../lib/api";

// Components
import SetAccount from "../Buy/SetAccount";
import FormFooter from "../Layout/FormFooter";
import SellHeader from "./SellHeader";
import BaseSpinner from "../Ui/BaseSpinner";

// Style
import btnWait from "../../Assets/btn_wait.png";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const SellDetail = () => {
  const { orderStatus } = useSelector((state) => state.order);
  const { Order_StatusID: statusID } = orderStatus || {};


  // Appeal http
  const {
    sendRequest: appealReq,
    data: appealData,
    status: appealStatus,
    error: appealError,
  } = useHttp(orderAppeal);

  // Lang Context
  const { t } = useI18n();
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  const token = match.params.id;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsData, setConfirmSell, confirmSellAction, sellStatus, cleanAll } =
    sellContext;

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading } = httpErrorContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { GetDeltaTime, setDeltaTime, deltaTime } = buyContext;

  // Init State
  const [isClick, setIsClick] = useState(false);
  const [overTime, setOverTime] = useState(false);

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    if (!match.params.id) history.replace("/home/overview");
    GetDeltaTime(match.params.id);

    return () => {
      setDeltaTime(null);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (deltaTime > 1800) {
      setOverTime(true);
    } else {
      setOverTime(false);
    }
  }, [deltaTime]);

  // ===========
  //  Function
  // ===========
  // 確認收款
  const handleSubmit = () => {
    if (!isClick) {
      setConfirmSell(true);
      confirmSellAction(match.params.id);
    }

    setIsClick(true);
  };

  const backToHome = () => {
    history.replace("/home/overview");
    cleanAll();
  };

  return (
    <Container className="">
      {overTime ? (
        <div>
          <h2 className="txt_18 text-center my-4" style={{ color: "#242e47" }}>
            {t("sell_over_time")}
          </h2>
          <Button
            onClick={backToHome}
            className="easy-btn mw400 mobile-width"
            variant="primary"
          >
            {t("btn_back_home")}
          </Button>
        </div>
      ) : !overTime ? (
        <>
          <Row className="mb-2 mt-4">
            <Col className="mt-4 pl-1 mb-2">
              <SellHeader setOverTime={setOverTime} />
            </Col>
          </Row>

          <Row className="mb-2 justify-content-between">
            <Col xl={6} className="txt_12 lightblue_bg h-100">
              <p>
                {t("sell_detail_amount")}： &emsp;
                <span
                  style={{
                    color: "#3e80f9",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {wsData && wsData.D2.toFixed(2) + ` CNY`}
                </span>
              </p>
              <p>
                {t("sell_detail_payee")}：{wsData && wsData.P2}
              </p>
              <p>
                {t("sell_detail_payee_account")}：{wsData && wsData.P1}
              </p>
              <p>
                {t("sell_detail_payee_bank")}：{wsData && wsData.P3}
              </p>
              <p>
                {t("sell_detail_payee_city")}：{wsData && wsData.P4}
              </p>
            </Col>

            {wsData && (
              <Col xl={5} className="pl-4">
                <SetAccount
                  usdtAmt={Math.abs(wsData.UsdtAmt).toFixed(2)}
                  rmbAmt={wsData.D2.toFixed(2)}
                />
              </Col>
            )}
          </Row>

          <Row className="justify-content-center mt-4">
            <Col className="mw400 text-center px-0">
              {!httpLoading ? (
                <>
                  <Button
                    disabled={overTime}
                    onClick={handleSubmit}
                    className="mw400"
                    block
                    style={statusID === 34 ? infoBtn : infoBtnDisabled}
                  >
                    {statusID === 33 && (
                      <img
                        src={btnWait}
                        alt="btn wait"
                        style={{
                          height: 25,
                          marginRight: 10,
                        }}
                      />
                    )}

                    <span className="">
                      {statusID === 34
                        ? t("btn_buyer_already_pay")
                        : t("btn_preparing")}
                    </span>
                  </Button>

                  {statusID === 34 && (
                    <Button
                      onClick={() => appealReq(token)}
                      className="easy-btn mw400 mobile-width"
                      style={{ backgroundColor: "#bfbfbf", width: "100%" }}
                      disabled={appealStatus === "pending"}
                    >
                      {appealStatus === "pending" ? "loading..." : "申诉"}
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="secondary" disabled style={infoBtnDisabled}>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="md"
                    role="status"
                    aria-hidden="true"
                  />
                  {t("btn_loading")}...
                </Button>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <BaseSpinner />
      )}

      <FormFooter />
    </Container>
  );
};

const infoBtn = {
  backgroundColor: "#3E80F9",
  borderRadius: "5px",
  color: "#fff",
  width: "100%",
  padding: "15px",
  margin: "10px auto 15px",
  border: "none",
  transition: "0.3s",
  cursor: "pointer",
  fontSize: "17px",
};

const infoBtnDisabled = {
  backgroundColor: "grey",
  borderRadius: "5px",
  color: "#fff",
  width: "100%",
  padding: "15px",
  margin: "10px auto 15px",
  border: "none",
  transition: "0.3s",
  fontSize: "17px",
  opacity: "0.65",
  cursor: "not-allowed",
};

export default SellDetail;
