import { accountActionsTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const getAcc = () => async (dispatch) => {
  dispatch({ type: accountActionsTypes.GET_CURRENT_ACC_BEGIN });

  try {
    const { data } = await authFetch.get("/GetAgentAcc.aspx");

    dispatch({
      type: accountActionsTypes.GET_CURRENT_ACC_SUCCESS,
      payload: { data: data.data },
    });
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: accountActionsTypes.GET_CURRENT_ACC_ERROR,
        payload: { error: error.response.data.msg || "Fetch Fail." },
      });
    }
  }
};

export const getAccHistory = () => async (dispatch) => {
  dispatch({ type: accountActionsTypes.SET_HISTORY_ACC_BEGIN });

  try {
    const { data } = await authFetch.get("/GetAgentAccHistory.aspx");

    dispatch({
      type: accountActionsTypes.SET_HISTORY_ACC_SUCCESS,
      payload: { data: data.data },
    });
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: accountActionsTypes.SET_HISTORY_ACC_ERROR,
        payload: { error: error.response.data.msg || "Fetch Fail." },
      });
    }
  }
};

export const setAcc = (accData) => async (dispatch) => {
  dispatch({ type: accountActionsTypes.SET_CURRENT_ACC_BEGIN });

  try {
    const { data } = await authFetch.post("/SetAgentAcc.aspx", accData);

    dispatch({
      type: accountActionsTypes.SET_CURRENT_ACC_SUCCESS,
      payload: { data },
    });
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: accountActionsTypes.SET_CURRENT_ACC_ERROR,
        payload: { error: error.response.data.msg || "Fetch Fail." },
      });
    }
  }
};
