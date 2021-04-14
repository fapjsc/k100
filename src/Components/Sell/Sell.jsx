import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import SellContext from '../../context/sell/SellContext';

import SellHeaders from './SellHeader';
import SellForm from './SellForm';
import Pairing from './Pairing';

const Sell = () => {
    const history = useHistory();
    const sellContext = useContext(SellContext);
    const { wsPairing, wsData, closeWebSocket } = sellContext;

    useEffect(() => {
        closeWebSocket();
        return () => {
            closeWebSocket();
        };

        // eslint-disable-next-line
    }, []);

    const backHome = () => {
        history.replace('/home/overview');
    };

    return (
        <Fragment>
            <SellHeaders />
            <Pairing
                show={wsPairing}
                onHide={backHome}
                title="請稍等，現正整合交易者資料"
                text={wsData && `出售訂單：${Math.abs(wsData.UsdtAmt)} USDT @ ${wsData.D2} CNY`}
            />
            <SellForm />
        </Fragment>
    );
};

export default Sell;
