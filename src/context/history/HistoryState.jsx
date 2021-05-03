import { useReducer } from 'react';
import HistoryReducer from './HistoryReducer';
import HistoryContext from './HistoryContext';

import { SET_ALL_HISTORY, SET_SINGLE_DETAIL, SET_WAIT_HISTORY } from '../type';

const HistoryState = props => {
  const initialState = {
    allHistory: [],
    waitList: [],
    singleDetail: null,
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

  // Get History Wait
  const setWaitList = async () => {
    const headers = getHeader();

    const historyApi = '/j/GetTxPendings.aspx';

    try {
      const res = await fetch(historyApi, {
        headers,
      });

      const resData = await res.json();

      if (resData.code === 200) {
        const { data } = resData;
        console.log(data);

        const newData = data.map(h => {
          if (h.MasterType === 0) {
            h.MasterType = '買入';
            return h;
          } else if (h.MasterType === 1) {
            h.MasterType = '賣出';
            return h;
          } else if (h.MasterType === 2) {
            h.MasterType = '轉出';
            return h;
          } else {
            h.MasterType = '轉入';
            return h;
          }
        });

        dispatch({ type: SET_WAIT_HISTORY, payload: newData });
      } else {
        alert(resData.msg);
      }
    } catch (error) {
      alert(error);
    }
  };

  // get history all
  const getHistoryAll = async () => {
    const headers = getHeader();

    const historyApi = '/j/GetTxHistory.aspx';

    try {
      const res = await fetch(historyApi, {
        headers,
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.code === 200) {
        dispatch({ type: SET_ALL_HISTORY, payload: resData.data });
      } else {
        alert(resData.msg);
      }
    } catch (error) {
      alert(error);
    }
  };

  // get single detail
  const detailReq = async detailToken => {
    const headers = getHeader();

    const detailApi = '/j/GetTxDetail.aspx';

    try {
      const res = await fetch(detailApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: detailToken,
        }),
      });
      const resData = await res.json();

      console.log(resData);

      if (resData.code === 200) {
        const { data } = resData;

        // buy and sell
        if (data.MasterType === 1 || data.MasterType === 0) {
          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            account: data.P1,
            payee: data.P2,
            bank: data.P3,
            branch: data.P4,
            exchangePrice: data.D1,
            rmb: data.D2,
            charge: data.D3,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };

          setSingleDetail(orderDetail);
        }

        // 轉出
        if (data.MasterType === 2) {
          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            receivingAddress: data.P1,
            charge: data.D1,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };
          setSingleDetail(orderDetail);
        }

        // 轉入
        if (data.MasterType === 3) {
          const orderDetail = {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          };
          setSingleDetail(orderDetail);
        }

        // handle error
      } else {
        alert(resData.msg);
      }
    } catch (error) {
      alert(error);
    }
  };

  const setSingleDetail = orderDetail => {
    dispatch({ type: SET_SINGLE_DETAIL, payload: orderDetail });
  };

  const [state, dispatch] = useReducer(HistoryReducer, initialState);

  return (
    <HistoryContext.Provider
      value={{
        allHistory: state.allHistory,
        singleDetail: state.singleDetail,
        waitList: state.waitList,

        getHistoryAll,
        detailReq,
        setWaitList,
      }}
    >
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryState;
