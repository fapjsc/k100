import { useEffect, useContext, useState } from 'react';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import InstantAll from './InstantAll';
import InstantOnGoing from './InstantOnGoing';

// Style
import BaseSpinner from '../Ui/BaseSpinner';

const TheInstant = () => {
  // Init State
  const [tab, setTab] = useState('all');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { connectInstantWs, instantData, cleanAll } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { httpLoading } = httpError;

  useEffect(() => {
    connectInstantWs();

    return cleanAll();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <p className="welcome_txt">即時買賣</p>
      <div className="contentbox">
        {/* Tab Link */}
        <div className="tab ">
          <div>
            <button
              className={tab === 'all' ? 'tabLinks tabLinksActive' : 'tabLinks c_grey'}
              onClick={() => setTab('all')}
            >
              即時買賣
            </button>
          </div>
          <div className="onGoing">
            <span className="red_dot">2</span>
            <button
              className={tab === 'onGoing' ? 'tabLinks tabLinksActive' : 'tabLinks c_grey'}
              onClick={() => setTab('onGoing')}
            >
              進行中
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === 'all' && instantData.length && !httpLoading ? <InstantAll /> : null}
        {tab === 'onGoing' && instantData.length && !httpLoading ? <InstantOnGoing /> : null}

        {/* Loading */}
        {httpLoading && (
          <div className="mt-4">
            <BaseSpinner />
          </div>
        )}

        {/* Empty */}
        {!httpLoading && !instantData.length ? (
          <h2 className="mt-4 text-center">目前沒有交易</h2>
        ) : null}
      </div>
    </div>
  );
};

export default TheInstant;
