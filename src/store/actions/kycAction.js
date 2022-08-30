import { kycActionsTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const setKyc = (kycData) => async (dispatch) => {
  dispatch({ type: kycActionsTypes.SET_KYC_BEGIN });

  try {
    const { data } = await authFetch.post("/Req_UserData_Update.aspx", {
      ...kycData,
      P1: kycData.account,
      P2: kycData.name,
    });
    dispatch({ type: kycActionsTypes.SET_KYC_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: kycActionsTypes.SET_KYC_ERROR, payload: error });
  }
};

export const getKyc = () => async (dispatch) => {
  dispatch({ type: kycActionsTypes.GET_KYC_BEGIN });

  try {
    const { data } = await authFetch.get("/Get_UserData.aspx");
    dispatch({ type: kycActionsTypes.GET_KYC_SUCCESS, payload: data.data });
    console.log(data)
  } catch (error) {
    dispatch({ type: kycActionsTypes.GET_KYC_ERROR, payload: error });
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
    dispatch({ type: kycActionsTypes.REMOVE_KYC_ERROR, payload: error });
  }
};
