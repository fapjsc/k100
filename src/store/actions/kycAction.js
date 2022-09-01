import { kycActionsTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const setKyc = (kycData) => async (dispatch) => {
  dispatch({ type: kycActionsTypes.SET_KYC_BEGIN });

  try {
    const { data } = await authFetch.post("/Req_UserBankSet.aspx", {
      ...kycData,
    });
    dispatch({ type: kycActionsTypes.SET_KYC_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: kycActionsTypes.SET_KYC_ERROR, payload: error.message });
  }
};

export const getKyc = () => async (dispatch) => {
  dispatch({ type: kycActionsTypes.GET_KYC_BEGIN });

  try {
    const { data } = await authFetch.get("/Get_UserBankSet.aspx");
    dispatch({ type: kycActionsTypes.GET_KYC_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: kycActionsTypes.GET_KYC_ERROR, payload: error.message });
  }
};

export const removeKyc = (kycToken) => async (dispatch) => {
  dispatch({ type: kycActionsTypes.REMOVE_KYC_BEGIN });

  try {
    const { data } = await authFetch.post("/Req_UserBankSet_Remove.aspx", {
      token: kycToken,
    });
    dispatch({ type: kycActionsTypes.REMOVE_KYC_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: kycActionsTypes.REMOVE_KYC_ERROR,
      payload: error.message,
    });
  }
};

export const cleanSetKycStatus = () => ({
  type: kycActionsTypes.SET_KYC_CLEAR,
});

export const cleanGetKycStatus = () => ({
  type: kycActionsTypes.GET_KYC_CLEAR,
});

export const cleanRemoveKycStatus = () => ({
  type: kycActionsTypes.REMOVE_KYC_CLEAR,
});
