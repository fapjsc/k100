import { useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import HistoryReducer from "./HistoryReducer";
import HistoryContext from "./HistoryContext";
import {
  SET_ALL_HISTORY,
  SET_SINGLE_DETAIL,
  SET_WAIT_HISTORY,
  HISTORY_LOADING,
} from "../type";

// Context
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

const HistoryState = (props) => {
  // Router Props
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { handleHttpError } = httpErrorContext;

  // Init State
  const initialState = {
    allHistory: [],
    waitList: [],
    singleDetail: null,
    historyLoading: false,
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem("token");

    if (token) {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("login_session", token);

      return headers;
    } else {
      history.replace("/auth/login");
      return;
    }
  };

  // Get History Wait
  const setWaitList = async () => {
    const headers = getHeader();

    const historyApi = "/j/GetTxPendings.aspx";

    try {
      const res = await fetch(historyApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        const { data } = resData;
        // console.log(data);

        const newData = data.map((h) => {
          if (h.MasterType === 0) {
            h.MasterType = "買入";
            return h;
          } else if (h.MasterType === 1) {
            h.MasterType = "賣出";
            return h;
          } else if (h.MasterType === 2) {
            h.MasterType = "轉出";
            return h;
          } else {
            h.MasterType = "轉入";
            return h;
          }
        });

        dispatch({ type: SET_WAIT_HISTORY, payload: newData });
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // get history all
  const getHistoryAll = async () => {
    setLoading(true);
    const headers = getHeader();

    const historyApi = "/j/GetTxHistory.aspx";

    try {
      const res = await fetch(historyApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        dispatch({ type: SET_ALL_HISTORY, payload: resData.data });
      } else {
        handleHttpError(resData);
      }
      setLoading(false);
    } catch (error) {
      handleHttpError(error);
      setLoading(false);
    }
  };

  // get single detail
  const detailReq = async (detailToken) => {
    setLoading(true);
    const headers = getHeader();

    const detailApi = "/j/GetTxDetail.aspx";

    try {
      const res = await fetch(detailApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          Token: detailToken,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        const { data } = resData;

        // buy and sell
        if (data.MasterType === 1 || data.MasterType === 0) {

          let payer;
          let payerAccount;
          let payerBankCode;

          if (data.P5) {
            payer = data.P5.split("|")[0];
            payerAccount = data.P5.split("|")[1];
            payerBankCode = data.P5.split("|")[2];
          }

          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            account: data.P1,
            payee: data.P2,
            bank: data.P3,
            branch: data.P4,
            payer,
            payerAccount,
            payerBankCode,
            exchangePrice: data.D1,
            rmb: data.D2,
            charge: data.D3,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };

          setSingleDetail(orderDetail);
        }

        // 轉出
        if (data.MasterType === 2) {
          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            receivingAddress: data.P1,
            charge: data.D1,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };
          setSingleDetail(orderDetail);
        }

        // 轉入
        if (data.MasterType === 3) {
          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };
          setSingleDetail(orderDetail);
        }

        // handle error
      } else {
        handleHttpError(resData);
      }

      setLoading(false);
    } catch (error) {
      handleHttpError(error);
      setLoading(false);
    }
  };

  // Set Loading
  const setLoading = (value) => {
    dispatch({ type: HISTORY_LOADING, payload: value });
  };

  const setSingleDetail = (orderDetail) => {
    dispatch({ type: SET_SINGLE_DETAIL, payload: orderDetail });
  };

  const [state, dispatch] = useReducer(HistoryReducer, initialState);

  return (
    <HistoryContext.Provider
      value={{
        allHistory: state.allHistory,
        singleDetail: state.singleDetail,
        waitList: state.waitList,
        historyLoading: state.historyLoading,

        getHistoryAll,
        detailReq,
        setWaitList,
        setSingleDetail,
      }}
    >
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryState;
