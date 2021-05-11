import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import SellContext from '../../context/sell/SellContext';

import SellHeaders from './SellHeader';
import SellForm from './SellForm';
import Pairing from './Pairing';

const Sell = () => {
  const history = useHistory();
  const sellContext = useContext(SellContext);
  const { wsPairing, wsData, CleanAll, wsClient, sellStatus, orderToken } = sellContext;

  useEffect(() => {
    if (wsClient) wsClient.close();
    return () => {
      if (wsClient) wsClient.close();
      CleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sellStatus === 33) history.replace(`/home/transaction/sell/${orderToken}`);
    // eslint-disable-next-line
  }, [sellStatus]);

  const backHome = () => {
    if (wsClient) wsClient.close();
    // setWsPairing(false);
    history.replace('/home/overview');
    CleanAll();
  };

  return (
    <Fragment>
      <SellHeaders />
      <Pairing
        show={wsPairing && wsClient}
        onHide={backHome}
        title="請稍等，現正整合交易者資料"
        text={
          wsData &&
          `出售訂單：${Math.abs(wsData.UsdtAmt).toFixed(2)} USDT = $${wsData.D2.toFixed(2)} CNY`
        }
      />
      <SellForm />
    </Fragment>
  );
};

export default Sell;
