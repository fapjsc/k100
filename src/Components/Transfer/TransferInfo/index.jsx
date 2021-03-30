import { useEffect } from 'react';

import OnLoading from '../OnLoading';

const TransferInfo = ({
    isloading,
    isfailed,
    isComplete,
    backToHome,
    submitTransaction,
    match,
    location,
    onHide,
}) => {
    useEffect(() => {
        submitTransaction(match.params.id);

        // eslint-disable-next-line
    }, []);

    if (!isloading && isComplete) {
        return (
            <div>
                <div className="txt_12 pt_20">購買USDT</div>
                <div className="text-center">
                    <div className="i_done" />
                    <h4 className="c_blue">交易完成</h4>
                    <p className="txt_12_grey">
                        交易回執：
                        <br />
                        購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                    </p>
                    <button onClick={backToHome} className="easy-btn mw400">
                        返回主頁
                    </button>
                    <br />
                    <p>詳細購買紀錄</p>
                </div>
            </div>
        );
    } else {
        return (
            <OnLoading
                show={isloading}
                isfailed={isfailed ? 1 : 0}
                isloading={isloading ? 1 : 0}
                onHide={onHide}
                usdtCount={location.state ? location.state.item.UsdtAmt : null}
            />
        );
    }
};

export default TransferInfo;
