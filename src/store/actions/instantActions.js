import { instantActionsTypes } from "../type";

export const setInstantOrderData = (data) => ({
  type: instantActionsTypes.SET_INSTANT_ORDER,
  payload: data,
});

export const setCurrentInstantData = (data) => ({
  type: instantActionsTypes.CURRENT_INSTANT_ORDER,
  payload: data,
});
