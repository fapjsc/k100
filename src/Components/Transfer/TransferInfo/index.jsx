import { useEffect } from 'react';

import Card from 'react-bootstrap/Card';

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
  detailReq,
  hash,
}) => {
  useEffect(() => {
    submitTransaction(match.params.id);
    detailReq(match.params.id);

    // eslint-disable-next-line
  }, []);

  if (!isloading && isComplete) {
    return (
      <Card className="border-0">
        <div className="text-center">
          <div className="i_done" />
          <h4 className="c_blue">交易完成</h4>
          <p className="txt_12_grey">
            交易回執：{hash}
            <br />
            購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            返回主頁
          </button>
          <br />
          {/* <p>詳細購買紀錄</p> */}
        </div>
      </Card>
    );
  } else {
    return (
      <OnLoading
        show={isloading}
        isfailed={isfailed ? 1 : 0}
        isloading={isloading ? 1 : 0}
        onHide={onHide}
        usdtcount={location.state ? location.state.item.UsdtAmt : null}
      />
    );
  }
};

export default TransferInfo;
