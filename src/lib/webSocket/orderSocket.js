import { w3cwebsocket as W3CWebsocket } from "websocket";

let client;

export const buyConnectWs = (token) => {
  const transactionApi = "j/ws_orderstatus.ashx";

  let loginSession = localStorage.getItem("token");

  let url;

  if (window.location.protocol === "http:") {
    url = `${process.env.REACT_APP_WEBSOCKET_URL}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
  } else {
    url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
  }

  client = new W3CWebsocket(url);

  // 1.建立連接
  client.onopen = () => {
    // console.log('websocket client connected buy');
  };

  // 2.收到server回復
  client.onmessage = (message) => {
    if (!message.data) return;
    const dataFromServer = JSON.parse(message.data);
    console.log("got reply!", dataFromServer, "buy");
  };

  //3. 連線關閉
  client.onclose = (message) => {
    // console.log('關閉連線', message);
    // setWsClient(null);
  };
};
