import { bankFormActionsTypes } from "../type";

export const setBuyBankForm = (data) => ({
    type: bankFormActionsTypes.SET_BUY_FORM,
    payload: data
})

export const setSellBankForm = (data) => ({
    type: bankFormActionsTypes.SET_SELL_FORM,
    payload: data
})