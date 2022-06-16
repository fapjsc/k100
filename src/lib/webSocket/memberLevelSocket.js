// import ReconnectingWebSocket from "reconnecting-websocket";

// let client;


// export const connectMemberLevelWs = () => {
//   const loginSession = localStorage.getItem("token");

//   if (!loginSession) return;

//   if (client) client?.close();

//   const connectWs = "ws_chatuser.ashx?";

//   const url = `wss://${process.env.REACT_APP_PROXY}/${connectWs}?login_session=${loginSession}`;

 

//   client = new ReconnectingWebSocket(url);

//   // 1.建立連接
//   client.onopen = () => {
//     console.log('websocket client connected member level');
//   };

//   // 2.收到server回復
//   client.onmessage = (message) => {
//     const dataFromServer = JSON.parse(message.data);
//     console.log(dataFromServer);
//   };

//   // 3.錯誤處理
//   client.onclose = function (message) {
//     console.log("關閉連線.....");
//   };
// };


// export const closeMemberWs = () => {
//     if(!client) return
//     client.close()
// }


// //點擊後發送訊息到server
// export const sendMessage = (value) => {
//     if(!client)
//   if (value === "") return;

//   if (
//     e.keyCode === 13 ||
//     e.target.id === "sendIcon" ||
//     e.target.id === "sendIcon1"
//   ) {
//     if (instantClient) {
//       instantClient.send(
//         JSON.stringify({
//           Message_Type: 1,
//           Message: value.toString(),
//         })
//       );
//     }

//     if (client) {
//       client.send(
//         JSON.stringify({
//           Message_Type: 1,
//           Message: value.toString(),
//         })
//       );
//     }

//     setUserInput("");
//   }

//   return;
// };
