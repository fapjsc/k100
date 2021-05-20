import { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Context
import InstantContext from '../../context/instant/InstantContext';

// Components
import SellDetail from './SellDetail';
import BuyDetail from './BuyDetail';
import TheChat from '../Chat/TheChat';
import TheMobileChat from '../Chat/TheMobileChat';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const InstantDetail = () => {
  // Router Props
  const match = useRouteMatch();

  // Media Query
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' }); // 小於等於 1200 true

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, buy1Data, sellMatch1, buyMatch1, instantOngoingWsConnect } = instantContext;

  // Init State
  // const [showMobileChat, setShowMobileChat] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    instantOngoingWsConnect();
    const orderToken = match.params.id;
    if (orderToken) {
      if (match.params.type === 'buy') sellMatch1(orderToken);
      if (match.params.type === 'sell') buyMatch1(orderToken);
    }

    return () => {};
    // eslint-disable-next-line
  }, []);

  if (sell1Data) {
    return (
      <>
        <SellDetail />

        {/* Chat --桌機版 */}
        {!isMobile && sell1Data ? <TheChat isChat={!isMobile} hash={sell1Data.Tx_HASH} /> : null}

        {/* Chat --手機版  */}
        {isMobile && sell1Data ? (
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

            <TheChat hash={sell1Data.Tx_HASH} isChat={showChat} />
          </>
        ) : null}
      </>
    );
  } else if (buy1Data) {
    return (
      <>
        <BuyDetail />

        {/* Chat --桌機版 */}
        {!isMobile && buy1Data ? <TheChat isChat={!isMobile} hash={buy1Data.Tx_HASH} /> : null}

        {/* Chat --手機版  */}
        {isMobile && buy1Data ? (
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
            <TheChat hash={buy1Data.Tx_HASH} isChat={showChat} />
          </>
        ) : null}
      </>
    );
  } else {
    return (
      <Card>
        <BaseSpinner />
      </Card>
    );
  }
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

export default InstantDetail;
