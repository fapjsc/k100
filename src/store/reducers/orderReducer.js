import { orderActionsTypes } from "../type";

const initialState = {
  orderStatus: {},
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case orderActionsTypes.SET_ORDER_DATA:
      return {
        ...state,
        orderStatus: action.payload,
      };

    default:
      return state;
  }
};
