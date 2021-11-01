import { useReducer, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import SellContext from './SellContext';
import SellReducer from './SellReducer';

// Context
import HttpErrorContext from '../httpError/HttpErrorContext';
import BalanceContext from '../../context/balance/BalanceContext';

// Lang Context
import { useI18n } from '../../lang';

import {
  SET_SELL_COMPLETED,
  SET_RMB_SELL_RATE,
  SET_ORDER_TOKEN,
  SET_WS_PAIRING,
  SET_WS_DATA,
  CLEAN_ORDER_TOKEN,
  SET_WS_CLIENT,
  SET_CANCEL_ORDER_DATA,
  SET_CONFIRM_SELL,
  SET_SELL_STATUS,
  SET_RATE_DATA,
  SET_TRANSFER_HANDLE,
  SET_SELL_COUNT,
  SET_SHOW_SELL_BANK,
} from '../type';

// import ReconnectingWebSocket from 'reconnecting-websocket';
import { w3cwebsocket as W3CWebsocket } from 'websocket';

const SellState = props => {
  // Lang Context
  const { t } = useI18n();

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
    wsClient: null,
    sellIsCompleted: false,
    cancelData: null,
    confirmSell: false,
    sellCurrentToken: null,
    sellStatus: null,
    rateAllData: null,
    sellCount: null,
    showBank: false,
  };

  // Router Props
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { handleHttpError, setHttpLoading } = httpErrorContext;

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance } = balanceContext;

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      history.replace('/auth/login');
      return;
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    return headers;
  };

  const getExRate = async () => {
    const headers = getHeader();
    if (!headers) {
      history.replace('/auth/login');
      return;
    }

    const exRateApi = `/j/ChkExRate.aspx`;

    try {
      const res = await fetch(exRateApi, {
        headers,
      });

      const resData = await res.json();
      const { data } = resData;

      if (resData.code === 200) {
        setExRateData(data);
        setRateAllData(data);
      } else {
        handleHttpError(data);
      }
    } catch (error) {
      alert(error);
      handleHttpError(error);
    }
  };

  // Sell --step 1  (獲取 order token)
  const getOrderToken = async data => {
    const headers = getHeader();

    if (!headers) {
      history.replace('/auth/login');
      return;
    }

    if (!data) return;

    const getOrderApi = `/j/req_sell1.aspx`;

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

      console.log(resData, 'req_sell1');

      if (resData.code === 200) {
        const {
          data: { order_token },
        } = resData;
        setOrderToken(order_token);
        sellWebSocket(order_token);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // 確認收款 (sell 2)
  const confirmSellAction = async orderToken => {
    const headers = getHeader();

    if (!orderToken || !headers) return;

    setHttpLoading(true);

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
      handleHttpError(error);
    }

    setHttpLoading(false);
  };

  // get order detail
  const getOrderDetail = async orderToken => {
    const headers = getHeader();

    if (!orderToken || !headers) return;

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
      handleHttpError(error);
    }
  };

  // webSocket連接
  const sellWebSocket = orderToken => {
    const loginSession = localStorage.getItem('token');

    if (!orderToken || !loginSession) return;

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
      // console.log('websocket client connected sell');
    };

    // 2.收到server回復
    client.onmessage = message => {
      if (!message.data) return;
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);
      setSellStatus(dataFromServer.data.Order_StatusID);

      // 配對中 Order_StatusID：31 or 32
      if (dataFromServer.data.Order_StatusID === 31) {
        setWsData(dataFromServer.data);
        setWsPairing(true);
      }

      // 等待付款  Order_StatusID：33
      if (dataFromServer.data.Order_StatusID === 33) {
        setWsData(dataFromServer.data);
        setWsPairing(false);
        console.log(dataFromServer, '=====');
        // history.replace(`/home/transaction/sell/${orderToken}`);
      }

      // 等待收款 Order_StatusID：34
      if (dataFromServer.data.Order_StatusID === 34) {
        setWsData(dataFromServer.data);
      }

      // 交易成功 Order_StatusID：1
      if (dataFromServer.data.Order_StatusID === 1) {
        getBalance();
        // dispatch({ type: SET_SELL_COMPLETED, payload: true });
        setWsData(dataFromServer.data);
        setCompleteStatus(true);

        client.close();
      }

      // 交易失敗
      if (dataFromServer.data.Order_StatusID === 99 || dataFromServer.data.Order_StatusID === 98) {
        client.close();
      }
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      // console.log('關閉連線.....', message);
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

  // 取消訂單
  const cancelOrder = async orderToken => {
    const headers = getHeader();

    if (!orderToken || !headers) return;

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

      console.log(resData);

      dispatch({ type: SET_CANCEL_ORDER_DATA, payload: resData });

      if (resData.code === 200) {
        // alert('訂單已經取消');
        history.replace('/home/overview');
      } else {
        alert(t('cancel_fail'));
      }
    } catch (error) {
      handleHttpError(error);
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

  // Set Confirm Sell (判斷是否要進入complete)
  const setConfirmSell = value => {
    dispatch({ type: SET_CONFIRM_SELL, payload: value });
  };

  // Set Complete status
  const setCompleteStatus = value => {
    dispatch({ type: SET_SELL_COMPLETED, payload: value });
  };

  // Set Sell Status
  const setSellStatus = value => {
    dispatch({ type: SET_SELL_STATUS, payload: value });
  };

  // Set Rate All Data
  const setRateAllData = data => {
    dispatch({ type: SET_RATE_DATA, payload: data });
  };

  // Set Transfer Handle
  const setTransferHandle = num => {
    dispatch({ type: SET_TRANSFER_HANDLE, payload: num });
  };

  // Set Sell Count
  const setSellCount = data => {
    dispatch({ type: SET_SELL_COUNT, payload: data });
  };

  // Set Show Bank
  const setShowBank = value => {
    dispatch({ type: SET_SHOW_SELL_BANK, payload: value });
  };

  // Clean All
  const cleanAll = () => {
    if (state.wsClient) state.wsClient.close();
    setConfirmSell(false);
    setWsPairing(false);
    setCompleteStatus(false);
    setSellStatus(null);
    setRateAllData(null);
    setTransferHandle(null);
    setShowBank(false);
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
        sellIsCompleted: state.sellIsCompleted,
        closeWs: state.closeWs,
        cancelData: state.cancelData, // 取消的訂單數據
        confirmSell: state.confirmSell, // 判斷是否應該進入 "提交確認/交易完成" 組件
        wsClient: state.wsClient,
        sellStatus: state.sellStatus,
        rateAllData: state.rateAllData,
        sellCount: state.sellCount,
        showBank: state.showBank,

        getExRate,
        getOrderToken,
        sellWebSocket,
        closeWebSocket,
        cancelOrder,
        cleanOrderToken,
        setWsPairing,
        confirmSellAction,
        getOrderDetail,
        cleanAll,
        setConfirmSell,
        setTransferHandle,
        setSellCount,
        setShowBank,
      }}
    >
      {props.children}
    </SellContext.Provider>
  );
};

export default SellState;
