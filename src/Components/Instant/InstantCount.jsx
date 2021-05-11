import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import FromFooter from '../Layout/FormFooter';
import Pairing from '../universal/Pairing';

// Style
import Button from 'react-bootstrap/Button';

const InstantCount = () => {
  // Router Props
  const history = useHistory();

  // Init State
  const [showPop, setShowPop] = useState(false);

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    countData,
    sellMatch1,
    sell1Data,
    setSell1Data,
    setCountData,
    buyMatch1,
    setBuy1Data,
    buy1Data,
  } = instantContext;

  useEffect(() => {
    if (!countData) history.replace('/home/overview');

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorText !== '') alert(errorText);
    return setHttpError('');
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (sell1Data || buy1Data) history.replace(`/home/instant/${countData.token}`);
    // eslint-disable-next-line
  }, [sell1Data, buy1Data]);

  const handleClick = type => {
    setShowPop(true);

    if (type === '買') {
      sellMatch1(countData.token);
    } else {
      buyMatch1(countData.token);
    }
  };

  const handleClosePop = () => {
    history.replace('/home/overview');
    setSell1Data(null);
    setCountData(null);
    setBuy1Data(null);
  };

  return (
    <>
      <Pairing
        show={showPop}
        onHide={handleClosePop}
        usdt={sell1Data && sell1Data.UsdtAmt}
        rmb={sell1Data && sell1Data.D2}
      />
      <div className="container h_88">
        <div className="row">
          <div className="col-12">
            <p className="welcome_txt pl-0 mt-4">歡迎登入</p>
            <div className="contentbox">
              <div className="tab">
                <button className="tablinks w_100">即時買賣</button>
                <button className="tablinks w_100">
                  進行中
                  {/* <span className="red_dot">2</span> */}
                </button>
              </div>
              <div id="buy" className="tabcontent">
                {countData ? (
                  <>
                    <div className="txt_12 pt_20 mb-3 pl-1">即時買賣</div>

                    <div className="easy_info" style={{ float: 'inherit' }}>
                      <div className="inline">
                        <div className="txt_12_grey">匯率：</div>
                        <span className>{countData.exRate}</span>
                      </div>

                      <div className="right_txt16">
                        {/* <span className="i_blue1" /> */}
                        <span className={countData.type === '買' ? 'i_blue1' : 'i_red'} />
                        <span className={countData.type === '買' ? 'blue' : 'red'}>
                          {countData.type}
                        </span>
                      </div>

                      <hr />

                      <div className="inline">
                        <div className="txt_12_grey">總價</div>
                        <span className="c_blue">{countData.cny} CNY</span>
                      </div>

                      <div className="inline pl_40" style={{ float: 'right' }}>
                        <div className="txt_12_grey" style={{ textAlign: 'right' }}>
                          數量
                        </div>
                        {countData.usdt.toFixed(2)} USDT
                      </div>
                    </div>

                    <Button
                      onClick={() => handleClick(countData.type)}
                      disabled={showPop}
                      className="easy-btn mw400"
                      style={{ marginTop: '4rem', marginBottom: '4rem' }}
                    >
                      即時交易
                    </Button>
                  </>
                ) : (
                  <h2>目前沒有交易</h2>
                )}

                <FromFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstantCount;
