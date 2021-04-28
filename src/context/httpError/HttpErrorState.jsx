import { useReducer } from 'react';

import HttpErrorReducer from './HttpErrorReducer';
import HttpErrorContext from './HttpErrorContext';

import { SET_HTTP_ERROR } from '../type';

const HttpErrorState = props => {
  const initialState = {
    errorText: '',
  };

  const setHttpError = value => {
    dispatch({ type: SET_HTTP_ERROR, payload: value });
  };

  const handleHttpError = data => {
    if (data.code === '1') {
      setHttpError('系統錯誤');
      return;
    }

    if (data.code === '10') {
      setHttpError('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      setHttpError('此帳號已經註冊過');
      return;
    }

    if (data.code === '12') {
      setHttpError('此帳號無法註冊');
      return;
    }

    if (data.code === '13') {
      setHttpError('json格式錯誤');
      return;
    }
    if (data.code === '14') {
      setHttpError('json格式錯誤');
      return;
    }

    if (data.code === '15') {
      setHttpError('無效的token');
      return;
    }

    if (data.code === '16') {
      setHttpError('錯誤的操作');

      return;
    }

    if (data.code === '17') {
      setHttpError('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      setHttpError('數據格式錯誤');
      return;
    }

    if (data.code === '21') {
      setHttpError('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      setHttpError('無效的一次性驗證碼');
      return;
    }

    if (data.code === '30') {
      setHttpError('無效的錢包地址');
      return;
    }

    if (data.code === '31') {
      setHttpError('不能轉帳給自己');
      return;
    }
    if (data.code === '32') {
      setHttpError('可提不足');
      return;
    }

    if (data.code === '91') {
      setHttpError('session過期，請重新登入');
      return;
    }
  };

  const [state, dispatch] = useReducer(HttpErrorReducer, initialState);

  return (
    <HttpErrorContext.Provider
      value={{
        errorText: state.errorText,
        handleHttpError,
      }}
    >
      {props.children}
    </HttpErrorContext.Provider>
  );
};

export default HttpErrorState;
