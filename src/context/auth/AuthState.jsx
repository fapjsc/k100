import { useReducer } from 'react';

import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';

import {} from '../type';

const BalanceState = props => {
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

  return <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>;
};

export default BalanceState;
