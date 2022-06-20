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
      let limit;
      switch (Lvl) {
        case 0:
          limit = 500;
          break;

        case 1:
          limit = 20000;
          break;

        case 2:
          limit = 200000;
          break;

        case 3:
          limit = 500000;
          break;

        case 4:
          limit = 1000000;
          break;

        case 5:
          limit = 0;
          break;

        default:
          limit = 100000;
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
