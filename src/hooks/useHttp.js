import { useReducer, useCallback } from 'react';

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        data: null,
        error: null,
        status: 'pending',
      };

    case 'SUCCESS':
      return {
        data: action.responseData,
        error: null,
        status: 'completed',
      };

    case 'ERROR':
      return {
        data: null,
        error: action.errorMessage,
        status: 'completed',
      };

    default:
      return state;
  }
};

const useHttp = (reqFun, startWithPending = false) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async reqData => {
      dispatch({ type: 'SEND' });

      try {
        const responseData = await reqFun(reqData);
        dispatch({ type: 'SUCCESS', responseData });
      } catch (error) {
        dispatch({ type: 'ERROR', errorMessage: error.message || 'Something went wrong!' });
      }
    },
    [reqFun]
  );

  return {
    ...httpState,
    sendRequest,
  };
};

export default useHttp;
