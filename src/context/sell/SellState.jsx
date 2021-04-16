import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

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

import ReconnectingWebSocket from 'reconnecting-websocket';

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
  };

  const history = useHistory();

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

  // 獲取匯率以及手續費
  /*
        code: 200
        data:
        RMB_BUY: "6.52"
        RMB_SELL: "6.42"
        TransferHandle: "8"
        __proto__: Object
        msg: "success"
    */
  const getExRate = async () => {
    const headers = getHeader();

    const exRateApi = `/j/ChkExRate.aspx`;

    try {
      const res = await fetch(exRateApi, {
        headers,
      });

      const resData = await res.json();

      const { data } = resData;

      dispatch({ type: SET_RMB_SELL_RATE, payload: data });
    } catch (error) {
      alert(error, 'getExRate');
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
        dispatch({ type: SET_WS_DATA, payload: resData.data });
      } else {
        alert(resData.msg);
      }
    } catch (error) {
      alert(error);
    }
  };

  // 獲取 order token
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

      const {
        data: { order_token },
      } = resData;

      dispatch({ type: SET_ORDER_TOKEN, payload: order_token });
    } catch (error) {
      alert('error');
    }
  };

  // Set wsPairing
  const setWsPairing = value => {
    dispatch({ type: SET_WS_PAIRING, payload: value });
  };

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
      dispatch({ type: SET_CANCEL_ORDER_DATA, payload: resData });

      // console.log(resData);

      if (resData.code === 200) {
        alert('訂單已經取消');
        history.replace('/home/transaction/sell');
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
        dispatch({ type: SET_CONFIRM_SELL, payload: true });
      } else {
        alert('error', resData.msg);
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

    const client = new ReconnectingWebSocket(url);

    dispatch({ type: SET_WS_CLIENT, payload: client });

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
        dispatch({ type: SET_WS_DATA, payload: dataFromServer.data });
        console.log(dataFromServer);
      }

      // 等待付款  Order_StatusID：33
      if (dataFromServer.data.Order_StatusID === 33) {
        dispatch({ type: SET_WS_DATA, payload: dataFromServer.data });
        dispatch({ type: SET_WS_PAIRING, payload: false });

        history.replace(`/home/transaction/sell/${orderToken}`);
      }

      // 等待收款 Order_StatusID：34
      if (dataFromServer.data.Order_StatusID === 34) {
        dispatch({ type: SET_WS_DATA, payload: dataFromServer.data });
        dispatch({ type: SET_PAYMENT, payload: true });
      }

      // 交易成功 Order_StatusID：1
      if (dataFromServer.data.Order_StatusID === 1) {
        dispatch({ type: SET_SELL_COMPLETED, payload: true });
      }
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      // console.log('關閉連線.....');
    };
  };

  // 關閉webSocket
  const closeWebSocket = () => {
    if (state.wsClient) {
      state.wsClient.close();
    } else {
    }
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

        getExRate,
        getOrderToken,
        sellWebSocket,
        closeWebSocket,
        cancelOrder,
        cleanOrderToken,
        setWsPairing,
        confirmSellAction,
        getOrderDetail,
      }}
    >
      {props.children}
    </SellContext.Provider>
  );
};

export default SellState;
