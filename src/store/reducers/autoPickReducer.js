import { autoPickActionTypes } from "../type";

const initState = {
  loading: false,
  data: null,
  error: "",
};

export const autoPickReducer = (state = initState, action) => {
  switch (action.type) {
    case autoPickActionTypes.SET_AUTO_PICK_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case autoPickActionTypes.SET_AUTO_PICK_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: "",
      };

    case autoPickActionTypes.SET_AUTO_PICK_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    case autoPickActionTypes.SET_AUTO_PICK_CLEAR:
      return state;

    default:
      return state;
  }
};
