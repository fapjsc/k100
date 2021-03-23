import React from 'react';

import Button from 'react-bootstrap/Button';

const infoDetail = props => {
    console.log('infoDetail mount');

    return (
        <>
            {!props.transferData ? null : (
                <>
                    <div className="pair-textBox">
                        <p>
                            付款金額: &emsp;
                            <span>{props.transferData.rmb}</span>
                        </p>
                        <p>收款姓名： {props.transferData.payee}</p>
                        <p>付款帳號： {props.transferData.account}</p>
                        <p>開戶銀行： {props.transferData.bank}</p>
                        <p>所在省市： {props.transferData.branch}</p>
                    </div>

                    <div className="pairFoot">
                        <Button
                            variant="primary"
                            className="pairFoot-btn"
                            onClick={props.getConfirmPay}
                        >
                            已完成付款
                        </Button>
                        <p>取消訂單</p>
                    </div>
                </>
            )}
        </>
    );
};

export default infoDetail;
