import { useState, useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

// Context
import HistoryContext from "../../context/history/HistoryContext";
import InstantContext from "../../context/instant/InstantContext";

// Hooks
import useHttp from "../../hooks/useHttp";

// Actions
import { setOrderStatus } from "../../store/actions/orderActions";

// Apis
import { cancelOrder, confirmReceived } from "../../lib/api";

// Lang Context
import { useI18n } from "../../lang";

// Components
import HistoryDetail from "../History/HistoryAllDetail";

// Style
import Card from "react-bootstrap/Card";

const CompleteStatus = (props) => {
  // console.log(props.action);
  // console.log(props.type);

  const dispatch = useDispatch();
  const {
    hash,
    instantData,
    statusID,
    // confirmReceivedReq,
    // confirmReceivedStatus,
    backToHome,
  } = props;
  // Lang Context
  const { t } = useI18n();

  const { orderStatus } = useSelector((state) => state.order);
  const { MasterType } = orderStatus || {};

  // console.log(Order_TypeID);

  // Buy2 Http

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

  // 取消訂單請求
  const {
    sendRequest: cancelReq,
    data: cancelData,
    error: cancelError,
    status: cancelStatus,
  } = useHttp(cancelOrder);

  // 確定收款請求
  const {
    sendRequest: confirmReceivedReq,
    data: confirmReceivedData,
    status: confirmReceivedStatus,
    error: confirmReceivedError,
  } = useHttp(confirmReceived);

  useEffect(() => {
    if (cancelData && cancelStatus === "completed" && !cancelError) {
      dispatch(setOrderStatus(cancelData));
    }
  }, [cancelData, cancelError, cancelStatus, dispatch]);

  useEffect(() => {
    if (
      confirmReceivedData &&
      confirmReceivedStatus === "completed" &&
      !confirmReceivedError
    ) {
      dispatch(setOrderStatus(confirmReceivedData));
    }
  }, [
    confirmReceivedData,
    confirmReceivedStatus,
    confirmReceivedError,
    dispatch,
  ]);

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

  if (props.wsStatus === 35 || statusID === 35) {
    return (
      <Card className="border-0 text-center pb-4">
        <div className="i_error mt-4 mb-4" />
        <h4 className="c_blue">申訴中..</h4>
        <br />
        <p className="txt_12_grey text-break">
          {t("transaction_hash")}：{" "}
          {instantData?.hash || buy1Data?.Tx_HASH || hash}
        </p>
        <p className="txt_12_grey text-break"></p>

        {/* 買 */}
        {MasterType === 0 && (
          <>
            {props.type === "sell" && (
              <button
                disabled={confirmReceivedStatus === "pending"}
                onClick={() => confirmReceivedReq({ orderToken })}
                className="easy-btn mw400"
              >
                {confirmReceivedStatus === "pending" ? "Loading..." : "确认"}
              </button>
            )}

            {props.type === "buy" && (
              <button
                disabled={cancelStatus === "pending"}
                onClick={() => cancelReq(orderToken)}
                className="easy-btn"
              >
                {cancelStatus === "pending" ? "Loading..." : "取消"}
              </button>
            )}
          </>
        )}

        {/* 賣 */}
        {MasterType === 1 && (
          <>
            {props.type === "sell" && (
              <button
                disabled={confirmReceivedStatus === "pending"}
                onClick={() => confirmReceivedReq({ orderToken, type: "sell" })}
                className="easy-btn mw400"
              >
                {confirmReceivedStatus === "pending" ? "Loading..." : "确认"}
              </button>
            )}

            {props.type === "buy" && (
              <button
                disabled={cancelStatus === "pending"}
                onClick={() => cancelReq(orderToken)}
                className="easy-btn"
              >
                {cancelStatus === "pending" ? "Loading..." : "取消"}
              </button>
            )}
          </>
        )}
      </Card>
    );
  }

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
        <button onClick={backToHome} className="easy-btn mw400">
          {t("btn_back_home")}
        </button>
      </Card>
    );
  }
};

export default CompleteStatus;
