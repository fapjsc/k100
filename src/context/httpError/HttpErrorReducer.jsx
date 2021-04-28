import { SET_HTTP_ERROR } from '../type';

const HttpErrorReducer = (state, action) => {
  switch (action.type) {
    case SET_HTTP_ERROR:
      return {
        errorText: action.payload,
      };
    default:
      return state;
  }
};

export default HttpErrorReducer;
