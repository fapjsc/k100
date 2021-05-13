import {
  SET_INSTANT_WS_DATA,
  CLEAN_INSTANT_DATA,
  SET_SELL1_DATA,
  SET_COUNT_DATA,
  SET_BUY1_DATA,
  INSTANT_SET_WS_CLIENT,
  SET_WS_STATUS_DATA,
  SET_STATUS_WS_CLIENT,
} from '../type';

const InstantReducer = (state, action) => {
  switch (action.type) {
    case SET_STATUS_WS_CLIENT:
      return {
        ...state,
        wsStatusClient: action.payload,
      };
    case SET_WS_STATUS_DATA:
      return {
        ...state,
        wsStatusData: action.payload,
      };
    case INSTANT_SET_WS_CLIENT:
      return {
        ...state,
        wsClient: action.payload,
      };
    case SET_BUY1_DATA:
      return {
        ...state,
        buy1Data: action.payload,
      };
    case SET_COUNT_DATA:
      return {
        ...state,
        countData: action.payload,
      };
    case SET_SELL1_DATA:
      return {
        ...state,
        sell1Data: action.payload,
      };
    case CLEAN_INSTANT_DATA:
      return {
        ...state,
        instantData: [],
      };
    case SET_INSTANT_WS_DATA:
      return {
        ...state,
        instantData: action.payload,
      };
    default:
      return state;
  }
};

export default InstantReducer;
