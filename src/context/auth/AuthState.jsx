import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';

// Lang Context
import { useI18n } from '../../lang';

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
  SET_ACCOUNT_EXISTS,
} from '../type';

const AuthState = props => {
  // Lang Context
  const { t } = useI18n();
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
    accountIsExists: 'notYetConfirm',
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
      // console.log(resData);

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
    setAgent(false);

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

    alert(t('login_again'));

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
      handleHttpError(error);
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
          payload: { show: true, text: t('set_password_success'), status: 'success' },
        });

        dispatch({
          type: REMOVE_VALID_TOKEN,
        });
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
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
        alert(t('password_changed'));
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleHttpError = data => {
    if (data.code === '1') {
      setErrorText(t('http_error_code_1'));
      return;
    }

    if (data.code === '10') {
      setErrorText(t('http_error_code_10'));
      return;
    }

    if (data.code === '11') {
      setErrorText(t('http_error_code_11'));

      return;
    }

    if (data.code === '12') {
      setErrorText(t('http_error_code_12'));

      return;
    }

    if (data.code === '13') {
      setErrorText(t('http_error_code_13'));

      return;
    }
    if (data.code === '14') {
      setErrorText(t('http_error_code_14'));

      return;
    }

    if (data.code === '15') {
      setErrorText(t('http_error_code_15'));

      return;
    }

    if (data.code === '16') {
      setErrorText(t('http_error_code_16'));

      return;
    }

    if (data.code === '17') {
      setErrorText(t('http_error_code_17'));

      return;
    }

    if (data.code === '20') {
      setErrorText(t('http_error_code_20'));

      return;
    }

    if (data.code === '21') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: t('http_error_code_21'), status: 'fail' },
      });

      setErrorText(t('http_error_code_21'));

      return;
    }

    if (data.code === '22') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: t('http_error_code_22'), status: 'fail' },
      });
      setErrorText(t('http_error_code_22'));

      return;
    }

    if (data.code === '30') {
      alert(t('http_error_code_30'));
      return;
    }

    if (data.code === '31') {
      alert(t('http_error_code_31'));
      return;
    }

    if (data.code === 'ˇ32') {
      alert(t('http_error_code_32'));
      return;
    }

    if (data.code === 'ˇ91') {
      alert(t('http_error_code_91'));
      history.replace('/auth/login');
      localStorage.removeItem('token');
      localStorage.removeItem('agent');
      localStorage.removeItem('loglevel');
      return;
    }
  };

  // 驗證帳號是否存在
  const checkAccountExists = async data => {
    console.log(data);
    const checkAccount = `/j/ChkLoginExists.aspx`;

    try {
      const res = await fetch(checkAccount, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: data.countryCode,
          reg_tel: data.phoneNumber,
        }),
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.code === '11') {
        setAccountExists('exists');
        return;
      }

      if (resData.code === 200) {
        setAccountExists('notExists');
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
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

  // 帳號是否已經存在
  const setAccountExists = value => {
    dispatch({ type: SET_ACCOUNT_EXISTS, payload: value });
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
        accountIsExists: state.accountIsExists,

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
        checkAccountExists,
        setAccountExists,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
