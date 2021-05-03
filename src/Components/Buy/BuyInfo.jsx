import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import BaseSpinner from '../Ui/BaseSpinner';
import ExRate from './ExRate';
import BuyDetail from './BuyDetail';
import BuyComplete from './BuyComplete';
import FormFooter from '../Layout/FormFooter';
import Chat from '../Chat';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const BuyInfo = () => {
  // Init State
  const [showChat, setShowChat] = useState(false);

  // Media Query
  const isDesktopOrLaptop = useMediaQuery({ query: '(max-width: 1200px)' }); // 小於等於 1200 true

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
    GetDeltaTime,
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

  useEffect(() => {
    GetDeltaTime(match.params.id);
    // eslint-disable-next-line
  }, [showChat]);

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

      {/* 手機版聊天室*/}
      {isDesktopOrLaptop && buyWsData ? (
        <>
          <Button style={helpBtn} variant="primary" onClick={() => setShowChat(!showChat)}>
            <img
              style={{
                width: 15,
                height: 20,
                marginRight: 8,
              }}
              src={helpIcon}
              alt="help icon"
            />
            幫助
          </Button>
          <Chat Tx_HASH={buyWsData.hash} isChat={showChat} />
        </>
      ) : null}

      {/* 桌機版聊天室 */}
      {buyWsData && <Chat isChat={!isDesktopOrLaptop} Tx_HASH={buyWsData.hash} />}

      <FormFooter />
    </>
  );
};

const helpBtn = {
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 5,
  paddingBottom: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '1rem 2rem',
  fontSize: '1.5rem',
  fontWeight: 300,
  borderRadius: '10rem',
  position: 'fixed',
  bottom: '5%',
  right: '5%',
  backgroundColor: '#F80FA',
};

export default BuyInfo;
