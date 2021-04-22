import { useReducer } from 'react';

import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';

import {} from '../type';

const AuthState = props => {
  const initialState = {};

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
      alert('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      alert('無效的一次性驗證碼');
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

  return <AuthContext.Provider value={{ handleHttpError }}>{props.children}</AuthContext.Provider>;
};

export default AuthState;
