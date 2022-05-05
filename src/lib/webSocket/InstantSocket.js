import ReconnectingWebSocket from "reconnecting-websocket";

let client;

// Instant Web Socket連接   --所有的即時交易
export const connectInstantWs = () => {
  const loginSession = localStorage.getItem("token");

  if (!loginSession) return;

  if(client) client?.close()

  const connectWs = "j/ws_liveorders.ashx";



  let url;

  if (window.location.protocol === "http:") {
    url = `${process.env.REACT_APP_WEBSOCKET_URL}/${connectWs}?login_session=${loginSession}`;
  } else {
    url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${connectWs}?login_session=${loginSession}`;
  }

  client = new ReconnectingWebSocket(url);

  // 1.建立連接
  client.onopen = () => {
    // console.log('websocket client connected instant');/
  };

  // 2.收到server回復
  client.onmessage = (message) => {

    if (!message.data) return;
    const dataFromServer = JSON.parse(message.data);
    console.log(dataFromServer);
  };

  // 3.錯誤處理
  client.onclose = function (message) {
    console.log("關閉連線.....");
  };
};
