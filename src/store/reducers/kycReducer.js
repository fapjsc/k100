import { kycActionsTypes } from "../type";

const setInitialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const setKycReducer = (state = setInitialState, action) => {
  switch (action.type) {
    case kycActionsTypes.SET_KYC_BEGIN:
      return {
        isLoading: true,
        data: null,
        error: null,
      };

    case kycActionsTypes.SET_KYC_SUCCESS:
      return {
        isLoading: false,
        data: action.payload,
        error: null,
      };

    case kycActionsTypes.SET_KYC_ERROR:
      return {
        isLoading: false,
        data: null,
        error: action.payload,
      };

    case kycActionsTypes.SET_KYC_CLEAR:
      return setInitialState;

    default:
      return state;
  }
};

const getInitialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const getKycReducer = (state = getInitialState, action) => {
  switch (action.type) {
    case kycActionsTypes.GET_KYC_BEGIN:
      return {
        isLoading: true,
        data: null,
        error: null,
      };

    case kycActionsTypes.GET_KYC_SUCCESS:
      return {
        isLoading: false,
        data: action.payload,
        error: null,
      };

    case kycActionsTypes.GET_KYC_ERROR:
      return {
        isLoading: false,
        data: null,
        error: action.payload,
      };

    case kycActionsTypes.GET_KYC_CLEAR:
      return getInitialState;

    default:
      return state;
  }
};

const removeInitialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const removeKycReducer = (state = removeInitialState, action) => {
  switch (action.type) {
    case kycActionsTypes.REMOVE_KYC_BEGIN:
      return {
        isLoading: true,
        data: null,
        error: null,
      };

    case kycActionsTypes.REMOVE_KYC_SUCCESS:
      return {
        isLoading: false,
        data: action.payload,
        error: null,
      };

    case kycActionsTypes.REMOVE_KYC_ERROR:
      return {
        isLoading: false,
        data: null,
        error: action.payload,
      };

    case kycActionsTypes.REMOVE_KYC_CLEAR:
      return removeInitialState;

    default:
      return state;
  }
};
