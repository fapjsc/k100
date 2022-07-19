import dayjs from "dayjs";

import { memberChatActionsTypes } from "../type";

import { unitDate } from "../../lib/unitDate";

import { customText } from "../../config/customText";

const initState = {
  showChat: false,
  messages: [],
};

export const memberChatReducer = (state = initState, action) => {
  switch (action.type) {
    case memberChatActionsTypes.SHOW_CHAT:
      return {
        ...state,
        showChat: !state.showChat,
      };

    case memberChatActionsTypes.SET_MESSAGE_LIST:
      const arr = action.payload.sort((a, b) => {
        return (
          dayjs(unitDate(a.SysDate)).valueOf() -
          dayjs(unitDate(b.SysDate)).valueOf()
        );
      });

      const existsCustomText = arr.find(
        (el, index, arr) =>
          el.Message === customText.Message && index === arr.length - 1
      );

      return {
        ...state,
        messages: existsCustomText ? [...arr] : [...arr, customText],
      };

    case memberChatActionsTypes.SET_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};
