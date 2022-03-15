import { accountActionsTypes } from "../type";

const setAccInitialState = {
  loading: false,
  data: null,
  error: null,
};

export const setAccountReducer = (state = setAccInitialState, action) => {
  switch (action.type) {
    case accountActionsTypes.SET_CURRENT_ACC_BEGIN:
      return {
        loading: true,
        data: null,
        error: null,
      };

    case accountActionsTypes.SET_CURRENT_ACC_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: null,
      };

    case accountActionsTypes.SET_CURRENT_ACC_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    case accountActionsTypes.SET_CURRENT_ACC_CLEAR:
      return setAccInitialState;
    default:
      return state;
  }
};

const currentAccInitialState = {
  loading: false,
  data: null,
  error: null,
};

export const currentAccountReducer = (
  state = currentAccInitialState,
  action
) => {
  switch (action.type) {
    case accountActionsTypes.GET_CURRENT_ACC_BEGIN:
      return {
        loading: true,
        data: null,
        error: null,
      };

    case accountActionsTypes.GET_CURRENT_ACC_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: null,
      };

    case accountActionsTypes.GET_CURRENT_ACC_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    case accountActionsTypes.GET_CURRENT_ACC_CLEAR:
      return currentAccInitialState;
    default:
      return state;
  }
};

const AccHistoryInitialState = {
  loading: false,
  data: null,
  error: null,
};

export const accHistoryReducer = (state = AccHistoryInitialState, action) => {
  switch (action.type) {
    case accountActionsTypes.SET_HISTORY_ACC_BEGIN:
      return {
        loading: true,
        data: null,
        error: null,
      };

    case accountActionsTypes.SET_HISTORY_ACC_SUCCESS:
      return {
        loading: false,
        data: action.payload.data,
        error: null,
      };

    case accountActionsTypes.SET_HISTORY_ACC_ERROR:
      return {
        loading: false,
        data: null,
        error: action.payload.error,
      };

    case accountActionsTypes.SET_HISTORY_ACC_CLEAR:
      return AccHistoryInitialState;
    default:
      return state;
  }
};
