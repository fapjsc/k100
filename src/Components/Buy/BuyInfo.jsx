import { useContext, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import BaseSpinner from '../Ui/BaseSpinner';
import ExRate from './ExRate';
import BuyDetail from './BuyDetail';
import BuyComplete from './BuyComplete';
import FormFooter from '../Layout/FormFooter';

const BuyInfo = () => {
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const {
    buyWsData,
    buyConnectWs,
    setOrderToken,
    wsStatus,
    cleanAll,
    closeWebSocket,
    setWsStatus,
  } = buyContext;

  useEffect(() => {
    const orderToken = match.params.id;
    if (orderToken) {
      buyConnectWs(orderToken);
      setOrderToken(orderToken);
    }

    return () => {
      closeWebSocket();
      cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  const backToHome = () => {
    history.replace('/home/overview');
  };

  return (
    <>
      <ExRate />

      {wsStatus === 33 && buyWsData ? (
        <>
          <BuyDetail />
        </>
      ) : (wsStatus === 34 || wsStatus === 1 || wsStatus === 99 || wsStatus === 98) && buyWsData ? (
        <BuyComplete wsStatus={wsStatus} hash={buyWsData.hash} backToHome={backToHome} />
      ) : (
        <BaseSpinner />
      )}

      <FormFooter />
    </>
  );
};

export default BuyInfo;
