import { useReducer, useContext } from 'react';
import WalletReducer from './WalletReducer';
import WalletContext from './WalletContext';
import { SET_WALLET_DATA, SET_WALLET_TYPE } from '../type';

// Context
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

const WalletState = props => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { setHttpLoading, handleHttpError } = httpErrorContext;

  const initialState = {
    walletData: null,
    walletType: '',
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

  const getQrCode = async () => {
    const headers = getHeader();

    if (!headers) return;

    setHttpLoading(true);

    const walletApi = '/j/GetWallet.aspx';

    try {
      const res = await fetch(walletApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        setWalletData(resData.data);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }

    setHttpLoading(false);
  };

  // Set Wallet Data
  const setWalletData = data => {
    dispatch({ type: SET_WALLET_DATA, payload: data });
  };

  // Set Wallet Type
  const setWalletType = type => {
    dispatch({ type: SET_WALLET_TYPE, payload: type });
  };

  const [state, dispatch] = useReducer(WalletReducer, initialState);

  return (
    <WalletContext.Provider
      value={{
        walletData: state.walletData,
        walletType: state.walletType,

        getQrCode,
        setWalletType,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletState;
