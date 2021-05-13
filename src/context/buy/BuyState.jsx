import { useReducer, useContext } from 'react';
import { useHistory } from 'react-router-dom';
// import ReconnectingWebSocket from 'reconnecting-websocket';
import { w3cwebsocket as W3CWebsocket } from 'websocket';

import BuyReducer from './BuyReducer';
import BuyContext from './BuyContext';

import HttpErrorContext from '../httpError/HttpErrorContext';

import {
  BUY_BTN_LOADING,
  SET_BUY_COUNT,
  SET_BUY_ERROR_TEXT,
  SET_BUY_ORDER_TOKEN,
  SET_BUY_WS_STATUS,
  HANDLE_PAIRING,
  SET_SHOW_BANK,
  SET_BUY_WS_CLIENT,
  SET_BUY_WS_DATA,
  SET_DELTA_TIME,
  HIDE_BUY_INFO,
} from '../type';

const BuyState = props => {
  // Router Props
  const history = useHistory();

  // http error context
  const httpErrorContext = useContext(HttpErrorContext);
  const { handleHttpError, setHttpError } = httpErrorContext;

  // Init State
  const initialState = {
    buyBtnLoading: false,
    buyCount: {
      usdt: '',
      rmb: '',
    },
    buyErrorText: '',
    buyOrderToken: '',
    wsStatus: null,
    buyPairing: false,
    showBank: false,
    buyWsClient: null,
    buyWsData: null,
    deltaTime: null,
    isHideBuyInfo: false,
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem('token');

    if (!token) return;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    return headers;
  };

  // 確認購買，獲得Order Token--step 1
  const confirmBuy = async accountName => {
    handleBuyBtnLoading(true);
    const { usdt } = state.buyCount;
    const headers = getHeader();

    try {
      const reqBuyApi = `/j/Req_Buy1.aspx`;
      const res = await fetch(reqBuyApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ClientName: accountName,
          UsdtAmt: usdt,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setHttpError('');
        setOrderToken(resData.data.order_token);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
      handleBuyBtnLoading(false);
    }
  };

  //連接web socket --step 2
  const buyConnectWs = token => {
    // 自動重連次數
    // const options = {
    //     maxRetries: null,
    // };
    const transactionApi = 'j/ws_orderstatus.ashx';

    let loginSession = localStorage.getItem('token');

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
    }

    const client = new W3CWebsocket(url);

    if (client) setWsClient(client);

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected buy');
    };

    // 2.收到server回復
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      // console.log('got reply!', dataFromServer);
      setWsStatus(dataFromServer.data.Order_StatusID);
      setDeltaTime(dataFromServer.data.DeltaTime);

      // 配對中
      if (dataFromServer.data.Order_StatusID === 31) {
        handlePairing(true);

        const data = {
          usdt: dataFromServer.data.UsdtAmt,
          rmb: dataFromServer.data.D2,
        };
        setBuyCount(data);
        handleBuyBtnLoading(false);
      }

      // 等待付款
      if (dataFromServer.data.Order_StatusID === 33) {
        const wsData = {
          cny: dataFromServer.data.D2,
          name: dataFromServer.data.P2,
          account: dataFromServer.data.P1,
          bank: dataFromServer.data.P3,
          city: dataFromServer.data.P4,
          usdt: dataFromServer.data.UsdtAmt,
          hash: dataFromServer.data.Tx_HASH,
        };

        setWsData(wsData);

        // history.replace(`/home/transaction/buy/${state.buyOrderToken}`);
      }

      // 收款確認
      if (dataFromServer.data.Order_StatusID === 34) {
        const wsData = {
          cny: dataFromServer.data.D2,
          name: dataFromServer.data.P2,
          account: dataFromServer.data.P1,
          bank: dataFromServer.data.P3,
          city: dataFromServer.data.P4,
          usdt: dataFromServer.data.UsdtAmt,
          hash: dataFromServer.data.Tx_HASH,
        };

        setWsData(wsData);
        handleBuyBtnLoading(false);
      }

      // 交易完成
      if (dataFromServer.data.Order_StatusID === 1) {
        const wsData = {
          cny: dataFromServer.data.D2,
          name: dataFromServer.data.P2,
          account: dataFromServer.data.P1,
          bank: dataFromServer.data.P3,
          city: dataFromServer.data.P4,
          usdt: dataFromServer.data.UsdtAmt,
          hash: dataFromServer.data.Tx_HASH,
        };
        setWsData(wsData);
        client.close();
      }
    };

    //3. 連線關閉
    client.onclose = () => {
      console.log('關閉連線');
    };
  };

  // 關閉Web Socket
  const closeWebSocket = () => {
    if (state.buyWsClient) {
      state.buyWsClient.close();
    } else {
      console.log('沒有webSocket Client');
    }
  };

  // Buy2 --step 3
  const BuyerAlreadyPay = async orderToken => {
    handleBuyBtnLoading(true);
    cleanErr();

    const headers = getHeader();

    try {
      const reqBuy2Api = `/j/Req_Buy2.aspx`;
      const res = await fetch(reqBuy2Api, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();
      if (resData.code === 200) {
        console.log(resData);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
      handleBuyBtnLoading(false);
    }
  };

  // Get And Set DeltaTime
  const GetDeltaTime = async orderToken => {
    const headers = getHeader();
    const getDetailApi = `/j/GetTxDetail.aspx`;

    try {
      const res = await fetch(getDetailApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setDeltaTime(resData.data.DeltaTime);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // 取消訂單
  const cancelOrder = async orderToken => {
    const headers = getHeader();
    const cancelApi = `/j/Req_CancelOrder.aspx`;
    console.log(orderToken);
    try {
      const res = await fetch(cancelApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        alert('訂單已經取消');
      } else {
        alert(`訂單取消失敗`);
        history.replace('/home/overview');
      }
    } catch (error) {
      alert(error);
      history.replace('/home/overview');
    }
  };

  // 設定購買數量
  const setBuyCount = data => {
    dispatch({ type: SET_BUY_COUNT, payload: data });
  };

  // Set Error Text
  const setErrorText = text => {
    dispatch({ type: SET_BUY_ERROR_TEXT, payload: text });
  };

  // Handle Buy Btn Loading
  const handleBuyBtnLoading = value => {
    dispatch({ type: BUY_BTN_LOADING, payload: value });
  };

  // Set Order Token
  const setOrderToken = token => {
    dispatch({ type: SET_BUY_ORDER_TOKEN, payload: token });
  };

  // Set Web Socket Status
  const setWsStatus = value => {
    dispatch({ type: SET_BUY_WS_STATUS, payload: value });
  };

  // Handle Pairing
  const handlePairing = value => {
    dispatch({ type: HANDLE_PAIRING, payload: value });
  };

  // Set Show Bank
  const setShowBank = value => {
    dispatch({ type: SET_SHOW_BANK, payload: value });
  };

  // Set Web Socket Client
  const setWsClient = client => {
    dispatch({ type: SET_BUY_WS_CLIENT, payload: client });
  };

  // Set Buy Web Socket Res Data
  const setWsData = data => {
    dispatch({ type: SET_BUY_WS_DATA, payload: data });
  };

  // Set Delta Time
  const setDeltaTime = num => {
    dispatch({ type: SET_DELTA_TIME, payload: num });
  };

  // Set Hide Buy Info
  const setHideBuyInfo = value => {
    dispatch({ type: HIDE_BUY_INFO, payload: value });
  };

  /*
   ** 1.關閉web socket
   ** 2.清除order token
   ** 3.show bank設為false
   ** 4.web socket status設為null
   ** 5.pairing modal 設為false
   ** 6.清除web socket data
   ** 7.購買數量清除，設為空字串
   */
  const cleanAll = () => {
    handleBuyBtnLoading(false);
    closeWebSocket();
    setOrderToken('');
    setShowBank(false);
    setWsStatus(null);
    handlePairing(false);
    setWsData({});
    setWsStatus(null);
    setWsClient(null);
    setBuyCount({
      rmb: '',
      usdt: '',
    });
  };

  const cleanErr = () => {
    setHttpError('');
    setErrorText('');
  };

  const [state, dispatch] = useReducer(BuyReducer, initialState);

  return (
    <BuyContext.Provider
      value={{
        buyBtnLoading: state.buyBtnLoading,
        buyCount: state.buyCount,
        buyErrorText: state.buyErrorText,
        buyOrderToken: state.buyOrderToken,
        wsStatus: state.wsStatus,
        buyPairing: state.buyPairing,
        showBank: state.showBank,
        buyWsClient: state.buyWsClient,
        buyWsData: state.buyWsData,
        deltaTime: state.deltaTime,
        isHideBuyInfo: state.isHideBuyInfo,

        handleBuyBtnLoading,
        setBuyCount,
        setErrorText,
        confirmBuy,
        buyConnectWs,
        handlePairing,
        setShowBank,
        closeWebSocket,
        setOrderToken,
        setWsStatus,
        cleanAll,
        BuyerAlreadyPay,
        cleanErr,
        setHideBuyInfo,
        setDeltaTime,
        cancelOrder,
        GetDeltaTime,
      }}
    >
      {props.children}
    </BuyContext.Provider>
  );
};

export default BuyState;
