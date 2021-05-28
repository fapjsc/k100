import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import NoData from '../NoData';
import InstantOnGoingItem from './InstantOnGoingItem';

const TheInstant = () => {
  // Route Props
  const history = useHistory();

  // // Init State
  const [token, setToken] = useState('');
  const [type, setType] = useState('');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    wsOnGoingData,
    sellMatch1,
    buyMatch1,
    sell1Data,
    buy1Data,
    setSell1Data,
    setBuy1Data,
    setCountData,
    setActionType,
  } = instantContext;

  // // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { btnLoading, errorText, setHttpError } = httpError;

  const handleClick = (token, type) => {
    setToken(token);
    setType(type);
    setCountData({ token });
    setActionType('onGoing');
  };

  // ==========
  // UseEffect
  // ==========
  useEffect(() => {
    if (!token) return;

    if (type === 'sell') {
      sellMatch1(token);
      setBuy1Data(null);
    }
    if (type === 'buy') {
      buyMatch1(token);
      setSell1Data(null);
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (sell1Data || buy1Data) history.replace(`/home/instant/`);
    // eslint-disable-next-line
  }, [buy1Data, sell1Data]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  if (!wsOnGoingData.length) {
    return <NoData />;
  } else {
    return (
      <div>
        {wsOnGoingData.map(el => {
          return (
            <InstantOnGoingItem
              key={el.token}
              el={el}
              handleClick={handleClick}
              btnLoading={btnLoading}
            />
          );
        })}
      </div>
    );
  }
};

export default TheInstant;
