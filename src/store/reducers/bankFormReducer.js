import { bankFormActionsTypes } from "../type";

const initialState = {
  buy: null,
  sell: null,
};

export const temp = () => {};

export const bankFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case bankFormActionsTypes.SET_BUY_FORM:
      return {
        ...state,
        buy: action.payload,
      };

    case bankFormActionsTypes.SET_SELL_FORM:
      return {
        ...state,
        sell: action.payload,
      };

    default:
      return state;
  }
};
