// Lang Context
import { useI18n } from '../../lang';

// Components
import StopWatch from '../universal/StopWatch';

const InstantAllItem = ({ el, handleClick }) => {
  // Lang Context
  const { t } = useI18n();
  if (el.MType === 2) {
    return (
      <div id="sell" className="tabcontent mt-4">
        {/* header */}
        <div className="d-flex align-items-center mt-4" style={{ maxWidth: 220 }}>
          <span className="txt_12 mr-auto">
            {t('instant_exRate')}：{el.D1.toFixed(2)}
          </span>
          <span className="i_clock" />
          <span className="">{t('instant_acc_time')}：</span>
          {/* <span className="c_yellow">8秒</span> */}
          {/* <span className="c_yellow">{num} 秒</span> */}
          <StopWatch deltaTime={el.DeltaTime} />
        </div>

        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_blue1" />
              <span className="blue mobile-text-md">{t('instant_buy')}&nbsp;</span>
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

          {/* Button */}
          <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
            <button onClick={() => handleClick(el.D1.toFixed(2), el.D2.toFixed(2), el.UsdtAmt, '買', el.token)} className="easy-btn margin0 w-100">
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
        <div className="d-flex align-items-center mt-4" style={{ maxWidth: 220 }}>
          <span className="txt_12 mr-auto">
            {t('instant_exRate')}：{el.D1.toFixed(2)}
          </span>
          <span className="i_clock mr-1" />
          <span className="">{t('instant_acc_time')}：</span>
          {/* <span className="c_yellow">{num} 秒</span> */}
          <StopWatch deltaTime={el.DeltaTime} />
        </div>
        {/* Body */}
        <div className="row bb1 mx-0">
          <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
            {/* Usdt */}
            <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
              <span className="i_red" />
              <span className="red mobile-text-md">{t('instant_sell')}&nbsp;</span>
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
            <button onClick={() => handleClick(el.D1.toFixed(2), el.D2.toFixed(2), el.UsdtAmt, '賣', el.token)} className="easy-btn margin0 w-100">
              {t('btn_detail')}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default InstantAllItem;
