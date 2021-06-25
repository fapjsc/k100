import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';

// Components
import NoData from '../NoData';
import InstantAllItem from './InstantAllItem';

// Style

const InstantAll = ({ stop }) => {
  // Route Props
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { instantData, setCountData } = instantContext;

  const handleClick = (exRate, cny, usdt, type, token) => {
    stop();
    const data = {
      exRate,
      cny,
      usdt,
      type,
      token,
    };
    setCountData(data);
    history.replace('/home/instant');
  };

  if (!instantData.length) {
    return <NoData />;
  } else {
    return (
      <div>
        {instantData.map(el => {
          return <InstantAllItem key={el.token} el={el} handleClick={handleClick} />;
        })}
      </div>
    );
  }
};

export default InstantAll;
