import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import BuyContext from '../../context/buy/BuyContext';

const InstantNva = props => {
  // Router Props
  const history = useHistory();
  // Instant Context
  const instantContext = useContext(InstantContext);
  const { wsOnGoingData, wsStatusClient } = instantContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsClient } = buyContext;

  const handleClick = e => {
    if (buyWsClient) buyWsClient.close();
    if (wsStatusClient) wsStatusClient.close();

    if (e.target.id === 'all') props.setTab('all');
    if (e.target.id === 'onGoing') props.setTab('onGoing');

    if (props.jumpTo) history.replace('home/overview');
  };
  return (
    <nav className="tab ">
      <div>
        <button
          id="all"
          className={props.tab === 'all' ? 'tabLinks tabLinksActive' : 'tabLinks c_grey'}
          onClick={e => handleClick(e)}
        >
          即時買賣
        </button>
      </div>
      <div className="onGoing">
        {wsOnGoingData.length ? <span className="red_dot">{wsOnGoingData.length}</span> : null}
        <button
          id="onGoing"
          className={props.tab === 'onGoing' ? 'tabLinks tabLinksActive' : 'tabLinks c_grey'}
          onClick={e => handleClick(e)}
        >
          進行中
        </button>
      </div>
    </nav>
  );
};

export default InstantNva;
