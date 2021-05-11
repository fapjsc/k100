import { useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import FromFooter from '../Layout/FormFooter';
import BaseSpinner from '../Ui/BaseSpinner';
import CompleteStatus from '../universal/CompleteStatus';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const BuyDetail = () => {
  // Router Props
  const match = useRouteMatch();
  const history = useHistory();

  // Init State
  const [showComplete, setShowComplete] = useState(false);

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError, httpLoading } = httpErrorContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { buy1Data, setBuy1Data, wsStatusData, buyMatch1, buyMatch2, cleanAll } = instantContext;

  useEffect(() => {
    // buyMatch1(match.params.id);

    return () => {
      setBuy1Data(null);
      setBuy1Data(null);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (buy1Data) {
      if (
        buy1Data.Order_StatusID === 34 ||
        buy1Data.Order_StatusID === 1 ||
        buy1Data.Order_StatusID === 99 ||
        buy1Data.Order_StatusID === 98
      )
        setShowComplete(true);
    }
  }, [buy1Data]);

  const handleClick = () => {
    buyMatch2(match.params.id);
  };

  const backToHome = () => {
    history.replace('/home/overview');
    cleanAll();
  };

  return (
    <>
      <div className="container h_88">
        <div className="row mt-4">
          <div className="col-10">
            <p className="welcome_txt pl-0">歡迎登入</p>
            <div className="contentbox">
              <div className="tab">
                <button className="tablinks w_100" id="defaultOpen">
                  即時買賣
                </button>
                <button className="tablinks w_100">
                  進行中
                  {/* <span className="red_dot">2</span> */}
                </button>
              </div>

              <div id="buy" className="tabcontent">
                {buy1Data && !showComplete ? (
                  <>
                    <div className="txt_12 pt_20">即時買賣</div>
                    <div className="easy_info" style={{}}>
                      <div className="inline">
                        <div className="txt_12_grey">匯率：</div>
                        <span className>{buy1Data.D1}</span>
                      </div>

                      <div className="right_txt16">
                        <span className="i_red" />
                        <span className="red">賣</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="txt_12_grey mb-0">總價</p>
                          <p className="c_blue">{buy1Data.D2}CNY</p>
                        </div>
                        <div>
                          <p className="txt_12_grey text-right mb-0">數量</p>
                          <p className="">{Math.abs(buy1Data.UsdtAmt)} USDT</p>
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
                      <span className="txt_12_grey  mb-3">收款方姓名：{buy1Data.P2}</span>

                      <span className="txt_12_grey  mb-3">收款賬號：{buy1Data.P1}</span>

                      <span className="txt_12_grey  mb-3">開戶銀行：{buy1Data.P3}</span>

                      <span className="txt_12_grey ">所在省市：{buy1Data.P4}</span>
                    </div>

                    <div className="txt_12 pt_20 mb-2">付款方資料</div>
                    <div className="lightblue_bg txt_12 w45_m100">
                      <span className="txt_12_grey">付款方姓名：周明</span>
                    </div>

                    {wsStatusData === 33 ? (
                      <button className="mw400 disable-easy-btn">
                        <span className="i_ready"></span>對方準備中
                      </button>
                    ) : null}

                    {wsStatusData === 34 && !httpLoading ? (
                      <Button
                        onClick={handleClick}
                        className="easy-btn mw400"
                        style={{
                          marginTop: 50,
                        }}
                      >
                        確認到帳
                      </Button>
                    ) : null}

                    {wsStatusData === 34 && httpLoading ? (
                      <Button className="disable-easy-btn  mw400" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>
                    ) : null}

                    <FromFooter />
                  </>
                ) : buy1Data && showComplete ? (
                  <CompleteStatus
                    wsStatus={wsStatusData}
                    backToHome={backToHome}
                    hash={buy1Data.Tx_HASH}
                    type="sell"
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

export default BuyDetail;
