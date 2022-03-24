import { expiredActionTypes } from "../type";

const initialState = {
  loading: false,
  data: null,
  error: "",
};

export const expiredReducer = (state = initialState, action) => {
  switch (action.type) {
    case expiredActionTypes.SET_EXPIRED_BEGIN:
      return {
        loading: true,
        data: null,
        error: "",
      };

    case expiredActionTypes.SET_EXPIRED_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: "",
      };

    case expiredActionTypes.SET_EXPIRED_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
