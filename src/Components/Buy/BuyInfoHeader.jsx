import { useState, useContext, useEffect } from 'react';
import Countdown from 'react-countdown';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import Timer from './Timer';

// Style
import clockIcon from '../../Assets/i_clock.png';

const BuyInfoHeader = () => {
  // Buy Context
  const buyContext = useContext(BuyContext);
  const { deltaTime, setHideBuyInfo } = buyContext;

  // Init State
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (deltaTime <= 900) setHideBuyInfo(false);
    if (deltaTime > 900) setHideBuyInfo(true);
    setTimeLeft((900 - deltaTime) * 1000);

    // eslint-disable-next-line
  }, [deltaTime]);

  return (
    <div className="pl-0 mobile-width " style={pairTitleBox}>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        轉帳資料
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
          剩餘支付時間：
        </p>
        <span className="payTime c_yellow">
          <Countdown
            renderer={Timer}
            onComplete={() => setHideBuyInfo(true)}
            date={Date.now() + timeLeft}
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
