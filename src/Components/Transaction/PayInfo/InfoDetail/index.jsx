import React from 'react';

const index = props => {
    return (
        <div className="pair-textBox">
            <p>
                付款金額: &emsp;
                <span>{props.transferData.D2}</span>
            </p>
            <p>收款姓名: {props.transferData.P2}</p>
            <p>付款帳號: {props.transferData.P1}</p>
            <p>開戶銀行: {props.transferData.P3}</p>
            <p>所在省市: {props.transferData.P4}</p>
        </div>
    );
};

export default index;
