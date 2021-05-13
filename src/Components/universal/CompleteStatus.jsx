import { useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

// Context
import HistoryContext from '../../context/history/HistoryContext';
import InstantContext from '../../context/instant/InstantContext';

// Components
import HistoryDetail from '../History/HistoryAllDetail';

// Style
import Card from 'react-bootstrap/Card';

const CompleteStatus = props => {
  // Router Props
  const match = useRouteMatch();

  // Init State
  const [show, setShow] = useState(false);

  // History Context
  const historyContext = useContext(HistoryContext);
  const { singleDetail, detailReq, setSingleDetail } = historyContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, buy1Data } = instantContext;

  const handleClick = () => {
    if (sell1Data || buy1Data) {
      handleInstantData();
    } else {
      detailReq(match.params.id);
    }
    setShow(true);
  };

  const handleHide = () => {
    setShow(false);
  };

  const handleInstantData = () => {
    let orderDetail;

    if (sell1Data) {
      orderDetail = {
        date: sell1Data.CreateDate,
        txHASH: sell1Data.Tx_HASH,
        usdtAmt: sell1Data.UsdtAmt,
        account: sell1Data.P1,
        payee: sell1Data.P2,
        bank: sell1Data.P3,
        branch: sell1Data.P4,
        exchangePrice: sell1Data.D1,
        rmb: sell1Data.D2,
        charge: sell1Data.D3,
        orderState: sell1Data.Order_StatusID,
        type: 0,
      };
    }

    if (buy1Data) {
      orderDetail = {
        date: buy1Data.CreateDate,
        txHASH: buy1Data.Tx_HASH,
        usdtAmt: buy1Data.UsdtAmt,
        account: buy1Data.P1,
        payee: buy1Data.P2,
        bank: buy1Data.P3,
        branch: buy1Data.P4,
        exchangePrice: buy1Data.D1,
        rmb: buy1Data.D2,
        charge: buy1Data.D3,
        orderState: buy1Data.Order_StatusID,
        type: 1,
      };
    }

    setSingleDetail(orderDetail);
  };

  if (props.wsStatus === 34) {
    return (
      <Card className="border-0 text-center">
        <div className="i_notyet mt-4" />
        <h4 className="c_blue">已提交，等待確認中</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        {props.type === 'buy' && (
          <p className="txt_12_grey text-break">
            購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
          </p>
        )}

        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 1) {
    return (
      <>
        {singleDetail && <HistoryDetail show={show} onHide={handleHide} />}

        <Card className="border-0 text-center">
          <div className="i_done mt-4" />
          <h4 className="c_blue">交易完成</h4>
          <br />
          <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
          {props.type === 'buy' && (
            <p className="txt_12_grey text-break">
              購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
            </p>
          )}
          <br />
          <button onClick={props.backToHome} className="easy-btn mw400">
            返回主頁
          </button>
          <span className="txt_12_grey" style={{ cursor: 'pointer' }} onClick={handleClick}>
            詳細交易紀錄
          </span>
        </Card>
      </>
    );
  }

  if (props.wsStatus === 99) {
    return (
      <Card className="border-0 text-center">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">交易取消</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 98) {
    return (
      <Card className="border-0 text-center">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">交易超時</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }
};

export default CompleteStatus;
