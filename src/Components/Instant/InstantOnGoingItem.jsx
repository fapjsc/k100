import { useState, useEffect } from 'react';
import Countdown from 'react-countdown';

// Lang Context
import { useI18n } from '../../lang';

// Components
import CountDownTimer from '../universal/countDownTimer';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const InstantOnGoingItem = ({ el, handleClick, btnLoading }) => {
  // Lang Context
  const { t } = useI18n();

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
          <span className="txt_12 mr-auto">
            {t('instant_exRate')}：{el.D1.toFixed(2)}
          </span>
          <span className="i_clock mr-1 mb-1" />
          <span className="">{t('instant_limit_time')}：</span>

          {overTime ? (
            <span style={{ color: '#707070' }}>{t('instant_over_time_short')}</span>
          ) : (
            <span className="c_yellow">
              <Countdown onComplete={handleCountDownComplete} renderer={CountDownTimer} date={timeLeft} />
            </span>
          )}
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_blue1" />
              <span className="blue mobile-text-md">{t('instant_buy')}&nbsp;&nbsp;</span>
              <span className="bold_22 blue mobile-text-md">{el.UsdtAmt.toFixed(2)}&nbsp;</span>
              <span className="blue mobile-text-md" style={{ fontWeight: 'bold' }}>
                USDT
              </span>
            </div>

            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">
                {t('instant_pay')}&nbsp;{el.D2.toFixed(2)} CNY
              </span>
            </div>
          </div>

          <div className="col-md-1" />

          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            <button onClick={() => handleClick(el.token, 'sell')} className="easy-btn margin0 w-100">
              {t('btn_detail')}
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
          <span className="txt_12 mr-auto">
            {t('instant_exRate')}：{el.D1.toFixed(2)}
          </span>
          <span className="i_clock mr-1 mb-1" />
          <span className="">{t('instant_limit_time')}：</span>
          {overTime ? (
            <span style={{ color: '#707070' }}>{t('instant_over_time_short')}</span>
          ) : (
            <span className="c_yellow">
              <Countdown onComplete={handleCountDownComplete} renderer={CountDownTimer} date={timeLeft} />
            </span>
          )}
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_red" />
              <span className="red mobile-text-md">{t('instant_sell')}&nbsp;&nbsp;</span>
              <span className="bold_22 red mobile-text-md">{el.UsdtAmt.toFixed(2)}&nbsp;</span>
              <span className="red mobile-text-md" style={{ fontWeight: 'bold' }}>
                USDT
              </span>
            </div>
            {/* Cny */}
            <div className="w-50">
              <span className="i_cny" />
              <span className="mobile-text-md">
                {t('instant_get')}&nbsp;{el.D2.toFixed(2)} CNY
              </span>
            </div>
          </div>

          <div className="col-md-1" />

          {/* Button */}
          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            {btnLoading ? (
              <Button variant="primary" disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                {t('btn_loading')}...
              </Button>
            ) : (
              <button onClick={() => handleClick(el.token, 'buy')} className="easy-btn margin0 w-100">
                {t('btn_detail')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default InstantOnGoingItem;
