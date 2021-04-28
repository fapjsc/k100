import { useContext, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TransferContext from '../../../context/transfer/TransferContext';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

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
    transferOrderToken,
  } = transferContext;

  const backToHome = () => {
    history.replace('/home/overview');
    closeWebSocket();
    setOrderToken(null);
  };

  useEffect(() => {
    if (transferOrderToken === null) {
      history.replace('/home/transaction/transfer');
      closeWebSocket();
      cleanStatus();
      setUsdtCount(null);
    }

    // eslint-disable-next-line
  }, [transferOrderToken]);

  useEffect(() => {
    if (match.params.id) {
      detailReq(match.params.id);
      transferWebSocket(match.params.id);
    }

    return () => {
      closeWebSocket();
      cleanStatus();
      setUsdtCount(null);
      setOrderToken(null);
    };
    // eslint-disable-next-line
  }, []);

  if (transferStatus === 1) {
    return (
      <Card className="border-0">
        <div className="text-center">
          <img src={completeIcon} alt="complete icon" className="mb-4" />
          <h4 className="c_blue mb-4">交易成功</h4>
          <p className="txt_12_grey">轉帳地址：{orderDetail && orderDetail.P1}</p>
          <p className="txt_12_grey">交易回執：{orderDetail && orderDetail.Tx_HASH}</p>
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
          <p className="txt_12_grey">轉帳地址：{orderDetail && orderDetail.P1}</p>
          <p className="txt_12_grey">交易回執：{orderDetail && orderDetail.Tx_HASH}</p>
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
          <img
            src={errorIcon}
            alt="error icon"
            className="mb-4"
            style={{
              height: 110,
            }}
          />
          <h4 className="c_blue mb-4">轉帳失敗</h4>
          <p className="txt_12_grey">
            轉帳地址：{orderDetail && orderDetail.P1}
            <br />
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
          <Spinner animation="border" variant="primary" />

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
