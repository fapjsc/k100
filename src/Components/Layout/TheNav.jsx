import { useContext } from "react";
import { Link } from "react-router-dom";

// Context
import BuyContext from "../../context/buy/BuyContext";
import SellContext from "../../context/sell/SellContext";
import InstantContext from "../../context/instant/InstantContext";
import { useI18n } from "../../lang/index";

// Style
import { Nav } from "react-bootstrap";
import style from "./Header.module.scss";
// import InstantCount from '../Instant/InstantCount';

const TheNav = (props) => {
  // Lang Context
  const { t } = useI18n();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsClient } = buyContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsClient } = sellContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { wsStatusClient } = instantContext;

  // Auth Context
  // const authContext = useContext(AuthContext);
  // // const { setIsLogout } = authContext;

  const handleClick = () => {
    if (buyWsClient) buyWsClient.close();
    if (wsClient) wsClient.close();
    if (wsStatusClient) wsStatusClient.close();
  };

  const handleLogout = () => {
    if (window.confirm(t("nav_logout_alert"))) props.logout();
  };

  return (
    <Nav className={style.navList}>
      {process.env.REACT_APP_HOST_NAME === "88U" && (
        <>
          <Link
            to="/home/kyc-valid"
            className={style.navLink}
            onClick={handleClick}
          >
            實名驗證
          </Link>
          <span
            style={{
              color: "#fff",
            }}
          >
            |
          </span>
        </>
      )}
      <Link
        to="/home/transaction"
        className={style.navLink}
        onClick={handleClick}
      >
        {t("nav_transaction")}
      </Link>
      <span
        style={{
          color: "#fff",
        }}
      >
        |
      </span>
      <Link
        to="/home/history/all"
        className={style.navLink}
        onClick={handleClick}
      >
        {t("nav_history")}
      </Link>
      <span
        style={{
          color: "#fff",
        }}
      >
        |
      </span>
      <Link to="/home/wallet" className={style.navLink} onClick={handleClick}>
        {t("nav_wallet")}
      </Link>
      <span
        style={{
          color: "#fff",
        }}
      >
        |
      </span>

      <Link
        to="#"
        onClick={handleLogout}
        style={{ marginRight: 0 }}
        className={style.navLink}
      >
        {t("nav_logout")}
      </Link>
    </Nav>
  );
};

export default TheNav;
