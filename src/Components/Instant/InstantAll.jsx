import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Context
import InstantContext from '../../context/instant/InstantContext';

// Components
import NoData from '../NoData';
import InstantAllItem from './InstantAllItem';

// Style

const TheInstant = () => {
  // Route Props
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { instantData, setCountData } = instantContext;

  const handleClick = (exRate, cny, usdt, type, token) => {
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

  useEffect(() => {
    // connectInstantWs();
    // instantOngoingWsConnect();
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      {instantData.length > 0 &&
        instantData.map(el => {
          return <InstantAllItem key={uuidv4()} el={el} handleClick={handleClick} />;
        })}

      {!instantData.length && <NoData />}
    </section>
  );
};

export default TheInstant;
