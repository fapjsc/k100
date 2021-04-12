import {
    SET_SELL_COMPLETED,
    SET_RMB_SELL_RATE,
    SET_ORDER_TOKEN,
    SET_WS_PAIRING,
    SET_WS_DATA,
    CLOSE_WS,
    SET_PAYMENT,
    CLEAN_ORDER_TOKEN,
} from '../type';

const SellReducer = (state, action) => {
    switch (action.type) {
        case SET_RMB_SELL_RATE: {
            return {
                ...state,
                exRate: action.payload.RMB_SELL,
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

        case CLOSE_WS: {
            return {
                ...state,
                closeWs: true,
            };
        }

        // 提交確認/交易完成組件中，判斷是提交確認還是交易完成
        case SET_SELL_COMPLETED: {
            return {
                ...state,
                sellIsCompleted: true,
            };
        }

        // 買方完成付款
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

        default:
            return state;
    }
};

export default SellReducer;
