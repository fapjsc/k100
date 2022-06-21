import { SET_BALANCE, SET_TICK } from "../type";

const BalanceReducer = (state, action) => {
  switch (action.type) {
    case SET_TICK:
      return {
        ...state,
        tick: action.payload,
      };
    case SET_BALANCE:
      const { Lvl, Avb_Balance, Real_Balance } = action.payload;
      let limit = {
        month: null,
        day: null
      }
      switch (Lvl) {
        case 0:
          limit = {month: 500, day: 500};
          break;

        case 1:
          limit = {month: 20000, day: 2000};
          break;

        case 2:
          limit = {month: 200000, day: 10000};
          break;

        case 3:
          limit = {month: 500000, day: 30000};
          break;

        case 4:
          limit = {month: 1000000, day: 60000};
          break;

        case 5:
          limit = {month: 0, day: 0};
          break;

        default:
          limit = {month: 999999, day: 10000};
          break;
      }

      return {
        ...state,
        avb: Avb_Balance.toFixed(2),
        real: Real_Balance.toFixed(2),
        level: limit,
      };

    default:
      return state;
  }
};

export default BalanceReducer;
