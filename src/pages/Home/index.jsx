import React, { useState, useEffect, useContext } from "react";
import {
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";

// Context
import AuthContext from "../../context/auth/AuthContext";
import HttpErrorContext from "../../context/httpError/HttpErrorContext";

// Components
import Transaction from "../../pages/Transaction";
import Header from "../../Components/Layout/Header";
import TheNav from "../../Components/Layout/TheNav";
import MoneyRecord from "../../Components/MoneyRecord";
import Overview from "../../Components/Overview";
import TheWallet from "../../Components/Wallet/TheWallet";
import WalletDetail from "../../Components/Wallet/WalletDetail";
import History from "../../Components/History";
import InstantDetail from "../../Components/Instant/InstantDetail";
import InstantScreen from "../../pages/InstantScreen";
import MemberLevelAlert from "../../Components/member-level-alert/MemberLevelAlert";
import kycForm from '../../Components/Kyc/KycValidForm'

// Style
import style from "../../Components/Layout/Header.module.scss";

const HomeScreen = () => {
  // Router Props
  const history = useHistory();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // AuthContext
  const authContext = useContext(AuthContext);
  const { logout, setAgent, autoLogout } = authContext;

  // Init State
  const [token, setToken] = useState(null);

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    const token = localStorage.getItem("token");
    const agent = localStorage.getItem("agent");

    if (!token) {
      history.replace("/auth/login");
      return;
    }

    setToken(token);
    if (agent) {
      setAgent(true);
      autoLogout();
    }
    if (location.pathname === "/home" || location.pathname === "/home/")
      history.replace("/home/overview");
    // 每小時確認一次agent帳號的過期時間
    let checkAgentExpires = setInterval(() => {
      autoLogout();
    }, 1000 * 60 * 60);
    return () => {
      clearInterval(checkAgentExpires);
    };
    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setText("");
  };

  useEffect(() => {
    if (
      errorText === "交易額度不足/30天" ||
      errorText === "交易額度不足/每次"
    ) {
      setText(errorText);
      setShowModal(true);
      return;
    }

    if (errorText) alert(errorText);
    return () => {
      setHttpError("");
    };
    // eslint-disable-next-line
  }, [errorText]);

  return (
    <>
      <MemberLevelAlert
        handleClose={handleClose}
        errorText={text}
        show={showModal}
        setShow={setShowModal}
      />

      <Header history={history} token={token}>
        <Link to="/home" className={style.logoLink}>
          <div
            host={process.env.REACT_APP_HOST_NAME || "K100U"}
            className={style.logo}
          ></div>
        </Link>
        <TheNav logout={logout} />
      </Header>

      <MoneyRecord />

      <Switch>
        <Route exact path="/home/overview" component={Overview} />
        <Route exact path="/home/kyc-valid" component={kycForm} />
        <Route exact path="/home/wallet" component={TheWallet} />
        <Route exact path="/home/wallet/:id" component={WalletDetail} />
        <Route path="/home/history" component={History} />
        <Route path="/home/transaction" component={Transaction} />
        <Route exact path="/home/instant" component={InstantScreen} />
        <Route exact path="/home/instant/:type/:id" component={InstantDetail} />
        <Redirect to="/home/overview" />
      </Switch>
    </>
  );
};

export default React.memo(HomeScreen);
