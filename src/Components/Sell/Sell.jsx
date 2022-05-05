import { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

// context
import SellContext from "../../context/sell/SellContext";

// Lang Context
import { useI18n } from "../../lang";

// Utils
import { locationMoneyPrefix } from "../../lib/utils";

// Components
import SellExRate from "./SellExRate";
import SellForm from "./SellForm";
import SellBankForm from "./SellBankForm";
import Pairing from "./Pairing";
import FormFooter from "../Layout/FormFooter";

const Sell = () => {
  // Lang context
  const { t } = useI18n();

  // Router Props
  const history = useHistory();

  // Sell Context
  const sellContext = useContext(SellContext);
  const {
    wsPairing,
    wsData,
    cleanAll,
    wsClient,
    sellStatus,
    orderToken,
    showBank,
    cancelOrder,
  } = sellContext;

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    if (wsClient) wsClient.close();
    return () => {
      if (wsClient) wsClient.close();
      cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sellStatus === 33)
      history.replace(`/home/transaction/sell/${orderToken}`);
    // eslint-disable-next-line
  }, [sellStatus]);

  const onHide = () => {
    if (orderToken) cancelOrder(orderToken);
    if (wsClient) wsClient.close();
    // setWsPairing(false);
    history.replace("/home/overview");
    cleanAll();
  };

  return (
    <Fragment>
      <SellExRate />
      <SellForm />
      {showBank && <SellBankForm />}
      <FormFooter />
      <Pairing
        show={wsPairing && wsClient}
        onHide={onHide}
        title={t("pair_title")}
        text={
          wsData &&
          `${t("pair_text")}：${Math.abs(wsData.UsdtAmt).toFixed(
            2
          )} USDT = ${wsData.D2.toFixed(2)} ${locationMoneyPrefix()}`
        }
      />
    </Fragment>
  );
};

export default Sell;
