import { useReducer, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../auth/AuthContext';

import SellContext from './SellContext';
import SellReducer from './SellReducer';
import {
  SET_SELL_COMPLETED,
  SET_RMB_SELL_RATE,
  SET_ORDER_TOKEN,
  SET_WS_PAIRING,
  SET_WS_DATA,
  SET_PAYMENT,
  CLEAN_ORDER_TOKEN,
  SET_WS_CLIENT,
  SET_CANCEL_ORDER_DATA,
  SET_CONFIRM_SELL,
} from '../type';

// import ReconnectingWebSocket from 'reconnecting-websocket';
import { w3cwebsocket as W3CWebsocket } from 'websocket';

const SellState = props => {
  const initialState = {
    exRate: null,
    buyRate: null,
    transferHandle: null,
    orderToken: null,
    wsPairing: false,
    wsData: null,
    sellData: null,
    closeWs: false,
    loading: false,
    payment: false,
    wsClient: null,
    sellIsCompleted: false,
    cancelData: null,
    confirmSell: false,
    sellCurrentToken: null,
  };

  const history = useHistory();

  const authContext = useContext(AuthContext);
  const { handleHttpError } = authContext;

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('login_session', token);

      return headers;
    } else {
      return;
    }
  };

  const getExRate = async () => {
    const headers = getHeader();

    const exRateApi = `/j/ChkExRate.aspx`;

    try {
      const res = await fetch(exRateApi, {
        headers,
      });

      const resData = await res.json();
      const { data } = resData;

      if (resData.code === 200) {
        setExRateData(data);
      } else {
        handleHttpError(data);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Sell --step 1  (獲取 order token)
  const getOrderToken = async data => {
    const headers = getHeader();
    const getOrderApi = `j/req_sell1.aspx`;

    try {
      const res = await fetch(getOrderApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          AccountNumber: data.account,
          AccountName: data.name,
          BankName: data.bank,
          BankBranch: data.city,
          UsdtAmt: Number(data.usdt),
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        const {
          data: { order_token },
        } = resData;
        // setOrderToken(order_token);
        sellWebSocket(order_token);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // 確認收款 (sell 2)
  const confirmSellAction = async orderToken => {
    if (!orderToken) return;

    const headers = getHeader();

    const sell2Api = `/j/Req_Sell2.aspx`;

    try {
      const res = await fetch(sell2Api, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        // setConfirmSell(true);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // get order detail
  const getOrderDetail = async orderToken => {
    const headers = getHeader();
    const detailApi = `/j/GetTxDetail.aspx`;

    try {
      const res = await fetch(detailApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        // setConfirmSell(true);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // webSocket連接
  const sellWebSocket = orderToken => {
    if (!orderToken) return;

    const loginSession = localStorage.getItem('token');
    if (!loginSession) return;

    const connectWs = 'j/ws_orderstatus.ashx';

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new W3CWebsocket(url);

    setWsClient(client);

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected sell');
    };

    // 2.收到server回復
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);

      // 配對中 Order_StatusID：31 or 32
      if (dataFromServer.data.Order_StatusID === 31) {
        setWsData(dataFromServer.data);
      }

      // 等待付款  Order_StatusID：33
      if (dataFromServer.data.Order_StatusID === 33) {
        setWsData(dataFromServer.data);
        setWsPairing(false);
        history.replace(`/home/transaction/sell/${orderToken}`);
      }

      // 等待收款 Order_StatusID：34
      if (dataFromServer.data.Order_StatusID === 34) {
        setWsData(dataFromServer.data);
        setPayment(true); // 開啟確認收款button
      }

      // 交易成功 Order_StatusID：1
      if (dataFromServer.data.Order_StatusID === 1) {
        // dispatch({ type: SET_SELL_COMPLETED, payload: true });
        setWsData(dataFromServer.data);
        setCompleteStatus(true);

        client.close();
      }
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      console.log('關閉連線.....', message);
    };
  };

  // 關閉webSocket
  const closeWebSocket = orderToken => {
    if (state.client) {
      state.client.close();
    }

    if (!orderToken) return;

    const loginSession = localStorage.getItem('token');
    if (!loginSession) return;

    const connectWs = 'j/ws_orderstatus.ashx';

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new W3CWebsocket(url);

    client.close();
  };

  // 關閉Web Socket
  // const closeWebSocket = () => {
  //   if (state.buyWsClient) {
  //     state.buyWsClient.close();
  //   } else {
  //     console.log('沒有webSocket Client');
  //   }
  // };

  // 取消訂單
  const cancelOrder = async orderToken => {
    const headers = getHeader();
    const cancelApi = `/j/Req_CancelOrder.aspx`;

    try {
      const res = await fetch(cancelApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();
      handleHttpError(resData);

      dispatch({ type: SET_CANCEL_ORDER_DATA, payload: resData });

      if (resData.code === 200) {
        alert('訂單已經取消');
        history.replace('/home/overview');
      } else {
        alert(`${resData.msg}, 訂單取消失敗`);
      }
    } catch (error) {
      alert(error);
    }
  };

  // 清除Order Token
  const cleanOrderToken = () => {
    dispatch({ type: CLEAN_ORDER_TOKEN });
  };

  // Set ExRate Data
  const setExRateData = data => {
    dispatch({ type: SET_RMB_SELL_RATE, payload: data });
  };

  // Set Order Token
  const setOrderToken = token => {
    dispatch({ type: SET_ORDER_TOKEN, payload: token });
  };

  // Set Web Socket Client
  const setWsClient = value => {
    dispatch({ type: SET_WS_CLIENT, payload: value });
  };

  // Set wsPairing
  const setWsPairing = value => {
    dispatch({ type: SET_WS_PAIRING, payload: value });
  };

  // Set WsData
  const setWsData = data => {
    dispatch({ type: SET_WS_DATA, payload: data });
  };

  // Set Payment (買方完成付款後為true)
  const setPayment = value => {
    dispatch({ type: SET_PAYMENT, payload: value });
  };
  // Set Confirm Sell (判斷是否要進入complete)
  const setConfirmSell = value => {
    dispatch({ type: SET_CONFIRM_SELL, payload: value });
  };

  // Set Complete status
  const setCompleteStatus = value => {
    dispatch({ type: SET_SELL_COMPLETED, payload: value });
  };

  // Clean All
  const CleanAll = () => {
    if (state.wsClient) state.wsClient.close();
    setConfirmSell(false);
    setWsPairing(false);
    setWsData(null);
    setPayment(false);
    setCompleteStatus(false);
    setWsClient(null);
  };

  // useReducer
  const [state, dispatch] = useReducer(SellReducer, initialState);

  return (
    <SellContext.Provider
      value={{
        exRate: state.exRate, // 賣出匯率
        buyRate: state.buyRate, // 買進匯率
        transferHandle: state.transferHandle,
        orderToken: state.orderToken,
        wsPairing: state.wsPairing,
        wsData: state.wsData,
        loading: state.loading,
        payment: state.payment, // 買方是否完成付款
        sellIsCompleted: state.sellIsCompleted,
        closeWs: state.closeWs,
        cancelData: state.cancelData, // 取消的訂單數據
        confirmSell: state.confirmSell, // 判斷是否應該進入 "提交確認/交易完成" 組件
        wsClient: state.wsClient,

        getExRate,
        getOrderToken,
        sellWebSocket,
        closeWebSocket,
        cancelOrder,
        cleanOrderToken,
        setWsPairing,
        confirmSellAction,
        getOrderDetail,
        CleanAll,
        setConfirmSell,
      }}
    >
      {props.children}
    </SellContext.Provider>
  );
};

export default SellState;
