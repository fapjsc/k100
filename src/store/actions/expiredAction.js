import { expiredActionTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const getExpiredOrder = () => async (dispatch) => {
  dispatch({ type: expiredActionTypes.SET_EXPIRED_BEGIN });

  try {
    const { data } = await authFetch.get("/GetTxExpired.aspx");

    dispatch({
      type: expiredActionTypes.SET_EXPIRED_SUCCESS,
      payload: { data: data.data },
    });
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: expiredActionTypes.SET_EXPIRED_ERROR,
        payload: { error: error.response.data.msg || "Fetch Fail." },
      });
    }
  }
};
