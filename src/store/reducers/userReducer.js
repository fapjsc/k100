import { userActionsTypes } from "../type";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const setUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case userActionsTypes.SET_USER_BEGIN:
      return {
        loading: true,
        data: null,
        error: null,
      };

    case userActionsTypes.SET_USER_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: null,
      };

    case userActionsTypes.SET_USER_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case userActionsTypes.SET_USER_CLEAR:
      return initialState;

    default:
      return state;
  }
};

const getInitialState = {
  loading: false,
  data: null,
  error: null,
};

export const getUserReducer = (state = getInitialState, action) => {
  switch (action.type) {
    case userActionsTypes.GET_USER_BEGIN:
      return {
        loading: true,
        data: null,
        error: null,
      };

    case userActionsTypes.GET_USER_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: null,
      };

    case userActionsTypes.GET_USER_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case userActionsTypes.GET_USER_CLEAR:
      return getInitialState;
      
    default:
      return state;
  }
};
