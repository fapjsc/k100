import { useReducer } from 'react';

import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';

import {
  IS_SEND_VALID_CODE,
  SET_VALID_TOKEN,
  SET_AUTH_LOADING,
  SHOW_ERROR_MODAL,
  REMOVE_VALID_TOKEN,
} from '../type';

const AuthState = props => {
  const initialState = {
    isSendValidCode: false,
    validToken: null,
    authLoading: false,
    showErrorModal: {
      show: false,
      text: '',
      status: '',
    },
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('login_session', token);

      return headers;
    } else {
      return;
    }
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
      console.log(resData);

      if (resData.code === 200) {
        dispatch({ type: IS_SEND_VALID_CODE, payload: true });
        const expiresStamp = 120000;
        const expiresDate = Date.now() + expiresStamp;
        localStorage.setItem('expiresIn', expiresDate);
      } else {
        dispatch({ type: IS_SEND_VALID_CODE, payload: false });
        handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
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

      console.log(resData);

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

    console.log(data);

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
      console.log(error);
    }
  };

  const handleHttpError = data => {
    if (data.code === '1') {
      alert('系統錯誤');
      return;
    }

    if (data.code === '10') {
      alert('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      alert('此帳號已經註冊過');
      return;
    }

    if (data.code === '12') {
      alert('此帳號無法註冊，可能被列入黑名單');
      return;
    }

    if (data.code === '13') {
      alert('json格式錯誤');
      return;
    }
    if (data.code === '14') {
      alert('json格式錯誤');
      return;
    }

    if (data.code === '15') {
      alert('無效的token');
      return;
    }

    if (data.code === '16') {
      alert('錯誤的操作');
      return;
    }

    if (data.code === '17') {
      alert('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      alert('數據格式錯誤');
      return;
    }

    if (data.code === '21') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: '請勿連續發送請求', status: 'fail' },
      });
      // alert('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      dispatch({
        type: SHOW_ERROR_MODAL,
        payload: { show: true, text: '驗證碼錯誤', status: 'fail' },
      });
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
      return;
    }
  };

  const cleanErr = () => {
    dispatch({ type: SHOW_ERROR_MODAL, payload: { show: false, text: '', status: null } });
  };

  const removeValidToken = () => {
    dispatch({ type: REMOVE_VALID_TOKEN });
  };

  // const changePassword = async () => {
  //   const changePwApi = `/j/Req_ChgPwd.aspx`
  //   const headers = getHeader()

  //   const res = await fetch(changePwApi, {
  //     method: "POST",
  //     headers,

  //   })
  // }

  // get avb and real

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        isSendValidCode: state.isSendValidCode,
        validToken: state.validToken,
        authLoading: state.authLoading,
        showErrorModal: state.showErrorModal,

        handleHttpError,
        changePw,
        getValidCode,
        checkValidCode,
        cleanErr,
        forgetPassword,
        removeValidToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
