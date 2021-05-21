import { useContext, useEffect } from 'react';
import SellContext from '../../context/sell/SellContext';

const ExRate = props => {
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
          匯率 :<span>{buyRate && Number(buyRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          付款窗口 :<span>15分鐘</span>
        </p>
        <p className="mb-0">
          限額 :<span>USDT 100.00 - 10000.00</span>
        </p>
      </div>
    </>
  );
};

export default ExRate;
