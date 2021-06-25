import { SET_TRANSLATE, SET_MESSAGES, SET_CHAT_WS_CLIENT, CHAT_SET_ORDER_TOKEN, SET_INSTANT_CLIENT, SET_INSTANT_MESSAGES, SET_CHAT_LOADING, SET_NEW_MESSAGE } from '../type';

const ChatReducer = (state, action) => {
  switch (action.type) {
    case SET_NEW_MESSAGE:
      return {
        ...state,
        newMessage: action.payload,
      };
    case SET_CHAT_LOADING:
      return {
        ...state,
        chatLoading: action.payload,
      };
    case SET_INSTANT_MESSAGES:
      if (!Array.isArray(action.payload)) {
        return {
          ...state,
          instantMessages: [...state.instantMessages, action.payload],
        };
      } else {
        return {
          ...state,
          instantMessages: action.payload.reverse(),
        };
      }

    case SET_INSTANT_CLIENT:
      return {
        ...state,
        instantClient: action.payload,
      };
    case CHAT_SET_ORDER_TOKEN:
      return {
        ...state,
        orderToken: action.payload,
      };
    case SET_CHAT_WS_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case SET_MESSAGES:
      if (!Array.isArray(action.payload)) {
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      } else {
        return {
          ...state,
          messages: action.payload.reverse(),
        };
      }

    case SET_TRANSLATE:
      return {
        ...state,
        isTranslate: action.payload,
      };
    default:
      return state;
  }
};

export default ChatReducer;
