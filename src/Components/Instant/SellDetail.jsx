import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';
import CompleteStatus from '../universal/CompleteStatus';
import Cancel from '../universal/Cancel';
import InstantNav from '../Instant/InstantNav';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const SellDetail = () => {
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  // Init State
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [tab, setTab] = useState('all');

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError, httpLoading } = httpErrorContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, sellMatch1, sellMatch2, statusWs, wsStatusData, wsStatusClient, cleanAll } =
    instantContext;

  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    statusWs(match.params.id);

    if (!sell1Data) sellMatch1(match.params.id);
    return () => {
      if (wsStatusClient) wsStatusClient.close();
      cleanAll();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    //eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (wsStatusData === 99 || wsStatusData === 98) {
      setShowComplete(true);
      setShowCancel(false);
    }

    if (wsStatusData === 34 || wsStatusData === 1) setShowComplete(true);

    // eslint-disable-next-line
  }, [wsStatusData]);

  // ===========
  //  function
  // ===========
  const handleClick = () => {
    sellMatch2(match.params.id);
  };

  const handleCancel = () => {
    // setOrderToken(match.params.id);
    setShowCancel(true);
  };

  const backToHome = () => {
    if (wsStatusClient) wsStatusClient.close();
    history.replace('/home/overview');
    cleanAll();
  };

  return (
    <>
      {/* {sell1Data && <Cancel show={showCancel} onHide={() => setShowCancel(false)} />} */}
      <Cancel
        show={showCancel}
        onHide={() => setShowCancel(false)}
        hash={sell1Data.Tx_HASH}
        token={match.params.id}
        type="instant"
      />
      <div className="container h_88">
        <div className="row mt-4">
          <div className="col-lg-10 col-12">
            <p className="welcome_txt pl-0" style={{ marginTop: 20 }}>
              歡迎登入
            </p>
            <div className="contentbox">
              <InstantNav tab={tab} setTab={setTab} jumpTo={true} />
              <div className="txt_12 pt_20">即時買賣</div>
              <div id="sell" className="tabcontent">
                {sell1Data && !showComplete ? (
                  <>
                    <div className="d-flex justify-content-between flex-column-mobile">
                      {/* Block-1  --pay info */}
                      <div className="w45_m100 mobile-width">
                        {/* Pay time */}
                        <div className="easy_counter mt-4 d-flex justify-content-start mb-2">
                          <span className="txt_12 mr-auto">收款方資料</span>
                          {/* <span className="i_clock" />
                          <span>剩餘支付時間：</span>
                          <span className="c_yellow">15分40秒</span> */}
                        </div>
                        {/* 收款方資料 */}
                        <div className="lightblue_bg txt_12 d-flex flex-column py-4">
                          <span className="txt_12_grey mb-4">收款方姓名：{sell1Data.P2}</span>
                          <span className="txt_12_grey mb-4">收款賬號：{sell1Data.P1}</span>
                          <span className="txt_12_grey mb-4">開戶銀行：{sell1Data.P3}</span>
                          <span className="txt_12_grey">所在省市：{sell1Data.P4}</span>
                        </div>

                        {/* 付款方資料 */}
                        <div className="w45_m100 mobile-width w-100">
                          <p className="txt_12 pt_20 mb-2">付款方資料</p>
                          <p className="txt_12_grey lightblue_bg py-4">付款方姓名：周明</p>
                        </div>
                      </div>

                      {/* Block-2  --交易資料 */}
                      <div className="easy_info mobile-width h-50 flex-order1-mobile p-4">
                        <div className="inline">
                          <div className="txt_12_grey">匯率：</div>
                          <span className="">{sell1Data.D1.toFixed(2)}</span>
                        </div>

                        <div className="right_txt16">
                          <span className="i_blue1" />
                          <span className="blue">買</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="txt_12_grey mb-0">總價</p>
                            <p className="c_blue">{sell1Data.D2.toFixed(2)} CNY</p>
                          </div>
                          <div>
                            <p className="txt_12_grey text-right mb-0">數量</p>
                            <p className="">{Math.abs(sell1Data.UsdtAmt).toFixed(2)} USDT</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    {httpLoading ? (
                      <Button
                        variant="primary"
                        className="easy-btn mw400 mobile-width"
                        style={{ marginTop: 50 }}
                        disabled
                      >
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        onClick={handleClick}
                        className="easy-btn mw400 mobile-width"
                        style={{
                          marginTop: 50,
                        }}
                      >
                        已完成付款
                      </Button>
                    )}
                    <div className="text-center">
                      <span
                        style={{
                          cursor: 'pointer',
                          paddingBottom: '2px',
                          borderBottom: '1px solid #262e45',
                          fontSize: 12,
                          color: '#262e45',
                          borderColor: '#262e45',
                        }}
                        // onClick={() => setShowCancel(true)}
                        onClick={handleCancel}
                      >
                        取消訂單
                      </span>
                    </div>

                    <FromFooter />
                  </>
                ) : sell1Data && showComplete ? (
                  <CompleteStatus
                    wsStatus={wsStatusData}
                    backToHome={backToHome}
                    hash={sell1Data.Tx_HASH}
                    type="buy"
                  />
                ) : (
                  <BaseSpinner />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellDetail;
