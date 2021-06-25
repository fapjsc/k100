import { Fragment, useContext, useEffect } from 'react';
import SellContext from '../../context/sell/SellContext';

const SellHeader = () => {
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
        出售USDT
      </p>
      <div className="pay-info txt_12">
        <p className="mb-0">
          匯率 :<span>{Number(exRate).toFixed(2)}</span>
        </p>
        <p className="mb-0">
          限額 :<span>USDT 100.00 - 10000.00</span>
        </p>
        <p className="mb-0">
          付款窗口 :<span>15分鐘</span>
        </p>
      </div>
    </Fragment>
  );
};

export default SellHeader;