import React from 'react';

const SetAccount = props => {
  return (
    <div style={confirmBuyTextBox}>
      <div className="">
        <p className="txt_12_grey mb-0">總價</p>
        <p className="c_blue mb-0">
          {Number(props.rmbAmt)
            .toFixed(2)
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}{' '}
          CNY
        </p>
      </div>

      <div className="text-right">
        <p className="txt_12_grey mb-0">數量</p>
        <p className=" mb-0">
          {/* 小數第二位，千分逗號 */}
          {Number(props.usdtAmt)
            .toFixed(2)
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}{' '}
          USDT
        </p>
      </div>
    </div>
  );
};

const confirmBuyTextBox = {
  padding: 20,
  borderRadius: '5px',
  border: '2px solid #3f80fa',
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '20px',
  fontWeight: 'bold',
};

export default SetAccount;
