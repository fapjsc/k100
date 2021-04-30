import {
  BUY_BTN_LOADING,
  SET_BUY_COUNT,
  SET_BUY_ERROR_TEXT,
  SET_BUY_ORDER_TOKEN,
  SET_BUY_WS_STATUS,
  HANDLE_PAIRING,
  SET_SHOW_BANK,
  SET_BUY_WS_CLIENT,
  SET_BUY_WS_DATA,
  SET_DELTA_TIME,
  HIDE_BUY_INFO,
} from '../type';

const BalanceReducer = (state, action) => {
  switch (action.type) {
    case HIDE_BUY_INFO:
      return {
        ...state,
        isHideBuyInfo: action.payload,
      };
    case SET_DELTA_TIME:
      return {
        ...state,
        deltaTime: action.payload,
      };
    case SET_BUY_WS_DATA:
      return {
        ...state,
        buyWsData: action.payload,
      };
    case SET_BUY_WS_CLIENT:
      return {
        ...state,
        buyWsClient: action.payload,
      };
    case SET_SHOW_BANK:
      return {
        ...state,
        showBank: action.payload,
      };
    case HANDLE_PAIRING:
      return {
        ...state,
        buyPairing: action.payload,
      };
    case SET_BUY_WS_STATUS:
      return {
        ...state,
        wsStatus: action.payload,
      };
    case SET_BUY_ORDER_TOKEN:
      return {
        ...state,
        buyOrderToken: action.payload,
      };
    case SET_BUY_ERROR_TEXT:
      return {
        ...state,
        buyErrorText: action.payload,
      };
    case SET_BUY_COUNT:
      return {
        ...state,
        buyCount: {
          usdt: action.payload.usdt,
          rmb: action.payload.rmb,
        },
      };

    case BUY_BTN_LOADING:
      return {
        ...state,
        buyBtnLoading: action.payload,
      };

    default:
      return state;
  }
};

export default BalanceReducer;
