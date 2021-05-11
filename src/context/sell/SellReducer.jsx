import {
  SET_SELL_COMPLETED,
  SET_RMB_SELL_RATE,
  SET_ORDER_TOKEN,
  SET_WS_PAIRING,
  SET_WS_DATA,
  SET_PAYMENT,
  CLEAN_ORDER_TOKEN,
  SET_WS_CLIENT,
  SET_CANCEL_ORDER_DATA,
  SET_CONFIRM_SELL,
  SET_SELL_STATUS,
} from '../type';

const SellReducer = (state, action) => {
  switch (action.type) {
    case SET_SELL_STATUS:
      return {
        ...state,
        sellStatus: action.payload,
      };
    case SET_RMB_SELL_RATE: {
      return {
        ...state,
        exRate: action.payload.RMB_SELL,
        buyRate: action.payload.RMB_BUY,
        transferHandle: action.payload.TransferHandle,
      };
    }

    case SET_ORDER_TOKEN: {
      return {
        ...state,
        orderToken: action.payload,
      };
    }

    case SET_WS_PAIRING: {
      return {
        ...state,
        wsPairing: action.payload,
      };
    }

    case SET_WS_DATA: {
      return {
        ...state,
        wsData: action.payload,
      };
    }

    // 判斷是否應該進入 "提交確認/交易完成" 組件
    case SET_CONFIRM_SELL: {
      return {
        ...state,
        confirmSell: action.payload,
      };
    }

    // 提交確認/交易完成組件中，判斷是提交確認還是交易完成
    case SET_SELL_COMPLETED: {
      return {
        ...state,
        sellIsCompleted: action.payload,
      };
    }

    // 買方完成付款 (出現call sell 2 btn)
    case SET_PAYMENT: {
      return {
        ...state,
        payment: action.payload,
      };
    }

    // 清除ORDER TOKEN
    case CLEAN_ORDER_TOKEN: {
      return {
        ...state,
        orderToken: null,
      };
    }

    // 清除 web socket 連接
    case SET_WS_CLIENT: {
      return {
        ...state,
        wsClient: action.payload,
      };
    }

    // 取消訂單的數據
    case SET_CANCEL_ORDER_DATA: {
      return {
        ...state,
        cancelData: action.payload,
      };
    }

    default:
      return state;
  }
};

export default SellReducer;
