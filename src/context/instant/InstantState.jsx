import { useReducer, useContext } from 'react';
// import ReconnectingWebSocket from 'reconnecting-websocket';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import InstantReducer from './InstantReducer';
import InstantContext from './InstantContext';

// Http Error Context
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

import {
  SET_INSTANT_WS_DATA,
  CLEAN_INSTANT_DATA,
  SET_SELL1_DATA,
  SET_COUNT_DATA,
  INSTANT_SET_WS_CLIENT,
  SET_BUY1_DATA,
  SET_WS_STATUS_DATA,
  SET_STATUS_WS_CLIENT,
  SET_INSTANT_ONGOING_DATA,
} from '../type';

const InstantState = props => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { handleHttpError, setHttpLoading } = httpErrorContext;

  const initialState = {
    instantData: [],
    countData: null,
    sell1Data: null,
    buy1Data: null,
    wsClient: null,
    wsStatusData: null,
    wsStatusClient: null,
    wsOnGoingData: null,
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

  // Instant Web Socket連接
  const connectInstantWs = () => {
    setHttpLoading(true);
    const loginSession = localStorage.getItem('token');
    if (!loginSession) return;

    const connectWs = 'j/ws_liveorders.ashx';

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}`;
    }

    const client = new W3CWebsocket(url);

    setWsClient(client);

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected instant');
    };

    // 2.收到server回復
    client.onmessage = message => {
      if (!message.data) return;
      const dataFromServer = JSON.parse(message.data);
      // console.log('got reply!', dataFromServer);

      if (dataFromServer.data.length > 0) {
        setInstantData(dataFromServer.data);
      } else {
        cleanInstantData();
      }
      setHttpLoading(false);
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      // console.log('關閉連線.....');
    };
  };

  // Instant Ongoing Web Socket Connect
  const instantOngoingWsConnect = () => {
    setHttpLoading(true);
    const loginSession = localStorage.getItem('token');
    if (!loginSession) return;

    const connectWs = 'j/WS_livePendingOrders.ashx';

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}`;
    }

    const client = new W3CWebsocket(url);

    setWsClient(client);

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected instant on going');
    };

    // 2.收到server回復
    client.onmessage = message => {
      if (!message.data) return;
      const dataFromServer = JSON.parse(message.data);
      // console.log('got reply!', dataFromServer);

      if (dataFromServer.data.length > 0) {
        setOnGoingData(dataFromServer.data);
      } else {
        setOnGoingData(null);
      }
      setHttpLoading(false);
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      // console.log('關閉連線.....');
    };
  };

  // Status Web Socket
  const statusWs = orderToken => {
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

    if (client) {
      setWsStatusClient(client);

      // 1.建立連接
      client.onopen = () => {
        console.log('websocket client connected instant status');
      };

      // 2.收到server回復
      client.onmessage = message => {
        if (!message.data) return;
        const dataFromServer = JSON.parse(message.data);
        // console.log('got reply!', dataFromServer);

        if (dataFromServer) setWsStatusData(dataFromServer.data.Order_StatusID);

        // // 交易成功 Order_StatusID：1
        if (dataFromServer.data.Order_StatusID === 1) {
          client.close();
        }
      };

      // 3.錯誤處理
      client.onclose = function (message) {
        console.log('關閉連線.....');
      };
    }
  };

  // Sell Match --1
  const sellMatch1 = async token => {
    const headers = getHeader();
    if (!headers) return;
    try {
      const match1 = `j/Req_SellMatch1.aspx`;

      const res = await fetch(match1, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setSell1Data(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Sell Match --2
  const sellMatch2 = async token => {
    const headers = getHeader();
    if (!headers) return;
    setHttpLoading(true);
    try {
      const match2 = `j/Req_SellMatch2.aspx`;

      const res = await fetch(match2, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setSell1Data(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
    setHttpLoading(false);
  };

  // Buy Match --1
  const buyMatch1 = async token => {
    const headers = getHeader();
    if (!headers) return;
    try {
      const match1 = `j/Req_BuyMatch1.aspx`;

      const res = await fetch(match1, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setBuy1Data(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Buy Match --2
  const buyMatch2 = async token => {
    const headers = getHeader();
    setHttpLoading(true);
    try {
      const match2 = `j/Req_BuyMatch2.aspx`;

      const res = await fetch(match2, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();
      if (resData.code === 200) {
        setBuy1Data(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
    setHttpLoading(false);
  };

  // Set Instant Data
  const setInstantData = data => {
    dispatch({ type: SET_INSTANT_WS_DATA, payload: data });
  };

  // Clean Instant Data
  const cleanInstantData = () => {
    dispatch({ type: CLEAN_INSTANT_DATA });
  };

  // Set Count Data
  const setCountData = data => {
    if (!data) return;
    dispatch({ type: SET_COUNT_DATA, payload: data });
  };

  // Set Sell--1 Data
  const setSell1Data = data => {
    dispatch({ type: SET_SELL1_DATA, payload: data });
  };

  // Set Buy --1 Data
  const setBuy1Data = data => {
    dispatch({ type: SET_BUY1_DATA, payload: data });
  };

  // Set Web Socket Client
  const setWsClient = value => {
    dispatch({ type: INSTANT_SET_WS_CLIENT, payload: value });
  };

  // Set Ws Status Data
  const setWsStatusData = data => {
    dispatch({ type: SET_WS_STATUS_DATA, payload: data });
  };

  // Set Web Socket Client
  const setWsStatusClient = client => {
    dispatch({ type: SET_STATUS_WS_CLIENT, payload: client });
  };

  // Set Ws On Going Data
  const setOnGoingData = data => {
    dispatch({ type: SET_INSTANT_ONGOING_DATA, payload: data });
  };

  // Clean All
  const cleanAll = () => {
    setWsStatusData(null);
    setBuy1Data(null);
    setSell1Data(null);
    setCountData(null);
    if (state.wsStatusClient) state.wsStatusClient.close();
    if (state.wsClient) state.wsClient.close();
    setWsStatusClient(null);
    setWsClient(null);
  };

  const [state, dispatch] = useReducer(InstantReducer, initialState);

  return (
    <InstantContext.Provider
      value={{
        instantData: state.instantData,
        sell1Data: state.sell1Data,
        countData: state.countData,
        buy1Data: state.buy1Data,
        wsClient: state.wsClient,
        wsStatusData: state.wsStatusData,
        wsStatusClient: state.wsStatusClient,
        wsOnGoingData: state.wsOnGoingData,

        connectInstantWs,
        sellMatch1,
        sellMatch2,
        setCountData,
        setSell1Data,
        buyMatch1,
        buyMatch2,
        setBuy1Data,
        statusWs,
        setWsStatusData,
        cleanAll,
        instantOngoingWsConnect,
      }}
    >
      {props.children}
    </InstantContext.Provider>
  );
};

export default InstantState;
