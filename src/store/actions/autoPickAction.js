import { autoPickActionTypes } from "../type";
import { authFetch } from "../../config/axiosConfig";

export const autoPickReq =
  ({ mode }) =>
  async (dispatch) => {
    dispatch({ type: autoPickActionTypes.SET_AUTO_PICK_BEGIN });

    try {
      const { data } = await authFetch.post("/Req_AutoPick.aspx", { mode });
      // console.log(data);

      // mode: 0 手動
      // mode: 1 自動
      // mode: -1 查詢
      dispatch({
        type: autoPickActionTypes.SET_AUTO_PICK_SUCCESS,
        payload: { data: data.data },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: autoPickActionTypes.SET_AUTO_PICK_ERROR,
          payload: { error: error.response.data.msg || "Fetch Fail." },
        });
      }
    }
  };
