import {
  IS_SEND_VALID_CODE,
  SET_VALID_TOKEN,
  SET_AUTH_LOADING,
  SHOW_ERROR_MODAL,
  REMOVE_VALID_TOKEN,
  SET_EXPIRED_TIME,
} from '../type';

const AuthReducer = (state, action) => {
  switch (action.type) {
    case SET_EXPIRED_TIME:
      return {
        ...state,
        expiredTime: action.payload,
      };

    case REMOVE_VALID_TOKEN:
      return {
        ...state,
        validToken: null,
      };
    case SHOW_ERROR_MODAL:
      return {
        ...state,
        showErrorModal: {
          show: action.payload.show,
          text: action.payload.text,
          status: action.payload.status,
        },
      };

    case SET_AUTH_LOADING:
      return {
        ...state,
        authLoading: action.payload,
      };

    case SET_VALID_TOKEN:
      return {
        ...state,
        validToken: action.payload,
      };

    case IS_SEND_VALID_CODE:
      return {
        ...state,
        isSendValidCode: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
