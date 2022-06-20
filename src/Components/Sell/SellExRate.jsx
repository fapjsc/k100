import { Fragment, useContext, useEffect } from "react";

// Context
import SellContext from "../../context/sell/SellContext";
import BalanceContext from "../../context/balance/BalanceContext";

// Lang Context
import { useI18n } from "../../lang";

const SellHeader = () => {
  // Lang Context
  const { t } = useI18n();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { exRate, getExRate } = sellContext;

  const balanceContext = useContext(BalanceContext);
  const { level } = balanceContext;

  useEffect(() => {
    getExRate();

    // eslint-disable-next-line
  }, [exRate]);

  return (
    <Fragment>
      <p
        style={{
          letterSpacing: "1.5px",
          color: "#3242e47",
          fontSize: "12px",
        }}
      >
        {t("sell_usdt")}
      </p>
      <div className="pay-info txt_12">
        <p className="mb-0">
          {t("exRate")} :<span>{Number(exRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          {t("payment_contact")}:<span>{t("payment_contact_time")}</span>
        </p>

        <p className="mb-0">
          {t("limit")} :
          {level === 0 && (
            <span style={{ color: "red" }}>帳號已鎖定，無法交易</span>
          )}
          {level !== 0 && (
            <span>
              {t("limit_usdt")} {level?.toFixed(2)}
            </span>
          )}
        </p>

        {/* {process.env.REACT_APP_HOST_NAME === "88U" && (
          <p className="mb-0">
            {t("limit")} :
            {level === 0 && (
              <span style={{ color: "red" }}>帳號已鎖定，無法交易</span>
            )}
            {level !== 0 && (
              <span>
                {t("limit_usdt")} {level?.toFixed(2)}
              </span>
            )}
          </p>
        )} */}

        {process.env.REACT_APP_HOST_NAME !== "88U" && (
          <p className="mb-0">
            {t("limit")} :<span>{t("limit_usdt")} 10000.00</span>
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default SellHeader;
