import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import NoData from '../NoData';

// Style
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const TheInstant = () => {
  // Route Props
  const history = useHistory();

  // Init State
  const [token, setToken] = useState('');
  const [type, setType] = useState('');

  // Instant Context
  const instantContext = useContext(InstantContext);
  const {
    wsOnGoingData,
    sellMatch1,
    buyMatch1,
    sell1Data,
    buy1Data,
    setSell1Data,
    setBuy1Data,
    setCountData,
    setActionType,
  } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { btnLoading, errorText, setHttpError } = httpError;

  const handleClick = (token, type) => {
    setToken(token);
    setType(type);
    setCountData({ token });
    setActionType('onGoing');
  };

  // ==========
  // UseEffect
  // ==========
  useEffect(() => {
    if (!token) return;

    if (type === 'sell') {
      sellMatch1(token);
      setBuy1Data(null);
    }
    if (type === 'buy') {
      buyMatch1(token);
      setSell1Data(null);
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (sell1Data || buy1Data) history.replace(`/home/instant/`);
    // eslint-disable-next-line
  }, [buy1Data, sell1Data]);

  useEffect(() => {
    if (errorText) alert(errorText);
    return () => {
      setHttpError('');
    };
    // eslint-disable-next-line
  }, [errorText]);

  return (
    <section>
      {wsOnGoingData.length > 0 &&
        wsOnGoingData.map(el => {
          if (el.MType === 2) {
            return (
              <div id="sell" className="tabcontent" key={uuidv4()}>
                {/* header */}
                <div className="d-flex align-items-center mt-4" style={{ maxWidth: 186 }}>
                  <span className="txt_12 mr-auto">匯率：{el.D1.toFixed(2)}</span>
                  {/* <span className="i_clock" />
                  <span className="">限時時間：</span>
                  <span className="c_yellow">8秒</span> */}
                  {/* <span className="c_yellow">{el.DeltaTime} 秒</span> */}
                </div>

                {/* Body */}
                <div className="row bb1 mx-0">
                  <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
                    {/* Usdt */}
                    <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
                      <span className="i_blue1" />
                      <span className="blue mobile-text-md">買&nbsp;&nbsp;</span>
                      <span className="bold_22 blue mobile-text-md">
                        {el.UsdtAmt.toFixed(2)}&nbsp;
                      </span>
                      <span className="blue mobile-text-md" style={{ fontWeight: 'bold' }}>
                        USDT
                      </span>
                    </div>

                    {/* Cny */}
                    <div className="w-50">
                      <span className="i_cny" />
                      <span className="mobile-text-md">付&nbsp;{el.D2.toFixed(2)} CNY</span>
                    </div>
                  </div>

                  <div className="col-md-1" />

                  <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
                    <button
                      onClick={() => handleClick(el.token, 'sell')}
                      className="easy-btn margin0 w-100"
                    >
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div id="buy" className="tabcontent" key={uuidv4()}>
                {/* header */}
                <div className="d-flex align-items-center mt-4" style={{ maxWidth: 186 }}>
                  <span className="txt_12 mr-auto">匯率：{el.D1.toFixed(2)}</span>
                  {/* <span className="i_clock" />
                  <span className="">限時時間：</span>
                  <span className="c_yellow">8秒</span> */}
                  {/* <span className="c_yellow">{el.DeltaTime} 秒</span> */}
                </div>

                {/* Body */}
                <div className="row bb1 mx-0">
                  <div className="lightblue_bg txt_16 col-md-8 col-12 d-flex align-items-center justify-content-between-mobile">
                    {/* Usdt */}
                    <div className="ml-2 mobile-margin0 w-50" style={{ marginRight: 100 }}>
                      <span className="i_red" />
                      <span className="red mobile-text-md">賣&nbsp;&nbsp;</span>
                      <span className="bold_22 red mobile-text-md">
                        {el.UsdtAmt.toFixed(2)}&nbsp;
                      </span>
                      <span className="red mobile-text-md" style={{ fontWeight: 'bold' }}>
                        USDT
                      </span>
                    </div>
                    {/* Cny */}
                    <div className="w-50">
                      <span className="i_cny" />
                      <span className="mobile-text-md">收&nbsp;{el.D2.toFixed(2)} CNY</span>
                    </div>
                  </div>

                  <div className="col-md-1" />

                  {/* Button */}
                  <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
                    {btnLoading ? (
                      <Button variant="primary" disabled>
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
                      <button
                        onClick={() => handleClick(el.token, 'buy')}
                        className="easy-btn margin0 w-100"
                      >
                        詳細
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}

      {!wsOnGoingData.length && <NoData />}
    </section>
  );
};

export default TheInstant;
