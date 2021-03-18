import React, { useState, useEffect } from 'react';

import './index.scss';

const CompletePay = props => {
    const [isConfirm, setConfirm] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setConfirm(true);
        }, 7000);
    }, []);

    if (!isConfirm) {
        return (
            <div>
                <div className="txt_12 pt_20">購買USDT</div>
                <div className="text-center">
                    <div className="i_notyet" />
                    <h4 className="c_blue">已提交，等待確認中</h4>
                    <p className="txt_12_grey">
                        交易回執：{props.transferData.Tx_HASH}
                        <br />
                        購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                    </p>
                    <button className="easy-btn mw400">返回主頁</button>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="txt_12 pt_20">購買USDT</div>
                <div className="text-center">
                    <div className="i_done" />
                    <h4 className="c_blue">交易完成</h4>
                    <p className="txt_12_grey">
                        交易回執：{props.transferData.Tx_HASH}
                        <br />
                        購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                    </p>
                    <button className="easy-btn mw400">返回主頁</button>
                    <br />
                    <p>詳細購買紀錄</p>
                </div>
            </div>
        );
    }
};

export default CompletePay;
