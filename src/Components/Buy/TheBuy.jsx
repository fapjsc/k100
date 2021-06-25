import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import BuyContext from '../../context/buy/BuyContext';
import SellContext from '../../context/sell/SellContext';
import { useI18n } from '../../lang';

// component
import Pairing from './Pairing';
import ExRate from './ExRate';
import BaseSpinner from '../Ui/BaseSpinner';
import BuyForm from './BuyForm';
import BankForm from './BankForm';
import FormFooter from '../Layout/FormFooter';

const TheBuy = () => {
  // Get Router Props
  const history = useHistory();

  // Lang Context
  const { t } = useI18n();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { buyRate } = sellContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const {
    buyCount,
    handlePairing,
    showBank,
    buyPairing,
    buyOrderToken,
    buyConnectWs,
    cleanAll,
    wsStatus,
    cancelOrder,
    // setWsStatus,
  } = buyContext;

  // Listen Web Socket Status
  useEffect(() => {
    if (wsStatus === 33) history.replace(`/home/transaction/buy/${buyOrderToken}`);

    // eslint-disable-next-line
  }, [wsStatus]);

  // 連接web socket
  useEffect(() => {
    if (buyOrderToken) {
      buyConnectWs(buyOrderToken);
    }

    // eslint-disable-next-line
  }, [buyOrderToken]);

  const onHide = () => {
    if (buyOrderToken) cancelOrder(buyOrderToken);
    handlePairing(false);
    cleanAll();
    history.replace('/home/overview');
  };
  return (
    <>
      <ExRate title={t('buy_usdt')} />
      {buyRate ? <BuyForm /> : <BaseSpinner />}
      {showBank && <BankForm />}
      <FormFooter />
      <Pairing show={buyPairing} onHide={onHide} usdt={buyCount.usdt} rmb={buyCount.rmb} />
    </>
  );
};

export default TheBuy;
