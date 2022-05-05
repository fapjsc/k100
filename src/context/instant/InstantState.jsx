import { useReducer, useContext } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
// import { w3cwebsocket as W3CWebsocket } from "websocket";
import InstantReducer from "./InstantReducer";
import InstantContext from "./InstantContext";

import store from "../../store/store";

// Acitons
import { setOrderStatus } from "../../store/actions/orderActions";
// Context
import HttpErrorContext from "../../context/httpError/HttpErrorContext";
import BalanceContext from "../../context/balance/BalanceContext";

import {
  SET_INSTANT_WS_DATA,
  // CLEAN_INSTANT_DATA,
  SET_SELL1_DATA,
  SET_COUNT_DATA,
  INSTANT_ALL_WS_CLIENT,
  INSTANT_ON_GOING_WS_CLIENT,
  SET_BUY1_DATA,
  SET_WS_STATUS_DATA,
  SET_STATUS_WS_CLIENT,
  SET_INSTANT_ONGOING_DATA,
  SET_ACTION_TYPE,
  ORDER_NOT_EXISTS,
  SET_PAYMENT_NAME,
} from "../type";

const InstantState = (props) => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { handleHttpError, setHttpLoading } = httpErrorContext;

  // Balance Context
  const balanceContext = useContext(BalanceContext);
  const { getBalance } = balanceContext;

  // Init State
  const initialState = {
    instantData: [],
    wsOnGoingData: [],
    countData: null,
    sell1Data: null,
    buy1Data: null,
    wsClient: null,
    wsStatusData: null,
    instantAllClient: null,
    instantOnGoingClient: null,
    wsStatusClient: null,
    actionType: "",
    orderExists: true,
    paymentName: "",
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

  // Instant Web Socket連接   --所有的即時交易
  const connectInstantWs = () => {
    setHttpLoading(true);
    const loginSession = localStorage.getItem("token");
    if (!loginSession) return;

    const connectWs = "j/ws_liveorders.ashx";

    let url;

    if (window.location.host.includes("k100u")) {
      url = `wss://${window.location.host}/${connectWs}?login_session=${loginSession}`;
    } else {
      url = `wss://demo.k100u.com/${connectWs}?login_session=${loginSession}`;
    }

    const client = new ReconnectingWebSocket(url);

    setAllClient(client);

    // 1.建立連接
    client.onopen = () => {
      // console.log('websocket client connected instant');
    };

    // 2.收到server回復
    client.onmessage = (message) => {
      if (!message.data) return;
      const dataFromServer = JSON.parse(message?.data);
      console.log("got reply all!", dataFromServer);

      if (dataFromServer.data.length > 0) {
        setInstantData(dataFromServer.data);
      } else {
        setInstantData([]);
      }
      setHttpLoading(false);
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      console.log("關閉連線.....");
    };
  };

  // Instant Ongoing Web Socket Connect  --進行中
  const instantOngoingWsConnect = () => {
    const loginSession = localStorage.getItem("token");
    if (!loginSession) return;

    setHttpLoading(true);
    const connectWs = "j/WS_livePendingOrders.ashx";

    let url;

    if (window.location.host.includes("k100u")) {
      url = `wss://${window.location.host}/${connectWs}?login_session=${loginSession}`;
    } else {
      url = `wss://demo.k100u.com/${connectWs}?login_session=${loginSession}`;
    }

    const client = new ReconnectingWebSocket(url);

    setOnGoingClient(client);

    // 1.建立連接
    client.onopen = () => {
      // console.log('websocket client connected instant on going');
    };

    // 2.收到server回復
    client.onmessage = (message) => {
      // console.log(message);

      if (!message.data) return;
      const dataFromServer = JSON.parse(message?.data);
      console.log('got reply onGoing!', dataFromServer);

      if (dataFromServer.data.length > 0) {
        setOnGoingData(dataFromServer.data);
      } else {
        setOnGoingData([]);
      }
      setHttpLoading(false);
    };

    // 3.錯誤處理
    client.onclose = function (message) {
      // console.log('關閉連線..... onGoing');
    };
  };

  // Status Web Socket  --確認狀態
  const statusWs = (orderToken) => {
    if (!orderToken) return;

    const loginSession = localStorage.getItem("token");
    if (!loginSession) return;

    const connectWs = "j/ws_orderstatus.ashx";

    let url;

    if (!window.location.host.includes("demo")) {
      url = `wss://${window.location.host}/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `wss://demo.k100u.com/${connectWs}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new ReconnectingWebSocket(url);

    if (client) {
      setWsStatusClient(client);

      // 1.建立連接
      client.onopen = () => {
        console.log("websocket client connected instant status");
      };

      // 2.收到server回復
      client.onmessage = (message) => {
        if (!message.data) return;
        const dataFromServer = JSON.parse(message?.data);
        console.log("got reply status!", dataFromServer);

        if (dataFromServer) {
          setWsStatusData(dataFromServer.data.Order_StatusID);
          setPaymentName(dataFromServer.data.P5);
          store.dispatch(setOrderStatus(dataFromServer.data));
        }

        // // 交易成功 Order_StatusID：1
        if (
          dataFromServer.data.Order_StatusID === 1 ||
          dataFromServer.data.Order_StatusID === 99
        ) {
          getBalance();
          client.close();
        }
      };

      // 3. 關閉提示
      client.onclose = function (message) {
        console.log("關閉ws status連線.....");
      };
    }
  };

  // Sell Match --1
  const sellMatch1 = async (token) => {
    const headers = getHeader();
    if (!headers) return;
    setHttpLoading(true);
    try {
      const match1 = `/j/Req_SellMatch1.aspx`;

      const res = await fetch(match1, {
        method: "POST",
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();

      // console.log(resData, 'sell1');

      if (resData.code === "16") {
        setOrderExists(false);
        return;
      }

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

  // Sell Match --2
  const sellMatch2 = async (token) => {
    const headers = getHeader();
    if (!headers) return;
    setHttpLoading(true);
    try {
      const match2 = `/j/Req_SellMatch2.aspx`;

      const res = await fetch(match2, {
        method: "POST",
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
  const buyMatch1 = async (token) => {
    const headers = getHeader();
    if (!headers) return;
    setHttpLoading(true);
    try {
      const match1 = `/j/Req_BuyMatch1.aspx`;

      const res = await fetch(match1, {
        method: "POST",
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();
      // console.log(resData, 'buy1');

      if (resData.code === "16") {
        setOrderExists(false);
        return;
      }

      if (resData.code === 200) {
        setBuy1Data(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }

    setHttpLoading(false);
  };

  // Buy Match --2
  const buyMatch2 = async (token) => {
    const headers = getHeader();
    setHttpLoading(true);
    try {
      const match2 = `/j/Req_BuyMatch2.aspx`;

      const res = await fetch(match2, {
        method: "POST",
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
      handleHttpError(error);
    }
    setHttpLoading(false);
  };

  // Set Instant Data
  const setInstantData = (data) => {
    dispatch({ type: SET_INSTANT_WS_DATA, payload: data });
  };

  // Clean Instant Data
  // const cleanInstantData = () => {
  //   dispatch({ type: CLEAN_INSTANT_DATA });
  // };

  // Set Count Data
  const setCountData = (data) => {
    if (!data) return;
    dispatch({ type: SET_COUNT_DATA, payload: data });
  };

  // Set Sell--1 Data
  const setSell1Data = (data) => {
    dispatch({ type: SET_SELL1_DATA, payload: data });
  };

  // Set Buy --1 Data
  const setBuy1Data = (data) => {
    dispatch({ type: SET_BUY1_DATA, payload: data });
  };

  // Set Web Socket Client -- Instant All
  const setAllClient = (value) => {
    dispatch({ type: INSTANT_ALL_WS_CLIENT, payload: value });
  };

  // Set Web Socket Client -- Instant On Going
  const setOnGoingClient = (value) => {
    dispatch({ type: INSTANT_ON_GOING_WS_CLIENT, payload: value });
  };

  // Set Web Socket Client  --Status
  const setWsStatusClient = (client) => {
    dispatch({ type: SET_STATUS_WS_CLIENT, payload: client });
  };

  // Set Ws Status Data
  const setWsStatusData = (data) => {
    dispatch({ type: SET_WS_STATUS_DATA, payload: data });
  };

  // Set Ws On Going Data
  const setOnGoingData = (data) => {
    dispatch({ type: SET_INSTANT_ONGOING_DATA, payload: data });
  };

  // Set Action Type
  const setActionType = (type) => {
    dispatch({ type: SET_ACTION_TYPE, payload: type });
  };

  // Set Order Exists
  const setOrderExists = (value) => {
    dispatch({ type: ORDER_NOT_EXISTS, payload: value });
  };

  // Set Payment Name
  const setPaymentName = (name) => {
    dispatch({ type: SET_PAYMENT_NAME, payload: name });
  };

  // Clean All
  const cleanAll = () => {
    setWsStatusData(null);
    setBuy1Data(null);
    setSell1Data(null);
    setCountData(null);
    setPaymentName("");
  };

  const [state, dispatch] = useReducer(InstantReducer, initialState);

  return (
    <InstantContext.Provider
      value={{
        instantData: state.instantData,
        sell1Data: state.sell1Data,
        countData: state.countData,
        buy1Data: state.buy1Data,
        instantAllClient: state.instantAllClient,
        instantOnGoingClient: state.instantOnGoingClient,
        wsStatusClient: state.wsStatusClient,
        wsStatusData: state.wsStatusData,
        wsOnGoingData: state.wsOnGoingData,
        actionType: state.actionType,
        orderExists: state.orderExists,
        paymentName: state.paymentName,

        connectInstantWs, // 所有的instant web socket
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
        instantOngoingWsConnect, // 進行中的web socket
        setActionType,
        setWsStatusClient,
        setOrderExists, // 訂單是否存在
      }}
    >
      {props.children}
    </InstantContext.Provider>
  );
};

export default InstantState;
