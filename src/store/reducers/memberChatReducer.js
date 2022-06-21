import dayjs from "dayjs";

import { memberChatActionsTypes } from "../type";

import { unitDate } from "../../lib/unitDate";



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
      return {
        ...state,
        messages: [...action.payload].sort((a, b) => {
          return dayjs(unitDate(a.SysDate)).valueOf() - dayjs(unitDate(b.SysDate)).valueOf();
        }),
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
