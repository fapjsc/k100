import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// ConText
import SellContext from '../../context/sell/SellContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import SellHeaders from './SellHeader';
import SellDetail from './SellDetail';
// import SellCompleted from './SellCompleted';

import Chat from '../Chat';
import CompleteStatus from '../universal/CompleteStatus';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const SellInfo = () => {
  // Break Points
  const lapTopBig = useMediaQuery({ query: '(max-width: 1200px)' });

  // Router Props
  const history = useHistory();
  let { id } = useParams();

  /// Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsData, closeWebSocket, sellWebSocket, CleanAll, wsClient, sellStatus } = sellContext;

  const [isChat, setIsChat] = useState(false);

  useEffect(() => {
    if (id) sellWebSocket(id);
    return () => {
      if (wsClient) wsClient.close();
      if (id) closeWebSocket(id);
      CleanAll();
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

  useEffect(() => {
    if (sellStatus === 99 || sellStatus === 98) alert('訂單已經取消');
  }, [sellStatus]);

  const backToHome = () => {
    if (wsClient) wsClient.close();
    closeWebSocket(id);
    history.replace('/home/overview');

    CleanAll();
  };

  // confirmSell 判斷要render sell info 還是 提交確認/交易完成組件
  return (
    <>
      <SellHeaders />

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

      {/* 聊天室  --電腦版 1200px  */}
      {wsData && !lapTopBig ? (
        <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={true} />
      ) : null}

      {/* 聊天室 --手機版 1200px  */}
      <Button style={helpBtn} variant="primary" onClick={() => setIsChat(!isChat)}>
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

      {wsData ? <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={isChat} /> : null}
    </>
  );
};

// const cancelLink = {
//   fontSize: 15,
//   fontWeight: 'bold',
//   borderBottom: '1px solid grey',
//   display: 'inline-block',
//   cursor: 'pointer',
// };

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

export default SellInfo;
