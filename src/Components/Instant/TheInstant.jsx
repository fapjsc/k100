import { useEffect, useContext, useState } from 'react';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

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
  const { connectInstantWs, instantOngoingWsConnect, cleanAll } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { httpLoading } = httpError;

  useEffect(() => {
    connectInstantWs();
    instantOngoingWsConnect();
    return cleanAll();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <p className="welcome_txt">即時買賣</p>
      <div className="contentbox">
        {/* Tab Link */}
        <InstantNav setTab={setTab} tab={tab} />

        {/* Content */}
        {tab === 'all' && !httpLoading ? <InstantAll /> : null}
        {tab === 'onGoing' && !httpLoading ? <InstantOnGoing /> : null}

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
