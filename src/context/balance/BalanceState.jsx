import { useReducer } from 'react';

import BalanceReducer from './BalanceReducer';
import BalanceContext from './BalanceContext';

import { SET_BALANCE } from '../type';

const BalanceState = props => {
  const initialState = {
    avb: null, //可提
    real: null, //結餘
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

  // get avb and real
  const getBalance = async () => {
    const headers = getHeader();
    const balanceApi = '/j/ChkBalance.aspx';

    try {
      const res = await fetch(balanceApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        const { data } = resData;
        dispatch({ type: SET_BALANCE, payload: data });
        return data;
      } else {
        alert(resData.msg);
      }
    } catch (error) {
      alert(error);
    }
  };

  const [state, dispatch] = useReducer(BalanceReducer, initialState);

  return (
    <BalanceContext.Provider
      value={{
        avb: state.avb,
        real: state.real,

        getBalance,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  );
};

export default BalanceState;
