import { useContext, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TransferContext from '../../../context/transfer/TransferContext';
import Card from 'react-bootstrap/Card';

import errorIcon from '../../../Assets/icon-error-new.png';
import transIcon from '../../../Assets/icon_load02.gif';
import completeIcon from '../../../Assets/i_complete.png';

const TransferInfo = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const transferContext = useContext(TransferContext);
  const {
    orderDetail,
    closeWebSocket,
    transferStatus,
    detailReq,
    transferWebSocket,
    cleanStatus,
    setOrderToken,
    setUsdtCount,
  } = transferContext;

  const backToHome = () => {
    history.replace('/home/overview');
    closeWebSocket();
  };

  useEffect(() => {
    if (match.params.id) {
      detailReq(match.params.id);
      transferWebSocket(match.params.id);
    } else {
      history.replace('/home/overview');
    }

    return () => {
      closeWebSocket();
      cleanStatus();
      setOrderToken(null);
      setUsdtCount(null);
    };
    // eslint-disable-next-line
  }, []);

  if (transferStatus === 1) {
    return (
      <Card className="border-0">
        <div className="text-center">
          <img src={completeIcon} alt="complete icon" className="mb-4" />
          <h4 className="c_blue mb-4">交易成功</h4>
          <p className="txt_12_grey">
            交易回執：{orderDetail && orderDetail.Tx_HASH}
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
  } else if (transferStatus === 2) {
    return (
      <Card className="border-0">
        <div className="text-center">
          <img src={transIcon} alt="transfer icon" className="mb-4" />
          <h4 className="c_blue mb-4">轉帳中</h4>
          <p className="txt_12_grey">
            交易回執：{orderDetail && orderDetail.Tx_HASH}
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
  } else if (transferStatus === 97) {
    return (
      <Card className="border-0">
        <div className="text-center">
          <img src={errorIcon} alt="error icon" className="mb-4" />
          <h4 className="c_blue mb-4">轉帳失敗</h4>
          <p className="txt_12_grey">
            交易回執：{orderDetail && orderDetail.Tx_HASH}
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
      <Card className="border-0">
        <div className="text-center">
          {/* <img src={errorIcon} alt="error icon" /> */}
          <br />
          <h4 className="c_blue">沒有交易</h4>

          <button onClick={backToHome} className="easy-btn mw400">
            返回主頁
          </button>
          <br />
          {/* <p>詳細購買紀錄</p> */}
        </div>
      </Card>
    );
  }
};

export default TransferInfo;
