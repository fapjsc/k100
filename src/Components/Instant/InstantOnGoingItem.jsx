import { useState, useEffect } from 'react';
import Countdown from 'react-countdown';

// Context
import BuyContext from '../../context/buy/BuyContext';

// Components
import CountDownTimer from '../universal/countDownTimer';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const InstantOnGoingItem = ({ el, handleClick, btnLoading }) => {
  // // Buy Context
  // const buyContext = useContext(BuyContext)
  // const {}

  // Init State
  const [timeLeft] = useState(Date.now() + 1000 * 60 * 30 - el.DeltaTime * 1000);
  const [overTime, setOverTime] = useState(false);

  // ===========
  //  Function
  // ===========
  const handleCountDownComplete = () => {
    setOverTime(true);
  };

  useEffect(() => {
    if (el.DeltaTime > 1800) setOverTime(true);
  }, [el.DeltaTime]);

  if (el.MType === 2) {
    return (
      <div id="sell" className="tabcontent">
        {/* header */}
        <div className="d-flex align-items-center mt-4" style={{ maxWidth: 186 }}>
          <span className="txt_12 mr-auto">匯率：{el.D1.toFixed(2)}</span>
          <span className="i_clock mr-1 mb-1" />
          <span className="">限時時間：</span>

          {overTime ? (
            <span style={{ color: '#707070' }}>已逾時</span>
          ) : (
            <span className="c_yellow">
              <Countdown
                onComplete={handleCountDownComplete}
                renderer={CountDownTimer}
                date={timeLeft}
              />
            </span>
          )}

          {/* <span className="c_yellow">{el.DeltaTime} 秒</span> */}
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_blue1" />
              <span className="blue mobile-text-md">買&nbsp;&nbsp;</span>
              <span className="bold_22 blue mobile-text-md">{el.UsdtAmt.toFixed(2)}&nbsp;</span>
              <span className="blue mobile-text-md" style={{ fontWeight: 'bold' }}>
                USDT
              </span>
            </div>

            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">付&nbsp;{el.D2.toFixed(2)} CNY</span>
            </div>
          </div>

          <div className="col-md-1" />

          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            <button
              onClick={() => handleClick(el.token, 'sell')}
              className="easy-btn margin0 w-100"
            >
              詳細
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="buy" className="tabcontent">
        {/* header */}
        <div className="d-flex align-items-center mt-4" style={{ maxWidth: 186 }}>
          <span className="txt_12 mr-auto">匯率：{el.D1.toFixed(2)}</span>
          <span className="i_clock" />
          <span className="">限時時間：</span>
          <span className="c_yellow">8秒</span>
          {/* <span className="c_yellow">{el.DeltaTime} 秒</span> */}
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_red" />
              <span className="red mobile-text-md">賣&nbsp;&nbsp;</span>
              <span className="bold_22 red mobile-text-md">{el.UsdtAmt.toFixed(2)}&nbsp;</span>
              <span className="red mobile-text-md" style={{ fontWeight: 'bold' }}>
                USDT
              </span>
            </div>
            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">收&nbsp;{el.D2.toFixed(2)} CNY</span>
            </div>
          </div>

          <div className="col-md-1" />

          {/* Button */}
          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            {btnLoading ? (
              <Button variant="primary" disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                Loading...
              </Button>
            ) : (
              <button
                onClick={() => handleClick(el.token, 'buy')}
                className="easy-btn margin0 w-100"
              >
                詳細
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default InstantOnGoingItem;
