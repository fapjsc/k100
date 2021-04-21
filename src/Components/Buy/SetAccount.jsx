import React from 'react';

const SetAccount = props => {
  const thousandBitSeparator = num => {
    return (
      num &&
      (num.toString().indexOf('.') != -1
        ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ',';
          })
        : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
            return $1 + ',';
          }))
    );
  };

  return (
    <div style={confirmBuyTextBox}>
      <div className="">
        <p className="txt_12_grey mb-0">總價</p>
        <p className="c_blue mb-0">
          {thousandBitSeparator(Number(props.rmbAmt).toFixed(2).toString())}
          CNY
        </p>
      </div>

      <div className="text-right">
        <p className="txt_12_grey mb-0">數量</p>
        <p className=" mb-0">
          {/* 小數第二位，千分逗號 */}
          {thousandBitSeparator(Number(props.usdtAmt).toFixed(2).toString())}
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
