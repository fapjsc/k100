import { instantActionsTypes } from "../type";

const initialState = {
  instantData: null,
  currentInstantData: null,
};

export const instantReducer = (state = initialState, action) => {
  switch (action.type) {
    case instantActionsTypes.SET_ORDER_DATA:
      return {
        ...state,
        instantData: action.payload,
      };

    case instantActionsTypes.CURRENT_INSTANT_ORDER:
      return {
        ...state,
        currentInstantData: action.payload,
      };

    default:
      return state;
  }
};
