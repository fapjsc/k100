import { useReducer, useContext } from 'react';
import BalanceReducer from './BalanceReducer';
import BalanceContext from './BalanceContext';
import { SET_BALANCE } from '../type';

// Context
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

const BalanceState = props => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { setHttpLoading, handleHttpError } = httpErrorContext;

  // Init State
  const initialState = {
    avb: null, //可提
    real: null, //結餘
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

  // get avb and real
  const getBalance = async () => {
    const headers = getHeader();
    if (!headers) return;

    setHttpLoading(true);

    const balanceApi = '/j/ChkBalance.aspx';

    try {
      const res = await fetch(balanceApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        const { data } = resData;
        setBalance(data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }

    setHttpLoading(false);
  };

  // Set Balance
  const setBalance = data => {
    dispatch({ type: SET_BALANCE, payload: data });
  };

  const [state, dispatch] = useReducer(BalanceReducer, initialState);

  return (
    <BalanceContext.Provider
      value={{
        avb: state.avb,
        real: state.real,

        getBalance,
        setBalance,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  );
};

export default BalanceState;
