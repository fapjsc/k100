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
  const { sell1Data, setSell1Data, setCountData, sellMatch1, sellMatch2, wsStatusData, cleanAll } =
    instantContext;

  useEffect(() => {
    sellMatch1(match.params.id);
    return () => {
      setSell1Data(null);
      setCountData(null);
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
    if (sell1Data) {
      if (sell1Data.Order_StatusID === 34 || sell1Data.Order_StatusID === 1) setShowComplete(true);
    }
    // eslint-disable-next-line
  }, [sell1Data]);

  useEffect(() => {
    if (wsStatusData === 99 || wsStatusData === 98) {
      setShowComplete(true);
      setShowCancel(false);
    }

    // eslint-disable-next-line
  }, [wsStatusData]);

  const handleClick = () => {
    sellMatch2(match.params.id);
  };

  const handleCancel = () => {
    // setOrderToken(match.params.id);
    setShowCancel(true);
  };

  const backToHome = () => {
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
          <div className="col-10">
            <p className="welcome_txt pl-0">歡迎登入</p>
            <div className="contentbox">
              <InstantNav tab={tab} setTab={setTab} jumpTo={true} />

              <div id="buy" className="tabcontent">
                {sell1Data && !showComplete ? (
                  <>
                    <div className="txt_12 pt_20">即時買賣</div>
                    <div className="easy_info" style={{}}>
                      <div className="inline">
                        <div className="txt_12_grey">匯率：</div>
                        <span className="">{sell1Data.D1.toFixed(2)}</span>
                      </div>
                      {sell1Data.MasterType === 1 ? (
                        <div className="right_txt16">
                          <span className="i_blue1" />
                          <span className="blue">買</span>
                        </div>
                      ) : (
                        <div className="right_txt16">
                          <span className="i_red" />
                          <span className="red">賣</span>
                        </div>
                      )}

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

                      {/* <div className="inline bg-info">
                  <div className="txt_12_grey">總價</div>
                  <span className="c_blue">6450.00 CNY</span>
                </div>

                <div className="inline pl_40 mt-4 bg-info" style={{ float: 'right' }}>
                 
                </div> */}
                    </div>
                    <div className="easy_counter mt-4 d-flex justify-content-between  w45_m100 mb-2">
                      <div>
                        <span className="txt_12 pt_20">收款方資料</span>
                      </div>
                      {/* <div>
                      <span className="i_clock" />
                      <span>剩餘支付時間：</span>
                      <span className="c_yellow">15分40秒</span>
                    </div> */}
                    </div>

                    <div className="lightblue_bg txt_12 w45_m100 d-flex flex-column">
                      <span className="txt_12_grey  mb-3">收款方姓名：{sell1Data.P2}</span>

                      <span className="txt_12_grey  mb-3">收款賬號：{sell1Data.P1}</span>

                      <span className="txt_12_grey  mb-3">開戶銀行：{sell1Data.P3}</span>

                      <span className="txt_12_grey ">所在省市：{sell1Data.P4}</span>
                    </div>

                    <div className="txt_12 pt_20 mb-2">付款方資料</div>
                    <div className="lightblue_bg txt_12 w45_m100">
                      <span className="txt_12_grey">付款方姓名：周明</span>
                    </div>

                    {httpLoading ? (
                      <Button
                        variant="primary"
                        className="easy-btn mw400"
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
                        className="easy-btn mw400"
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
