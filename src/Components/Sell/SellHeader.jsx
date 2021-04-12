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
            <p>出售USDT</p>
            <div className="pay-info">
                <p>
                    匯率 :<span>{exRate}</span>
                </p>
                <p>
                    限額 :<span>100 - 10000</span>
                </p>
                <p>
                    付款窗口 :<span>30分鐘</span>
                </p>
            </div>
        </Fragment>
    );
};

export default SellHeader;
