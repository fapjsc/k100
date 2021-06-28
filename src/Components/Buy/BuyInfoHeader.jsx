import { useState, useContext, useEffect } from 'react';
import Countdown from 'react-countdown';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Lang Context
import { useI18n } from '../../lang';

// Components
import Timer from './Timer';

// Style
import clockIcon from '../../Assets/i_clock.png';

const BuyInfoHeader = () => {
  // Lang Context
  const { t } = useI18n();

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { deltaTime, setHideBuyInfo } = buyContext;

  // Init State
  const [timeLeft, setTimeLeft] = useState(Date.now() + (1000 * 60 * 15 - deltaTime * 1000));

  useEffect(() => {
    setTimeLeft(Date.now() + (1000 * 60 * 15 - deltaTime * 1000));
    // eslint-disable-next-line
  }, [deltaTime]);

  // ==========
  //  Function
  // ==========
  const handleComplete = () => {
    setHideBuyInfo(true);
    console.log('complete!!');
  };

  return (
    <div className="pl-0 mobile-width " style={pairTitleBox}>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {t('transfer_data')}
      </p>

      <div
        className=""
        style={{
          display: 'flex',
        }}
      >
        <img style={clockStyle} src={clockIcon} alt="clock icon" />
        <p
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {t('limit_time')}：
        </p>
        <span className="payTime c_yellow">
          <Countdown
            renderer={Timer}
            onComplete={handleComplete}
            date={timeLeft}
            // date={Date.now() + 5000}
          />
        </span>
      </div>
    </div>
  );
};

const pairTitleBox = {
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '-17px',
  marginTop: 30,
};

const clockStyle = {
  height: 17,
  marginRight: 3,
};

export default BuyInfoHeader;
