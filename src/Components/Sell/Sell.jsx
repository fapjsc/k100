import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// context
import SellContext from '../../context/sell/SellContext';

// Components
import SellExRate from './SellExRate';
import SellForm from './SellForm';
import SellBankForm from './SellBankForm';
import Pairing from './Pairing';
import FormFooter from '../Layout/FormFooter';

const Sell = () => {
  // Router Props
  const history = useHistory();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsPairing, wsData, cleanAll, wsClient, sellStatus, orderToken, showBank, cancelOrder } =
    sellContext;

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
    if (sellStatus === 33) history.replace(`/home/transaction/sell/${orderToken}`);
    // eslint-disable-next-line
  }, [sellStatus]);

  const onHide = () => {
    if (orderToken) cancelOrder(orderToken);
    if (wsClient) wsClient.close();
    // setWsPairing(false);
    history.replace('/home/overview');
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
        title="請稍等，現正整合交易者資料"
        text={
          wsData &&
          `出售訂單：${Math.abs(wsData.UsdtAmt).toFixed(2)} USDT = $${wsData.D2.toFixed(2)} CNY`
        }
      />
    </Fragment>
  );
};

export default Sell;
