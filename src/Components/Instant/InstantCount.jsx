import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Lang Context
import { useI18n } from '../../lang';

// Components
import NoOrder from '../universal/NoOrder';

// Utils
import { locationMoneyPrefix, locationMoneyCalcWithThousand, usdtThousandBitSeparator} from "../../lib/utils";

// Style
import Button from 'react-bootstrap/Button';

const InstantCount = props => {
  // Lang Context
  const { t } = useI18n();
  // Router Props
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { countData, sellMatch1, buyMatch1, orderExists, setOrderExists } = instantContext;

  // ============
  //  UseEffect
  // ============
  useEffect(() => {
    if (errorText !== '') alert(errorText);
    return setHttpError('');
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (!orderExists) props.setShowPop(false);
    //eslint-disable-next-line
  }, [orderExists]);

  // ===========
  //  Function
  // ===========
  const handleClick = type => {
    if (!orderExists) return;
    props.setShowPop(true);

    if (type === '買') {
      sellMatch1(countData.token);
    } else {
      buyMatch1(countData.token);
    }
  };

  const onHide = () => {
    setOrderExists(true);
    history.replace('/home/overview');
  };

  return (
    <div id="buy" className="tabcontent">
      {countData && <NoOrder show={!orderExists} exRate={countData.exRate} type={countData.type} usdt={countData.usdt.toFixed(2)} onHide={onHide} />}
      {countData ? (
        <>
          <div className="txt_12 pt_20 mb-3 pl-1">{t('instant_transaction')}</div>

          <div className="easy_info mobile-width" style={{ cssFloat: 'inherit' }}>
            <div className="inline">
              <div className="txt_12_grey">{t('instant_exRate')}：</div>
              <span className="">{countData.exRate}</span>
            </div>

            <div className="right_txt16">
              <span className={countData.type === '買' ? 'i_blue1' : 'i_red'} />
              <span className={countData.type === '買' ? 'blue' : 'red'}>{countData.type === '買' ? t('instant_buy') : t('instant_sell')}</span>
            </div>

            <hr />

            <div className="inline ">
              <div className="txt_12_grey mobile-text">{t('instant_price')}</div>
              <span className="c_blue mobile-text">{locationMoneyCalcWithThousand(countData.cny)} {locationMoneyPrefix()}</span>
            </div>

            <div className="inline pl_40 " style={{ cssFloat: 'right' }}>
              <div className="txt_12_grey mobile-text" style={{ textAlign: 'right' }}>
                {t('instant_qua')}
              </div>
              <span className="mobile-text">{usdtThousandBitSeparator(countData.usdt)} USDT</span>
            </div>
          </div>

          <Button onClick={() => handleClick(countData.type)} disabled={props.showPop} className="easy-btn mw400 btn-sm-screen-100" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            {t('btn_instant')}
          </Button>
        </>
      ) : (
        <>
          <h2 className="mt-4">{t('instant_no_transaction')}</h2>
          <Button onClick={() => history.replace('/home')} className="easy-btn mw400 btn-sm-screen-100" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            {t('btn_return')}
          </Button>
        </>
      )}
    </div>
  );
};

export default InstantCount;
