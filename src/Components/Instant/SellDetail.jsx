import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Countdown from 'react-countdown';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';
import BuyContext from '../../context/buy/BuyContext';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';
import CompleteStatus from '../universal/CompleteStatus';
import Cancel from '../universal/Cancel';
import InstantNav from '../Instant/InstantNav';
import CountDownTimer from '../universal/countDownTimer';
import Timer from '../Buy/Timer';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const SellDetail = () => {
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError, httpLoading } = httpErrorContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { deltaTime, GetDeltaTime, setDeltaTime } = buyContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { sell1Data, sellMatch1, sellMatch2, statusWs, wsStatusData, wsStatusClient, cleanAll } =
    instantContext;

  // Init State
  const [overTime1, setOvertime1] = useState(false);
  const [overTime2, setOvertime2] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [tab, setTab] = useState('all');
  const [timeLeft, setTimeLeft] = useState(Date.now() + 1000 * 60 * 15 - deltaTime * 1000);
  const [timeLeft2, setTimeLeft2] = useState(Date.now() + 1000 * 60 * 30 - deltaTime * 1000);

  // ===========
  //  useEffect
  // ===========
  useEffect(() => {
    statusWs(match.params.id);
    GetDeltaTime(match.params.id);

    if (!sell1Data) sellMatch1(match.params.id);
    return () => {
      if (wsStatusClient) wsStatusClient.close();
      setDeltaTime(null);
      cleanAll();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeLeft(Date.now() + 1000 * 60 * 15 - deltaTime * 1000);
    setTimeLeft2(Date.now() + 1000 * 60 * 30 - deltaTime * 1000);

    if (deltaTime > 1800) setOvertime2(true);
    if (deltaTime > 900 && deltaTime <= 1800) setOvertime1(true);
  }, [deltaTime]);

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
    setShowCancel(true);
  };

  const handleCountDownComplete = () => {
    setOvertime1(true);
  };

  const handleCountDownComplete2 = () => {
    setOvertime2(true);
  };

  const backToHome = () => {
    if (wsStatusClient) wsStatusClient.close();
    history.replace('/home/overview');
    setOvertime1(false);
    setOvertime2(false);
    setDeltaTime(null);
    cleanAll();
  };

  return (
    <>
      <Cancel
        show={showCancel}
        onHide={() => setShowCancel(false)}
        hash={sell1Data.Tx_HASH}
        token={match.params.id}
        type="instant"
      />
      <div className="row mt-4">
        <div className="col-xl-8 col-12">
          <p className="welcome_txt pl-0" style={{ marginTop: 20 }}>
            歡迎登入
          </p>
          <div className="contentbox">
            <InstantNav tab={tab} setTab={setTab} jumpTo={true} />
            <div className="txt_12 pt_20">即時買賣</div>
            <div id="sell" className="tabcontent">
              {sell1Data && !showComplete ? (
                <>
                  {/* 第一階段倒數結束前 */}
                  {!overTime1 && (
                    <div className="d-flex justify-content-between flex-column-mobile">
                      {/* Block-1  --pay info */}
                      <div className="w45_m100 mobile-width">
                        <div className="easy_counter mt-4 d-flex justify-content-start align-items-center mb-2">
                          <span className="txt_12 mr-auto">收款方資料</span>
                          <span className="i_clock mr-1 mb-1" />
                          <span className="txt_12">剩餘支付時間：</span>
                          <Countdown
                            onComplete={handleCountDownComplete}
                            renderer={CountDownTimer}
                            date={timeLeft}
                          />
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
                  )}

                  {/* 第二階段倒數結束 */}
                  {overTime2 && (
                    <div>
                      <h2 className="txt_18 text-center my-4" style={{ color: '#242e47' }}>
                        交易已逾時
                      </h2>
                      <Button
                        onClick={backToHome}
                        className="easy-btn mw400 mobile-width"
                        variant="primary"
                      >
                        回首頁
                      </Button>
                    </div>
                  )}

                  {/* Button --正常 */}
                  {!overTime1 && (
                    <>
                      {httpLoading ? (
                        <Button
                          variant="secondary"
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
                          disabled={overTime1}
                          className="easy-btn mw400 mobile-width"
                          style={{
                            marginTop: 50,
                          }}
                        >
                          已完成付款
                        </Button>
                      )}
                    </>
                  )}

                  {/* Button --倒數 */}
                  {overTime1 && !overTime2 ? (
                    <>
                      {httpLoading ? (
                        <Button
                          variant="secondary"
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
                          disabled={overTime2}
                          className="easy-btn mw400 mobile-width"
                          style={{
                            marginTop: 50,
                          }}
                        >
                          <Countdown
                            onComplete={handleCountDownComplete2}
                            renderer={Timer}
                            date={timeLeft2}
                          />
                          &nbsp; 已完成付款
                        </Button>
                      )}
                    </>
                  ) : null}

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
                // 交易結果
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
    </>
  );
};

export default SellDetail;
