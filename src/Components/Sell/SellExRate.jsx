import { Fragment, useContext, useEffect } from 'react';

// Context
import SellContext from '../../context/sell/SellContext';

// Lang Context
import { useI18n } from '../../lang';

const SellHeader = () => {
  // Lang Context
  const { t } = useI18n();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { exRate, getExRate } = sellContext;

  useEffect(() => {
    getExRate();

    // eslint-disable-next-line
  }, [exRate]);

  return (
    <Fragment>
      <p
        style={{
          letterSpacing: '1.5px',
          color: '#3242e47',
          fontSize: '12px',
        }}
      >
        {t('sell_usdt')}
      </p>
      <div className="pay-info txt_12">
        <p className="mb-0">
          {t('exRate')} :<span>{Number(exRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          {t('payment_contact')}:<span>{t('payment_contact_time')}</span>
        </p>
        <p className="mb-0">
          {t('limit')} :<span>USDT 100.00 - 10000.00</span>
        </p>
      </div>
    </Fragment>
  );
};

export default SellHeader;
