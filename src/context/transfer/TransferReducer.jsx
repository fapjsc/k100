import {
  SET_TRANSFER_ORDER_TOKEN,
  SET_TRANSFER_STATUS,
  SET_USDT_COUNT,
  SET_ORDER_DETAIL,
  GET_WS_CLIENT,
} from '../type';

const SellReducer = (state, action) => {
  switch (action.type) {
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
