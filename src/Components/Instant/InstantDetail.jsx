import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Context
import InstantContext from '../../context/instant/InstantContext';

// Components
import SellDetail from './SellDetail';
import BuyDetail from './BuyDetail';
import TheChat from '../Chat/TheChat';
import TheMobileChat from '../Chat/TheMobileChat';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import Button from 'react-bootstrap/Button';

const InstantDetail = () => {
  // Media Query
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' }); // 小於等於 1200 true

  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, buy1Data, statusWs } = instantContext;

  // Init State
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    if (!sell1Data && !buy1Data) history.replace('/home/overview');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sell1Data || buy1Data) statusWs(match.params.id);

    // eslint-disable-next-line
  }, [sell1Data, buy1Data]);

  if (sell1Data) {
    return (
      <>
        <SellDetail />

        {/* Chat --桌機版 */}
        {sell1Data && <TheChat isChat={!isMobile} hash={sell1Data.Tx_HASH} />}

        {/* Chat --手機版  */}
        {isMobile && sell1Data ? (
          <Button
            style={helpBtn}
            variant="primary"
            onClick={() => setShowMobileChat(!showMobileChat)}
          >
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
        ) : null}

        {showMobileChat && <TheMobileChat hash={sell1Data.Tx_HASH} />}
      </>
    );
  } else if (buy1Data) {
    return (
      <>
        <BuyDetail />

        {/* Chat --桌機版 */}
        <TheChat isChat={!isMobile} hash={buy1Data.Tx_HASH} />

        {/* Chat --手機版  */}
        {isMobile && buy1Data ? (
          <Button
            style={helpBtn}
            variant="primary"
            onClick={() => setShowMobileChat(!showMobileChat)}
          >
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
        ) : null}

        {showMobileChat && <TheMobileChat hash={buy1Data.Tx_HASH} />}
      </>
    );
  } else {
    return <h2>目前沒有交易</h2>;
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
