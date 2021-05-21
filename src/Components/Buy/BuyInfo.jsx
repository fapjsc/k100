import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import BaseSpinner from '../Ui/BaseSpinner';
import ExRate from './ExRate';
import BuyDetail from './BuyDetail';
import FormFooter from '../Layout/FormFooter';
// import Chat from '../Chat';
import CompleteStatus from '../universal/CompleteStatus';
import Pairing from './Pairing';
// import BuyComplete from './BuyComplete';
import TheChat from '../Chat/TheChat';
// import TheMobileChat from '../Chat/TheMobileChat';
// import TheChat from '../Chat/TheChat';
// import ChatMobile from '../Chat/ChatMobile';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const BuyInfo = () => {
  // Init State
  const [showChat, setShowChat] = useState(false);

  // Media Query
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' }); // 小於等於 1200 true

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
    GetDeltaTime,
    buyWsClient,
    buyPairing,
    handlePairing,
    buyCount,
    // closeWebSocket,
  } = buyContext;

  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    const orderToken = match.params.id;
    if (orderToken) {
      buyConnectWs(orderToken);
      setOrderToken(orderToken);
    }

    return () => {
      if (buyWsClient) buyWsClient.close();
      cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (wsStatus === 31 || wsStatus === 32) {
      handlePairing(true);
    } else {
      handlePairing(false);
    }
    // eslint-disable-next-line
  }, [wsStatus]);

  useEffect(() => {
    GetDeltaTime(match.params.id);
    // eslint-disable-next-line
  }, [showChat]);

  // ===========
  //  function
  // ===========
  const backToHome = () => {
    history.replace('/home/overview');
    if (buyWsClient) buyWsClient.close();
    cleanAll();
  };

  const onHide = () => {
    handlePairing(false);
    cleanAll();
    history.replace('/home/overview');
  };

  return (
    <div className="">
      <Pairing show={buyPairing} onHide={onHide} usdt={buyCount.usdt} rmb={buyCount.rmb} />
      <ExRate />

      {wsStatus === 33 && buyWsData ? (
        <>
          <BuyDetail />
        </>
      ) : (wsStatus === 34 || wsStatus === 1 || wsStatus === 99 || wsStatus === 98) && buyWsData ? (
        // <BuyComplete wsStatus={wsStatus} hash={buyWsData.hash} backToHome={backToHome} />
        <CompleteStatus
          wsStatus={wsStatus}
          hash={buyWsData.hash}
          backToHome={backToHome}
          type="buy"
        />
      ) : (
        <BaseSpinner />
      )}

      <FormFooter />

      <div>
        {/* 桌機版聊天室 */}
        {buyWsData && !isMobile ? <TheChat isChat={!isMobile} hash={buyWsData.hash} /> : null}

        {/* 手機版聊天室*/}
        {isMobile && buyWsData ? (
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

            <TheChat hash={buyWsData.hash} isChat={showChat} />
          </>
        ) : null}
      </div>
    </div>
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