import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// ConText
import SellContext from '../../context/sell/SellContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import SellExRate from './SellExRate';
import SellDetail from './SellDetail';
import Pairing from './Pairing';
import TheChat from '../Chat/TheChat';
import CompleteStatus from '../universal/CompleteStatus';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const SellInfo = () => {
  // Break Points
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' }); // 小於等於 1200 true

  // Router Props
  const history = useHistory();
  let { id } = useParams();

  /// Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsData, sellWebSocket, cleanAll, wsClient, sellStatus, wsPairing } = sellContext;

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (id) sellWebSocket(id);

    return () => {
      if (wsClient) wsClient.close();
      cleanAll();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  const backToHome = () => {
    history.replace('/home/overview');
    if (wsClient) wsClient.close();
    cleanAll();
  };

  const onHide = () => {
    if (wsClient) wsClient.close();
    history.replace('/home/overview');
    cleanAll();
  };

  return (
    <div className="" style={{ position: 'relative' }}>
      <Pairing
        onHide={onHide}
        show={wsPairing && wsClient}
        title="請稍等，現正整合交易者資料"
        text={
          wsData &&
          `出售訂單：${Math.abs(wsData.UsdtAmt).toFixed(2)} USDT = $${wsData.D2.toFixed(2)} CNY`
        }
      />
      <SellExRate />
      {(sellStatus === 33 || sellStatus === 34) && wsData ? (
        <SellDetail />
      ) : sellStatus === 1 || sellStatus === 99 || (sellStatus === 98 && wsData) ? (
        <CompleteStatus
          wsStatus={sellStatus}
          hash={wsData && wsData.Tx_HASH}
          backToHome={backToHome}
          type="sell"
        />
      ) : (
        <BaseSpinner />
      )}

      {/* 聊天室  --電腦版 大於1200px  */}
      {wsData && !isMobile ? (
        <div style={chatContainer}>
          <TheChat isChat={!isMobile} hash={wsData.Tx_HASH} />
        </div>
      ) : null}

      {/* 聊天室 --手機版 小於1200px  */}
      {isMobile && wsData ? (
        <div style={MobileChatContainer}>
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

          <TheChat hash={wsData.Tx_HASH} isChat={showChat} />
        </div>
      ) : null}
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
  position: 'absolute',
  bottom: '5%',
  right: 0,
  backgroundColor: '#F80FA',
};

const MobileChatContainer = {
  height: 600,
  width: 100,
  position: 'fixed',
  bottom: 25,
  right: 10,
};

const chatContainer = {
  backgroundColor: 'red',
  position: 'absolute',
  top: -95,
  right: '-50%',
};

export default SellInfo;
