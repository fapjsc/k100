import { useReducer } from 'react';

import TransferContext from './TransferContext';
import TransferReducer from './TransferReducer';
import {
  SET_TRANSFER_ORDER_TOKEN,
  SET_TRANSFER_STATUS,
  SET_USDT_COUNT,
  SET_ORDER_DETAIL,
  GET_WS_CLIENT,
  HANDLE_BTN_LOADING,
} from '../type';

import ReconnectingWebSocket from 'reconnecting-websocket';

const TransferState = props => {
  const initialState = {
    transferOrderToken: null,
    transferStatus: null,
    usdtCount: null,
    orderDetail: null,
    handleBtnLoading: false,
  };

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

  // webSocket連接
  const transferWebSocket = orderToken => {
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

    dispatch({ type: GET_WS_CLIENT, payload: client });

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket transfer connected sell');
    };

    // 2.收到server回復
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);
      dispatch({ type: SET_TRANSFER_STATUS, payload: dataFromServer.data.Order_StatusID });
      setUsdtCount(null);
    };

    // 3.錯誤處理
    client.onclose = message => {
      console.log('關閉連線.....');
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

  // send transfer req
  const sendTransferReq = async (transferAddress, transferCount) => {
    const headers = getHeader();
    const transferApi = '/j/Req_Transfer1.aspx';
    try {
      const res = await fetch(transferApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ToAddress: transferAddress.val,
          UsdtAmt: transferCount.val,
        }),
      });
      const resData = await res.json();
      console.log(resData);
      if (resData.code === 200) {
        setOrderToken(resData.data.order_token);
        detailReq(resData.data.order_token);
      } else {
        handleHttpError(resData);
        setHandleBtnLoading(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  // get detail
  const detailReq = async orderToken => {
    if (!orderToken) {
      return;
    }
    const headers = getHeader();
    const detailApi = '/j/GetTxDetail.aspx';
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
        setUsdtCount(Math.abs(resData.data.UsdtAmt));
        dispatch({ type: SET_ORDER_DETAIL, payload: resData.data });
      } else {
        handleHttpError(resData);
        setHandleBtnLoading(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  // clean status
  const cleanStatus = () => {
    dispatch({ type: SET_TRANSFER_STATUS, payload: null });
  };

  // handle btn loading
  const setHandleBtnLoading = value => {
    dispatch({ type: HANDLE_BTN_LOADING, payload: value });
  };

  // set usdt count
  const setUsdtCount = value => {
    dispatch({ type: SET_USDT_COUNT, payload: value });
  };

  // set order token
  const setOrderToken = value => {
    dispatch({ type: SET_TRANSFER_ORDER_TOKEN, payload: value });
  };

  const handleHttpError = data => {
    if (data.code === '1') {
      alert('系統錯誤');
      return;
    }

    if (data.code === '10') {
      alert('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      alert('此帳號已經註冊過');
      return;
    }

    if (data.code === '12') {
      alert('此帳號無法註冊，可能被列入黑名單');
      return;
    }

    if (data.code === '13') {
      alert('json格式錯誤');
      return;
    }
    if (data.code === '14') {
      alert('json格式錯誤');
      return;
    }

    if (data.code === '15') {
      alert('無效的token');
      return;
    }

    if (data.code === '16') {
      alert('錯誤的操作');
      return;
    }

    if (data.code === '17') {
      alert('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      alert('數據格式錯誤');
      return;
    }

    if (data.code === '21') {
      alert('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      alert('無效的一次性驗證碼');
      return;
    }

    if (data.code === '30') {
      alert('無效的錢包地址');
      return;
    }

    if (data.code === '31') {
      alert('不能轉帳給自己');
      return;
    }

    if (data.code === 'ˇ32') {
      alert('可提不足');
      return;
    }

    if (data.code === 'ˇ91') {
      alert('session過期，請重新登入');
      return;
    }
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
        handleBtnLoading: state.handleBtnLoading,

        transferWebSocket,
        sendTransferReq,
        cleanStatus,
        detailReq,
        setUsdtCount,
        setOrderToken,
        closeWebSocket,
        setHandleBtnLoading,
      }}
    >
      {props.children}
    </TransferContext.Provider>
  );
};

export default TransferState;
