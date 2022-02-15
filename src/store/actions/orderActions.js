import { orderActionsTypes } from "../type";

export const setOrderStatus = (orderData) => ({
  type: orderActionsTypes.SET_ORDER_DATA,
  payload: orderData,
});
