import { memberChatActionsTypes } from "../type";

export const setShowMemberChat = () => ({
  type: memberChatActionsTypes.SHOW_CHAT,
});

export const setMessageList = (messageList) => ({
  type: memberChatActionsTypes.SET_MESSAGE_LIST,
  payload: messageList,
});

export const setMessage = (message) => ({
  type: memberChatActionsTypes.SET_MESSAGE,
  payload: message,
});
