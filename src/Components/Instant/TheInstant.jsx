import { useEffect, useContext, useState } from 'react';

// Play Sound
import useSound from 'use-sound';
import newOrderSound from '../../Assets/mp3/newOrder.mp3';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import InstantNav from './InstantNav';
import InstantAll from './InstantAll';
import InstantOnGoing from './InstantOnGoing';

// Style
import BaseSpinner from '../Ui/BaseSpinner';
import Button from 'react-bootstrap/Button';

const TheInstant = () => {
  // Init State
  const [tab, setTab] = useState('all');
  const [play, { stop }] = useSound(newOrderSound, { interrupt: false });
  const [loop, setLoop] = useState();
  const [soundState, setSoundState] = useState(true);

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
    // eslint-disable-next-line
  }, [tab]);

  useEffect(() => {
    if (soundState) {
      if (instantData.length > 0) {
        // 即時買賣新訂單聲音提示
        play();
        const soundLoop = setInterval(() => {
          play();
        }, 5000);

        setLoop(soundLoop);
      } else {
        if (loop) handleStopSound();
      }
    }

    return () => {
      if (loop) {
        stop();
        clearInterval(loop);
      }
    };

    // eslint-disable-next-line
  }, [instantData, soundState]);

  const handleStopSound = () => {
    stop();
    clearInterval(loop);
  };

  const handleClick = () => {
    stop();
    clearInterval(loop);
    setSoundState(!soundState);
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-0" style={{ fontSize: 12, color: '#fff' }}>
          即時買賣
        </p>
        <Button className={soundState ? 'btn-info' : 'btn-danger'} onClick={handleClick}>
          {!soundState ? '提示音已關閉' : '提示音已開啟'}
        </Button>
      </div>
      <div className="contentbox">
        {/* Tab Link */}
        <InstantNav setTab={setTab} tab={tab} />

        {/* Content */}
        {tab === 'all' && !httpLoading && instantData ? <InstantAll stop={handleStopSound} /> : null}
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
