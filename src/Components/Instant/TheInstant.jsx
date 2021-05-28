import { useEffect, useContext, useState } from 'react';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';
// import AuthContext from '../../context/auth/AuthContext';

// Components
import InstantNav from './InstantNav';
import InstantAll from './InstantAll';
import InstantOnGoing from './InstantOnGoing';

// Style
import BaseSpinner from '../Ui/BaseSpinner';

const TheInstant = () => {
  // Init State
  const [tab, setTab] = useState('all');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    connectInstantWs,
    instantOngoingWsConnect,
    // wsStatusData,
    cleanAll,
    instantAllClient,
    instantOnGoingClient,
    instantData,
    wsOnGoingData,
  } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { httpLoading } = httpError;

  // Auth Context
  // const authContext = useContext(AuthContext);
  // const { isAgent } = authContext;
  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    if (instantOnGoingClient) instantOnGoingClient.close();
    if (instantAllClient) instantAllClient.close();
    connectInstantWs();
    instantOngoingWsConnect();

    return () => {
      if (instantOnGoingClient) instantOnGoingClient.close();
      if (instantAllClient) instantAllClient.close();
      cleanAll();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // if (tab === 'all') connectInstantWs();
    // if (tab === 'onGoing') instantOngoingWsConnect();
    // eslint-disable-next-line
  }, [tab]);

  // useEffect(() => {
  //   if (wsStatusData) cleanAll();
  //   // eslint-disable-next-line
  // }, [wsStatusData]);

  return (
    <div>
      <p className="welcome_txt pl-0 pb-1">即時買賣</p>
      <div className="contentbox">
        {/* Tab Link */}
        <InstantNav setTab={setTab} tab={tab} />

        {/* Content */}

        {tab === 'all' && !httpLoading && instantData ? <InstantAll /> : null}
        {tab === 'onGoing' && !httpLoading && wsOnGoingData ? <InstantOnGoing /> : null}

        {/* Loading */}
        {httpLoading && (
          <div className="mt-4">
            <BaseSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default TheInstant;
