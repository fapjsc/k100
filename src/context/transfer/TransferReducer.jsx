import {
  SET_TRANSFER_ORDER_TOKEN,
  SET_TRANSFER_STATUS,
  SET_USDT_COUNT,
  SET_ORDER_DETAIL,
  GET_WS_CLIENT,
  HANDLE_BTN_LOADING,
  SET_TRANSFER_ERROR_TEXT,
} from '../type';

const SellReducer = (state, action) => {
  switch (action.type) {
    case SET_TRANSFER_ERROR_TEXT:
      return {
        ...state,
        transferErrText: action.payload,
      };
    case HANDLE_BTN_LOADING:
      return {
        ...state,
        handleBtnLoading: action.payload,
      };
    case GET_WS_CLIENT:
      return {
        ...state,
        wsClient: action.payload,
      };
    case SET_ORDER_DETAIL:
      return {
        ...state,
        orderDetail: action.payload,
      };
    case SET_USDT_COUNT:
      return {
        ...state,
        usdtCount: action.payload,
      };
    case SET_TRANSFER_STATUS:
      return {
        ...state,
        transferStatus: action.payload,
      };
    case SET_TRANSFER_ORDER_TOKEN:
      return {
        ...state,
        transferOrderToken: action.payload,
      };
    default:
      return state;
  }
};

export default SellReducer;
