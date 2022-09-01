import { userActionsTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const setKycUserData = (userData) => async (dispatch) => {
  dispatch({ type: userActionsTypes.SET_USER_BEGIN });

  try {
    const { data } = await authFetch.post("/Req_UserData_Update.aspx", {
      ...userData,
    });
    dispatch({ type: userActionsTypes.SET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: userActionsTypes.SET_USER_ERROR, payload: error.message });
  }
};

export const getKycUserData = () => async (dispatch) => {
  dispatch({ type: userActionsTypes.GET_USER_BEGIN });

  try {
    const { data } = await authFetch.get("/Get_UserData.aspx");
    dispatch({ type: userActionsTypes.GET_USER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: userActionsTypes.GET_USER_ERROR, payload: error.message });
  }
};

export const cleanKycSetUserStatus = () => ({
  type: userActionsTypes.SET_USER_CLEAR,
});

export const cleanKycGetUserStatus = () => ({
  type: userActionsTypes.GET_USER_CLEAR,
});
