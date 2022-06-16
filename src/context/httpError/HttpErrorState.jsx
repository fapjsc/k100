import { useReducer } from "react";
import { useHistory } from "react-router-dom";

import HttpErrorReducer from "./HttpErrorReducer";
import HttpErrorContext from "./HttpErrorContext";

// Lang Context
import { useI18n } from "../../lang";

import { SET_HTTP_ERROR, SET_HTTP_LOADING, SET_BUTTON_LOADING } from "../type";

const HttpErrorState = (props) => {
  // Lang Context
  const { t } = useI18n();
  // Router Props
  const history = useHistory();

  // Init State
  const initialState = {
    errorText: "",
    httpLoading: false,
    btnLoading: false,
  };

  const setHttpError = (value) => {
    dispatch({ type: SET_HTTP_ERROR, payload: value });
  };

  const setHttpLoading = (value) => {
    dispatch({ type: SET_HTTP_LOADING, payload: value });
  };

  const setBtnLoading = (value) => {
    dispatch({ type: SET_BUTTON_LOADING, payload: value });
  };

  const handleHttpError = (data) => {
    if (!data?.code) return;
    if (data.code === "1") {
      setHttpError(t("http_error_code_1"));
      return;
    }

    if (data.code === "10") {
      setHttpError(t("http_error_code_10"));
      return;
    }

    if (data.code === "11") {
      setHttpError(t("http_error_code_11"));
      return;
    }

    if (data.code === "12") {
      setHttpError(t("http_error_code_12"));
      return;
    }

    if (data.code === "13") {
      setHttpError(t("http_error_code_13"));
      return;
    }
    if (data.code === "14") {
      setHttpError(t("http_error_code_14"));
      return;
    }

    if (data.code === "15") {
      setHttpError(t("http_error_code_15"));
      return;
    }

    if (data.code === "16") {
      setHttpError(t("http_error_code_16"));
      history.replace("/home/overview");
      return;
    }

    if (data.code === "17") {
      setHttpError(t("http_error_code_17"));
      return;
    }

     if (data.code === "18") {
      setHttpError(`Unknown Error: ${data.message}`);
      return;
    }

    if (data.code === "20") {
      setHttpError(t("http_error_code_20"));
      history.replace("/home/overview");
      return;
    }

    if (data.code === "21") {
      setHttpError(t("http_error_code_21"));
      return;
    }

    if (data.code === "22") {
      setHttpError(t("http_error_code_22"));
      return;
    }

    if (data.code === "30") {
      setHttpError(t("http_error_code_30"));
      return;
    }

    if (data.code === "31") {
      setHttpError(t("http_error_code_31"));
      return;
    }
    if (data.code === "32") {
      setHttpError(t("http_error_code_32"));
      return;
    }

    if (data.code === "41") {
      setHttpError(t("http_error_code_41"));
      return;
    }

    if (data.code === "42") {
      setHttpError(t("http_error_code_42"));
      return;
    }

    if (data.code === "91") {
      setHttpError(t("http_error_code_91"));
      history.replace("/auth/login");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("agent");
      localStorage.removeItem("loglevel");
      setHttpError("");
      return;
    }

    setHttpError(t("http_error_other"));
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("agent");
    localStorage.removeItem("loglevel");
    history.replace("/auth/login");

    setHttpError("");
  };

  const [state, dispatch] = useReducer(HttpErrorReducer, initialState);

  return (
    <HttpErrorContext.Provider
      value={{
        errorText: state.errorText,
        httpLoading: state.httpLoading,
        btnLoading: state.btnLoading,

        handleHttpError,
        setHttpError,
        setHttpLoading,
        setBtnLoading,
      }}
    >
      {props.children}
    </HttpErrorContext.Provider>
  );
};

export default HttpErrorState;
