import { useContext, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Context
import TransferContext from '../../../context/transfer/TransferContext';

// Lang Context
import { useI18n } from '../../../lang';

// Style
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import errorIcon from '../../../Assets/icon-error-new.png';
import transIcon from '../../../Assets/icon_load02.gif';
import completeIcon from '../../../Assets/i_complete.png';

const TransferInfo = () => {
  // Lang Context
  const { t } = useI18n();

  const history = useHistory();
  const match = useRouteMatch();
  const transferContext = useContext(TransferContext);
  const { orderDetail, closeWebSocket, transferStatus, detailReq, transferWebSocket, cleanStatus, setOrderToken, setUsdtCount, transferOrderToken } = transferContext;

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
          <h4 className="c_blue mb-4">{t('transfer_info_success')}</h4>
          <p className="txt_12_grey">
            {t('transfer_info_address')}：{orderDetail && orderDetail.data.P1}
          </p>
          <p className="txt_12_grey">
            {t('transfer_info_hash')}：{orderDetail && orderDetail.data.Tx_HASH}
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            {t('btn_back_home')}
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
          <h4 className="c_blue mb-4">{t('transfer_info_loading')}</h4>
          <p className="txt_12_grey">
            {t('transfer_info_address')}：{orderDetail && orderDetail.data.P1}
          </p>
          <p className="txt_12_grey">
            {t('transfer_info_hash')}：{orderDetail && orderDetail.data.Tx_HASH}
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            {t('btn_back_home')}
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
          <h4 className="c_blue mb-4">{t('transfer_info_fail')}</h4>
          <p className="txt_12_grey">
            {t('transfer_info_address')}：{orderDetail && orderDetail.data.P1}
            <br />
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            {t('btn_back_home')}
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
            {t('btn_back_home')}
          </button>
          <br />
          {/* <p>詳細購買紀錄</p> */}
        </div>
      </Card>
    );
  }
};

export default TransferInfo;
