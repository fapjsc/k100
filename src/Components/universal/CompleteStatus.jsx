import { useState, useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Button } from "react-bootstrap";

// Context
import HistoryContext from "../../context/history/HistoryContext";
import InstantContext from "../../context/instant/InstantContext";

// Hooks
import useHttp from "../../hooks/useHttp";

// Actions
import { setOrderStatus } from "../../store/actions/orderActions";

// Apis
import { orderAppeal } from "../../lib/api";

// Lang Context
import { useI18n } from "../../lang";

// Components
import HistoryDetail from "../History/HistoryAllDetail";

// Style
import Card from "react-bootstrap/Card";

const CompleteStatus = (props) => {
  const dispatch = useDispatch();
  const { hash, instantData, statusID, backToHome, setShowComplete } = props;

  // Lang Context
  const { t } = useI18n();

  const { orderStatus } = useSelector((state) => state.order);
  const { MasterType } = orderStatus || {};

  // Router Props
  const match = useRouteMatch();

  const orderToken = match.params.id;

  // Init State
  const [show, setShow] = useState(false);

  // History Context
  const historyContext = useContext(HistoryContext);
  const { singleDetail, detailReq, setSingleDetail } = historyContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, buy1Data } = instantContext;

  // Appeal http
  const {
    sendRequest: appealReq,
    data: appealData,
    status: appealStatus,
    error: appealError,
  } = useHttp(orderAppeal);

  useEffect(() => {
    if (appealData && appealStatus === "completed" && !appealError) {
      // console.log("set true", appealData, appealStatus, appealError);
      dispatch(setOrderStatus(appealData));
      if (setShowComplete) {
        setShowComplete(false);
      }
    }
    // eslint-disable-next-line
  }, [appealData, appealStatus, appealError, dispatch]);

  const handleClick = () => {
    if (sell1Data || buy1Data) {
      handleInstantData();
    } else {
      detailReq(match.params.id);
    }
    setShow(true);
  };

  const handleHide = () => {
    setShow(false);
  };

  const handleInstantData = () => {
    let orderDetail;

    if (sell1Data) {
      orderDetail = {
        date: sell1Data.CreateDate,
        txHASH: sell1Data.Tx_HASH,
        usdtAmt: sell1Data.UsdtAmt,
        account: sell1Data.P1,
        payee: sell1Data.P2,
        bank: sell1Data.P3,
        branch: sell1Data.P4,
        exchangePrice: sell1Data.D1,
        rmb: sell1Data.D2,
        charge: sell1Data.D3,
        orderState: sell1Data.Order_StatusID,
        type: 0,
      };
    }

    if (buy1Data) {
      orderDetail = {
        date: buy1Data.CreateDate,
        txHASH: buy1Data.Tx_HASH,
        usdtAmt: buy1Data.UsdtAmt,
        account: buy1Data.P1,
        payee: buy1Data.P2,
        bank: buy1Data.P3,
        branch: buy1Data.P4,
        exchangePrice: buy1Data.D1,
        rmb: buy1Data.D2,
        charge: buy1Data.D3,
        orderState: buy1Data.Order_StatusID,
        type: 1,
      };
    }

    setSingleDetail(orderDetail);
  };

  if (props.wsStatus === 34 || statusID === 34) {
    return (
      <Card className="border-0 text-center pb-4">
        <div className="i_notyet mt-4" />
        <h4 className="c_blue">{t("wait_confirm")}</h4>
        <br />
        <p className="txt_12_grey text-break">
          {t("transaction_hash")}： {props.hash}
        </p>
        {props.type === "buy" && (
          <p className="txt_12_grey text-break">{t("complete_text")}</p>
        )}

        <br />
        <button onClick={backToHome} className="easy-btn mw400">
          {t("btn_back_home")}
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 1 || statusID === 1) {
    return (
      <>
        {singleDetail && <HistoryDetail show={show} onHide={handleHide} />}

        <Card className="border-0 text-center pb-4">
          <div className="i_done mt-4" />
          <h4 className="c_blue">{t("transaction_done")}</h4>
          <br />
          <p className="txt_12_grey text-break">
            {t("transaction_hash")}： {props.hash || instantData.Tx_HASH}
          </p>
          {props.type === "buy" && (
            <p className="txt_12_grey text-break">{t("transaction_text")}</p>
          )}
          <br />
          <button onClick={backToHome} className="easy-btn mw400">
            {t("btn_back_home")}
          </button>
          <span
            className="txt_12_grey"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {t("btn_transaction_detail")}
          </span>
        </Card>
      </>
    );
  }

  // 取消
  if (props.wsStatus === 99 || statusID === 99) {
    return (
      <Card className="border-0 text-center pb-4">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">{t("transaction_cancel")}</h4>
        <br />
        <p className="txt_12_grey text-break">
          {t("transaction_hash")}： {props.hash}
        </p>
        <br />
        <button onClick={backToHome} className="easy-btn mw400">
          {t("btn_back_home")}
        </button>
      </Card>
    );
  }

  // 超時
  if (props.wsStatus === 98 || statusID === 98) {
    return (
      <Card className="border-0 text-center pb-4">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">{t("transaction_over_time")}</h4>
        <br />
        <p className="txt_12_grey text-break">
          {t("transaction_hash")}： {hash}
        </p>
        <br />
        {(MasterType === 0 && props.type === "buy") ||
        (MasterType === 1 && props.type === "buy") ? (
          <Button
            onClick={() => appealReq(orderToken)}
            className="easy-btn mw400"
            disabled={appealStatus === "pending"}
          >
            {appealStatus === "pending" ? "Loading..." : "申訴"}
          </Button>
        ) : null}

        <button
          onClick={backToHome}
          className="easy-btn mw400"
          style={{ backgroundColor: "#f2f2f2", color: "#707070" }}
        >
          {t("btn_back_home")}
        </button>
      </Card>
    );
  }
};

export default CompleteStatus;
