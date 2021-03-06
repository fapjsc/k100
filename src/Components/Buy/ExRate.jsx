import { useContext, useEffect } from "react";

// Context
import { useI18n } from "../../lang";
import SellContext from "../../context/sell/SellContext";
import BalanceContext from "../../context/balance/BalanceContext";

import {usdtThousandBitSeparatorNonAbs} from '../../lib/utils'

const ExRate = (props) => {
  // Lang Context
  const { t } = useI18n();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getExRate, buyRate } = sellContext;

  const balanceContext = useContext(BalanceContext);
  const { level } = balanceContext;

  const { title } = props;
  useEffect(() => {
    getExRate();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <p
        style={{
          letterSpacing: "1.5px",
          color: "#3242e47",
          fontSize: "12px",
        }}
      >
        {title}
      </p>
      <div className="pay-info txt_12 mb-4">
        <p className="mb-0">
          {t("exRate")} :<span>{buyRate && Number(buyRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          {t("payment_contact")} :<span>{t("payment_contact_time")}</span>
        </p>

        <p className="mb-0">
          {t("limit")} :
          {level?.day === 0 && (
            <span style={{ color: "red" }}>帳號已鎖定，無法交易</span>
          )}
          
          {level?.day !== 0 && (
            <span>
              {t("limit_usdt")} {usdtThousandBitSeparatorNonAbs(level?.day)}
            </span>
          )}
        </p>

       
      </div>
    </>
  );
};

export default ExRate;
