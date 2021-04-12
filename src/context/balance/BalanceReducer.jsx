import { SET_BALANCE } from '../type';

const BalanceReducer = (state, action) => {
    switch (action.type) {
        case SET_BALANCE: {
            return {
                ...state,
                avb: action.payload.Avb_Balance.toFixed(2),
                real: action.payload.Real_Balance.toFixed(2),
            };
        }
        default:
            return state;
    }
};

export default BalanceReducer;
