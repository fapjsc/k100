import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import HttpErrorReducer from './HttpErrorReducer';
import HttpErrorContext from './HttpErrorContext';

import { SET_HTTP_ERROR, SET_HTTP_LOADING, SET_BUTTON_LOADING } from '../type';

const HttpErrorState = props => {
  // Router Props
  const history = useHistory();

  // Init State
  const initialState = {
    errorText: '',
    httpLoading: false,
    btnLoading: false,
  };

  const setHttpError = value => {
    dispatch({ type: SET_HTTP_ERROR, payload: value });
  };

  const setHttpLoading = value => {
    dispatch({ type: SET_HTTP_LOADING, payload: value });
  };

  const setBtnLoading = value => {
    dispatch({ type: SET_BUTTON_LOADING, payload: value });
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
      history.replace('/home/overview');
      return;
    }

    if (data.code === '17') {
      setHttpError('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      setHttpError('數據格式錯誤');
      history.replace('/home/overview');
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
      history.replace('/auth/login');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('agent');
      localStorage.removeItem('loglevel');
      setHttpError('');
      return;
    }

    setHttpError('發生錯誤，請重新登入並重新嘗試');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('agent');
    localStorage.removeItem('loglevel');
    history.replace('/auth/login');

    setHttpError('');
  };

  const [state, dispatch] = useReducer(HttpErrorReducer, initialState);

  return (
    <HttpErrorContext.Provider
      value={{
        errorText: state.errorText,
        httpLoading: state.httpLoading,
        btnLoading: state.btnLoading,

        handleHttpError,
        setHttpError,
        setHttpLoading,
        setBtnLoading,
      }}
    >
      {props.children}
    </HttpErrorContext.Provider>
  );
};

export default HttpErrorState;
