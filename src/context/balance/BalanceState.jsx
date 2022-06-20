import { useReducer, useContext } from "react";
import BalanceReducer from "./BalanceReducer";
import BalanceContext from "./BalanceContext";
import { SET_BALANCE, SET_TICK } from "../type";

// Context
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

const BalanceState = (props) => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { setHttpLoading, handleHttpError } = httpErrorContext;

  // Init State
  const initialState = {
    avb: null, //可提
    real: null, //結餘
    level: null,
    tick: null,
  };

  // Get Header
  const getHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("login_session", token);

    return headers;
  };

  // get avb and real
  const getBalance = async () => {
    const headers = getHeader();
    if (!headers) return;

    setHttpLoading(true);

    const balanceApi = "/j/ChkBalance.aspx";

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

  // Get Tick
  const getTick = async (token) => {
    const headers = getHeader();

    if (!token || !headers) return;

    const getTickApi = "/j/ChkUpdate.aspx";

    try {
      const res = await fetch(getTickApi, {
        headers,
      });
      const resData = await res.json();

      if (resData.code === 200) {
        setTick(resData.data.UpdateTick);
      } else {
        handleHttpError(resData);
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  // Set Balance
  const setBalance = (data) => {
    dispatch({ type: SET_BALANCE, payload: data });
  };

  const setTick = (tick) => {
    dispatch({ type: SET_TICK, payload: tick });
  };

  const [state, dispatch] = useReducer(BalanceReducer, initialState);

  return (
    <BalanceContext.Provider
      value={{
        avb: state.avb,
        real: state.real,
        tick: state.tick,
        level: state.level,

        getBalance,
        setBalance,
        getTick,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  );
};

export default BalanceState;
