import { useContext, useEffect } from 'react';
import SellContext from '../../context/sell/SellContext';

const TransferHandle = () => {
  const sellContext = useContext(SellContext);
  const { getExRate, transferHandle } = sellContext;

  useEffect(() => {
    getExRate();

    // eslint-disable-next-line
  }, []);

  return (
    <p
      style={{
        letterSpacing: 1.5,
        marginBottom: 20,
      }}
    >
      手續費：{transferHandle && transferHandle} USDT
    </p>
  );
};

export default TransferHandle;
