import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import BaseSpinner from '../Ui/BaseSpinner';
import ExRate from './ExRate';
import BuyDetail from './BuyDetail';
// import BuyComplete from './BuyComplete';
import FormFooter from '../Layout/FormFooter';
import Chat from '../Chat';
// import TheChat from '../Chat/TheChat';
// import TheMobileChat from '../Chat/TheMobileChat';
import CompleteStatus from '../universal/CompleteStatus';
// import TheChat from '../Chat/TheChat';
// import ChatMobile from '../Chat/ChatMobile';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const BuyInfo = () => {
  // Init State
  const [showChat, setShowChat] = useState(false);

  // eslint-disable-next-line
  const [state, setState] = useState({
    messageList: [],
    newMessagesCount: 0,
    isOpen: false,
    fileUpload: true,
  });

  // function onMessageWasSent(message) {
  //   setState(state => ({
  //     ...state,
  //     messageList: [...state.messageList, message],
  //   }));
  // }

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
    // closeWebSocket,
    GetDeltaTime,
    buyWsClient,
  } = buyContext;

  useEffect(() => {
    const orderToken = match.params.id;
    if (orderToken) {
      buyConnectWs(orderToken);
      setOrderToken(orderToken);
    }

    return () => {
      if (buyWsClient) buyWsClient.close();
      cleanAll();
      // cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    GetDeltaTime(match.params.id);
    // eslint-disable-next-line
  }, [showChat]);

  const backToHome = () => {
    console.log(buyWsClient);
    history.replace('/home/overview');
    if (buyWsClient) buyWsClient.close();
    cleanAll();
  };

  return (
    <>
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

      {/* 桌機版聊天室 */}
      {buyWsData && <Chat isChat={!isDesktopOrLaptop} Tx_HASH={buyWsData.hash} />}
      {/* {buyWsData && !isDesktopOrLaptop ? <TheChat Tx_HASH={buyWsData.hash} /> : null} */}

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

          {/* 手機版 */}
          <Chat Tx_HASH={buyWsData.hash} isChat={showChat} />
          {/* <TheMobileChat hash={buyWsData.hash} isChat={showChat} /> */}
        </>
      ) : null}

      {/* 桌機版聊天室 */}
      {buyWsData && <Chat isChat={!isDesktopOrLaptop} Tx_HASH={buyWsData.hash} />}
      {/* {buyWsData && <TheChat isChat={!isDesktopOrLaptop} hash={buyWsData.hash} />} */}
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
