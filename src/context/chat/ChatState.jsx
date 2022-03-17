import { useReducer } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
// import { w3cwebsocket as W3CWebsocket } from 'websocket';

import ChatReducer from "./ChatReducer";
import ChatContext from "./ChatContext";

import {
  SET_TRANSLATE,
  SET_MESSAGES,
  SET_CHAT_WS_CLIENT,
  CHAT_SET_ORDER_TOKEN,
  SET_INSTANT_CLIENT,
  SET_INSTANT_MESSAGES,
  SET_CHAT_LOADING,
  SET_NEW_MESSAGE,
} from "../type";

const ChatState = (props) => {
  const initialState = {
    isTranslate: false,
    messages: [],
    orderToken: "",
    client: null,
    instantClient: null,
    instantMessages: [],
    chatLoading: false,
    newMessage: false,
  };

  // Chat WebSocket
  const chatConnect = (orderToken) => {

    const loginSession = localStorage.getItem("token");

    const chatApi = `WS_ChatOrder.ashx`;

    let url;

    if (window.location.protocol === "http:") {
      url = `${process.env.REACT_APP_K100U_CHAT_WEBSOCKET}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `${process.env.REACT_APP_K100U_CHAT_WEBSOCKET}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new ReconnectingWebSocket(url);

    // console.log(client);

    setClient(client);

    // 1.建立連接
    client.onopen = (message) => {
      console.log('chat connect');
    };

    // 2.收到server回復
    client.onmessage = (message) => {
      // console.log(message);
      const dataFromServer = JSON.parse(message.data);
      console.log('got Chat reply!', dataFromServer);

      setChatLoading(false);

      setMessages(dataFromServer);
    };

    // 3.錯誤處理
    client.onclose = (message) => {
      // console.log('聊天室關閉');
    };
  };

  // 關閉連線
  const closeUserChatWebSocket = (orderToken) => {
    // state.client.close();
    // alert('call close');
    // const loginSession = localStorage.getItem('token');
    // const chatApi = `chat/WS_ChatOrder.ashx`;
    // let url;
    // if (window.location.protocol === 'http:') {
    //   url = `${process.env.REACT_APP_WEBSOCKET_URL}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    // } else {
    //   url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    // }
    // const client = new ReconnectingWebSocket(url);
    // if (client) {
    //   alert('has client');
    //   alert(client === state.client);
    //   client.close();
    // } else {
    //   console.log('沒有webSocket Client');
    // }
  };

  // instant chat
  const instantChat = (orderToken) => {
    const loginSession = localStorage.getItem("token");

    const chatApi = `ws_ChatOrder3.ashx`;

    let url;

    if (window.location.protocol === "http:") {
      url = `${process.env.REACT_APP_K100U_CHAT_WEBSOCKET}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    } else {
      url = `${process.env.REACT_APP_K100U_CHAT_WEBSOCKET}/${chatApi}?login_session=${loginSession}&order_token=${orderToken}`;
    }

    const client = new ReconnectingWebSocket(url);

    // 1.建立連接
    client.onopen = (message) => {
      setInstantClient(client);
      // console.log('instant chat connect');
    };

    // 2.收到server回復
    client.onmessage = (message) => {
      if (message.data === "" || message.data.includes("login_session")) return;

      const dataFromServer = JSON.parse(message.data);
      console.log('instant got Chat reply!', dataFromServer);
      setChatLoading(false);
      if (dataFromServer.Message_Role === 1) {
        setNewMessage(true);
        // console.log("new message");
      }
      setInstantMessages(dataFromServer);
    };

    // 3.錯誤處理
    client.onclose = (message) => {
      // console.log("instant聊天室關閉");
    };
  };

  const setTranslate = (value) => {
    dispatch({ type: SET_TRANSLATE, payload: value });
  };

  const setMessages = (message) => {
    dispatch({ type: SET_MESSAGES, payload: message });
  };

  const setOrderToken = (orderToken) => {
    dispatch({ type: CHAT_SET_ORDER_TOKEN, payload: orderToken });
  };

  // Set Instant Client
  const setInstantClient = (value) => {
    dispatch({ type: SET_INSTANT_CLIENT, payload: value });
  };

  // Set Instant Messages
  const setInstantMessages = (message) => {
    dispatch({ type: SET_INSTANT_MESSAGES, payload: message });
  };

  // Set Normal Chat Client
  const setClient = (client) => {
    dispatch({ type: SET_CHAT_WS_CLIENT, payload: client });
  };

  // Set Chat Loading
  const setChatLoading = (value) => {
    dispatch({ type: SET_CHAT_LOADING, payload: value });
  };

  // Set New Message
  const setNewMessage = (value) => {
    dispatch({ type: SET_NEW_MESSAGE, payload: value });
  };

  const [state, dispatch] = useReducer(ChatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        isTranslate: state.isTranslate,
        messages: state.messages,
        orderToken: state.orderToken,
        client: state.client,
        instantClient: state.instantClient,
        instantMessages: state.instantMessages,
        chatLoading: state.chatLoading,
        newMessage: state.newMessage,

        setTranslate,
        chatConnect,
        closeUserChatWebSocket,
        setOrderToken,
        instantChat,
        setClient,
        setInstantClient,
        setMessages,
        setInstantMessages,
        setChatLoading,
        setNewMessage,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
