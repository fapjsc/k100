import { useReducer, useContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import TransferContext from "./TransferContext";
import TransferReducer from "./TransferReducer";
import {
  SET_TRANSFER_ORDER_TOKEN,
  SET_TRANSFER_STATUS,
  SET_USDT_COUNT,
  SET_ORDER_DETAIL,
  GET_WS_CLIENT,
} from "../type";

// Context
import HttpErrorContext from "../httpError/HttpErrorContext";
// import BalanceContext from '../balance/BalanceContext';

const TransferState = (props) => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { setHttpLoading, handleHttpError } = httpErrorContext;

  // Init State
  const initialState = {
    transferOrderToken: null,
    transferStatus: null,
    usdtCount: null,
    orderDetail: null,
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("login_session", token);

    return headers;
  };

  // webSocket連接
  const transferWebSocket = (orderToken) => {
    if (!orderToken) return;

    const loginSession = localStorage.getItem("token");
    if (!loginSession) return;

    const connectWs = "j/ws_orderstatus.ashx";

    let url;

    // if (window.location.protocol === 'http:') {
    //   url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    // } else {
    //   url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    // }

    if (!window.location.host.includes("demo")) {
      url = `wss://${window.location.host}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `wss://demo.k100u.com/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new ReconnectingWebSocket(url);

    dispatch({ type: GET_WS_CLIENT, payload: client });

    // 1.建立連接
    client.onopen = () => {
      // console.log('websocket transfer connected sell');
    };

    // 2.收到server回復
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      // console.log('got transfer reply!', dataFromServer);
      dispatch({
        type: SET_TRANSFER_STATUS,
        payload: dataFromServer.data.Order_StatusID,
      });
    };

    // 3.錯誤處理
    client.onclose = (message) => {
      // console.log('關閉連線.....');
    };
  };

  // 關閉webSocket
  const closeWebSocket = () => {
    if (state.wsClient) {
      state.wsClient.close();
    } else {
      return;
    }
  };

  // 驗證錢包地址 ---ERC
  const checkErcAddress = async (transferAddress, transferCount) => {
    const headers = getHeader();
    if (!headers) return;

    const checkErcApi = `/j/ChkToAddressValid.aspx`;

    try {
      const res = await fetch(checkErcApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ToAddress: transferAddress.val,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        sendTransferReq(transferAddress, transferCount);
      } else {
        handleHttpError(resData);
        setHttpLoading(false);
      }
    } catch (error) {
      handleHttpError(error);
      setHttpLoading(false);
    }
  };

  // send transfer req --- ERC
  const sendTransferReq = async (transferAddress, transferCount) => {
    const headers = getHeader();
    if (!transferAddress || !transferCount || !headers) {
      setHttpLoading(false);
      handleHttpError("");
      return;
    }

    const transferApi = "/j/Req_Transfer1.aspx";
    try {
      const res = await fetch(transferApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ToAddress: transferAddress.val,
          UsdtAmt: transferCount.val,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        setOrderToken(resData.data.order_token);
        detailReq(resData.data.order_token);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
    setHttpLoading(false);
  };

  // 驗證錢包地址 ---TRC
  const checkTrcAddress = async (transferAddress, transferCount) => {
    const headers = getHeader();
    if (!headers) return;

    const checkErcApi = `/j/ChkToAddressValid2.aspx`;

    try {
      const res = await fetch(checkErcApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ToAddress: transferAddress.val,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        sendTransferReqTrc(transferAddress, transferCount);
      } else {
        handleHttpError(resData);
        setHttpLoading(false);
      }
    } catch (error) {
      handleHttpError(error);
      setHttpLoading(false);
    }
  };

  // send transfer req --- TRC
  const sendTransferReqTrc = async (transferAddress, transferCount) => {
    const headers = getHeader();
    if (!transferAddress || !transferCount || !headers) {
      setHttpLoading(false);
      handleHttpError("");
      return;
    }

    const transferApi = "/j/Req_Transfer2.aspx";
    try {
      const res = await fetch(transferApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ToAddress: transferAddress.val,
          UsdtAmt: transferCount.val,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        setOrderToken(resData.data.order_token);
        detailReq(resData.data.order_token);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
    setHttpLoading(false);
  };

  // get detail
  const detailReq = async (orderToken) => {
    const headers = getHeader();

    if (!orderToken || !headers) {
      setHttpLoading(false);
      return;
    }

    const detailApi = "/j/GetTxDetail.aspx";
    try {
      const res = await fetch(detailApi, {
        method: "POST",
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });
      const resData = await res.json();

      // console.log(resData, 'detail req ====');

      if (resData.code === 200) {
        setUsdtCount(Math.abs(resData.data.UsdtAmt));
        setOrderDetail(resData);
      } else {
        handleHttpError(resData);
        setHttpLoading(false);
      }
    } catch (error) {
      handleHttpError(error);
      setHttpLoading(false);
    }

    setHttpLoading(false);
  };

  // clean status
  const cleanStatus = () => {
    dispatch({ type: SET_TRANSFER_STATUS, payload: null });
  };

  // set usdt count
  const setUsdtCount = (value) => {
    dispatch({ type: SET_USDT_COUNT, payload: value });
  };

  // set order token
  const setOrderToken = (value) => {
    dispatch({ type: SET_TRANSFER_ORDER_TOKEN, payload: value });
  };

  // Set Order Detail
  const setOrderDetail = (data) => {
    dispatch({ type: SET_ORDER_DETAIL, payload: data });
  };

  // useReducer
  const [state, dispatch] = useReducer(TransferReducer, initialState);

  return (
    <TransferContext.Provider
      value={{
        transferOrderToken: state.transferOrderToken,
        transferStatus: state.transferStatus,
        usdtCount: state.usdtCount,
        orderDetail: state.orderDetail,

        transferWebSocket,
        cleanStatus,
        detailReq,
        setUsdtCount,
        setOrderToken,
        closeWebSocket,
        checkErcAddress,
        checkTrcAddress,
      }}
    >
      {props.children}
    </TransferContext.Provider>
  );
};

export default TransferState;
