import { useContext, useEffect } from 'react';

// Context
import { useI18n } from '../../lang';
import SellContext from '../../context/sell/SellContext';

const ExRate = props => {
  // Lang Context
  const { t } = useI18n();

  // Sell Context
  const sellContext = useContext(SellContext);
  const { getExRate, buyRate } = sellContext;
  const { title } = props;
  useEffect(() => {
    getExRate();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <p
        style={{
          letterSpacing: '1.5px',
          color: '#3242e47',
          fontSize: '12px',
        }}
      >
        {title}
      </p>
      <div className="pay-info txt_12 mb-4">
        <p className="mb-0">
          {t('exRate')} :<span>{buyRate && Number(buyRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          {t('payment_contact')} :<span>{t('payment_contact_time')}</span>
        </p>
        <p className="mb-0">
          {t('limit')} :<span>USDT 100.00 - 10000.00</span>
        </p>
      </div>
    </>
  );
};

export default ExRate;
