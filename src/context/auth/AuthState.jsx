import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';

import {
  IS_SEND_VALID_CODE,
  SET_VALID_TOKEN,
  SET_AUTH_LOADING,
  SHOW_ERROR_MODAL,
  REMOVE_VALID_TOKEN,
  SET_EXPIRED_TIME,
  LOGIN_SET_LOADING,
  SET_ERROR_TEXT,
  SET_AGENT,
} from '../type';

const AuthState = props => {
  // Router Props
  const history = useHistory();

  // Init State
  const initialState = {
    loginLoading: false,
    errorText: '',
    isSendValidCode: false,
    validToken: null,
    authLoading: false,
    showErrorModal: {
      show: false,
      text: '',
      status: '',
    },
    expiredTime: null,
    isAgent: false,
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    return headers;
  };

  // loginLoading
  const handleLoginLoading = value => {
    dispatch({ type: LOGIN_SET_LOADING, payload: value });
  };

  // set error text
  const setErrorText = value => {
    dispatch({ type: SET_ERROR_TEXT, payload: value });
  };

  // 登入
  const login = async data => {
    handleLoginLoading(true);
    let loginApi = '/j/login.aspx';

    try {
      const res = await fetch(loginApi, {
        method: 'POST',
        body: JSON.stringify({
          Login_countrycode: data.countryCode,
          Login_tel: data.phoneNumber,
          Login_pwd: data.password,
        }),
      });

      const resData = await res.json();
      console.log(resData);

      handleLoginLoading(false);

      if (resData.code === 200) {
        if (resData.data.isAgent) {
          setAgent(true);
          const expiresStamp = 1000 * 60 * 60 * 24; // 過期時間
          const expiresDate = new Date().getTime() + expiresStamp;
          localStorage.setItem('agent', expiresDate);
        }

        const {
          data: { login_session },
        } = resData;

        localStorage.setItem('token', login_session);

        history.replace('/home/overview');
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // 登出
  const logout = async () => {
    const headers = getHeader();
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('agent');
    localStorage.removeItem('loglevel');

    let logoutApi = '/j/logout.aspx';
    try {
      const res = await fetch(logoutApi, { headers });
      const resData = await res.json();

      if (resData.code === 200) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('expiresIn');
        // localStorage.removeItem('agent');
        // localStorage.removeItem('loglevel');
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }

    history.replace('/auth/login');
  };

  // 自動登出
  const autoLogout = async () => {
    const expiresDate = localStorage.getItem('agent');
    if (!expiresDate) return;
    const expiresIn = new Date().getTime() - expiresDate;

    if (expiresIn <= 0) return;

    alert('請重新登入');

    logout();
  };

  // 忘記密碼之獲取手機驗證碼 step-1
  const getValidCode = async data => {
    const registerApi = `/j/Req_Fpwd_oneTimePwd.aspx`;
    if (data.countryCode === 886) {
      data.phoneNumber = data.phoneNumber.substr(1);
    }
    try {
      const res = await fetch(registerApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: data.countryCode,
          reg_tel: data.phoneNumber,
        }),
      });
      const resData = await res.json();

      if (resData.code === 200) {
        dispatch({ type: IS_SEND_VALID_CODE, payload: true });
        const expiresStamp = 120000;
        const expiresDate = Date.now() + expiresStamp;

        localStorage.setItem('expiresIn', expiresDate);
        dispatch({ type: SET_EXPIRED_TIME, payload: expiresDate });
      } else {
        dispatch({ type: IS_SEND_VALID_CODE, payload: false });
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // 確認驗證碼是否正確 step-2
  const checkValidCode = async data => {
    dispatch({ type: SET_AUTH_LOADING, payload: true });
    if (data.countryCode === 886) {
      data.phoneNumber = data.phoneNumber.substr(1);
    }

    const checkValidApi = `/j/ChkoneTimePwd.aspx`;

    try {
      const res = await fetch(checkValidApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: data.countryCode,
          reg_tel: data.phoneNumber,
          OneTimePwd: data.validCode,
        }),
      });

      const resData = await res.json();

      dispatch({ type: SET_AUTH_LOADING, payload: false });

      if (resData.code === 200) {
        dispatch({ type: SET_VALID_TOKEN, payload: resData.data });
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // 設定新密碼 step-3
  const forgetPassword = async data => {
    dispatch({ type: SET_AUTH_LOADING, payload: true });

    const setNewPwApi = `/j/Req_ForgotPwd.aspx`;

    try {
      const res = await fetch(setNewPwApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: data.countryCode,
          reg_tel: data.phoneNumber,
          reg_pwd: data.password,
          reg_token: data.token,
        }),
      });

      const resData = await res.json();

      dispatch({ type: SET_AUTH_LOADING, payload: false });

      if (resData.code === 200) {
        dispatch({
          type: SHOW_ERROR_MODAL,
          payload: { show: true, text: '密碼設定成功', status: 'success' },
        });

        dispatch({
          type: REMOVE_VALID_TOKEN,
        });
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  // 更換密碼
  const changePw = async data => {
    const changePwApi = `/j/Req_ChgPwd.aspx`;
    const headers = getHeader();

    try {
      const res = await fetch(changePwApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Login_pwd: data.oldPw,
          New_pwd: data.newPw,
        }),
      });

      const resData = await res.json();

      if (resData !== 200) {
        handleHttpError(resData);
      } else {
        alert('密碼已經更換');
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleHttpError = data => {
    if (data.code === '1') {
      // alert('系統錯誤');
      // dispatch({ type: SET_ERROR_TEXT, payload: '系統錯誤' });
      setErrorText('系統錯誤');
      return;
    }

    if (data.code === '10') {
      // alert('帳號或密碼錯誤');
      // dispatch({ type: SET_ERROR_TEXT, payload: '帳號或密碼錯誤' });
      setErrorText('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      // alert('此帳號已經註冊過');
      // dispatch({ type: SET_ERROR_TEXT, payload: '此帳號已經註冊過' });
      setErrorText('此帳號已經註冊過');

      return;
    }

    if (data.code === '12') {
      // alert('此帳號無法註冊，可能被列入黑名單');
      // dispatch({ type: SET_ERROR_TEXT, payload: '此帳號無法註冊' });
      setErrorText('此帳號無法註冊');

      return;
    }

    if (data.code === '13') {
      // alert('json格式錯誤');
      // dispatch({ type: SET_ERROR_TEXT, payload: 'json格式錯誤' });
      setErrorText('json格式錯誤');

      return;
    }
    if (data.code === '14') {
      // alert('json格式錯誤');
      // dispatch({ type: SET_ERROR_TEXT, payload: 'json格式錯誤' });
      setErrorText('json格式錯誤');

      return;
    }

    if (data.code === '15') {
      // alert('無效的token');
      // dispatch({ type: SET_ERROR_TEXT, payload: '無效的token' });
      setErrorText('無效的token');

      return;
    }

    if (data.code === '16') {
      // alert('錯誤的操作');
      // dispatch({ type: SET_ERROR_TEXT, payload: '錯誤的操作' });
      setErrorText('錯誤的操作');

      return;
    }

    if (data.code === '17') {
      // alert('帳號未註冊');
      // dispatch({ type: SET_ERROR_TEXT, payload: '帳號未註冊' });
      setErrorText('帳號未註冊');

      return;
    }

    if (data.code === '20') {
      // alert('數據格式錯誤');
      // dispatch({ type: SET_ERROR_TEXT, payload: '數據格式錯誤' });
      setErrorText('數據格式錯誤');

      return;
    }

    if (data.code === '21') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: '請勿連續發送請求', status: 'fail' },
      });

      // dispatch({ type: SET_ERROR_TEXT, payload: '請勿連續發送請求' });
      setErrorText('請勿連續發送請求');

      // alert('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: '驗證碼錯誤', status: 'fail' },
      });
      // dispatch({ type: SET_ERROR_TEXT, payload: '驗證碼錯誤' });
      setErrorText('驗證碼錯誤');
      // alert('驗證碼錯誤');

      return;
    }

    if (data.code === '30') {
      alert('無效的錢包地址');
      return;
    }

    if (data.code === '31') {
      alert('不能轉帳給自己');
      return;
    }

    if (data.code === 'ˇ32') {
      alert('可提不足');
      return;
    }

    if (data.code === 'ˇ91') {
      alert('session過期，請重新登入');
      history.replace('/auth/login');
      localStorage.removeItem('token');
      localStorage.removeItem('agent');
      localStorage.removeItem('loglevel');
      return;
    }
  };

  // set countdown btn
  const setCountDown = value => {
    dispatch({ type: IS_SEND_VALID_CODE, payload: value });
    dispatch({ type: SET_EXPIRED_TIME, payload: null });
  };

  const cleanErr = () => {
    dispatch({ type: SHOW_ERROR_MODAL, payload: { show: false, text: '', status: null } });
  };

  const removeValidToken = () => {
    dispatch({ type: REMOVE_VALID_TOKEN });
  };

  const setAgent = value => {
    dispatch({ type: SET_AGENT, payload: value });
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        isSendValidCode: state.isSendValidCode,
        validToken: state.validToken,
        authLoading: state.authLoading,
        showErrorModal: state.showErrorModal,
        expiredTime: state.expiredTime,
        loginLoading: state.loginLoading,
        errorText: state.errorText,
        isAgent: state.isAgent,

        handleHttpError,
        changePw,
        getValidCode,
        checkValidCode,
        cleanErr,
        forgetPassword,
        removeValidToken,
        setCountDown,
        login,
        setErrorText,
        logout,
        setAgent,
        autoLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
