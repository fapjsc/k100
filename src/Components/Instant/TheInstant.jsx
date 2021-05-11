import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';
// import AuthContext from '../../context/auth/AuthContext';

// Components

// Style
import BaseSpinner from '../Ui/BaseSpinner';

const TheInstant = () => {
  // Route Props
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { connectInstantWs, instantData, setCountData, cleanAll } = instantContext;

  // HttpError Context
  const httpError = useContext(HttpErrorContext);
  const { httpLoading } = httpError;

  const handleClick = (exRate, cny, usdt, type, token) => {
    const data = {
      exRate,
      cny,
      usdt,
      type,
      token,
    };
    setCountData(data);
    history.replace('/home/instant');
  };

  useEffect(() => {
    connectInstantWs();

    return cleanAll();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <p className="welcome_txt">即時買賣</p>
      <div className="contentbox">
        <div className="tab ">
          <div>
            <button className="tablinks w_100" id="defaultOpen">
              即時買賣
            </button>
          </div>
          <div>
            {/* <span className="red_dot">2</span> */}
            <button className="tablinks w_100">進行中</button>
          </div>
        </div>

        {instantData.map(el => {
          if (el.MType === 2) {
            return (
              // {/*  賣 (對方是買) */}
              <div id="sell" className="tabcontent" key={uuidv4()}>
                <div className="">
                  <div className="txt_12 pt_20 inline mb-1">匯率：{el.D1}</div>
                  <div className="txt_12 pt_20 inline pl_20">
                    <span className="i_clock" />
                    <span className="">剩餘時間：</span>
                    <span className="c_yellow">13秒</span>
                  </div>

                  <div className="row bb1 mx-0">
                    <div className="lightblue_bg txt_16 col-md-8 col-12">
                      <div className="inline pl_20 w45_m100">
                        <span className="i_blue1" />
                        <span className="blue">
                          買&nbsp;
                          <span className="bold_22">{el.UsdtAmt}</span>
                          <span style={{ fontWeight: 'bold' }}> USDT</span>
                        </span>
                      </div>

                      <div className="inline pl_20">
                        <span className="i_cny" />
                        <span className>付&nbsp;{el.D2} CNY</span>
                      </div>
                    </div>

                    <div className="col-md-1" />
                    <div className="col-md-3 col-12">
                      <button
                        onClick={() => handleClick(el.D1, el.D2, el.UsdtAmt, '買', el.token)}
                        className="easy-btn margin0 w-100"
                      >
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (el.MType === 1) {
            return (
              //  {/* 買 (對方是賣) */}
              <div id="buy" className="tabcontent" key={uuidv4()}>
                <div className="w1140" />
                <div>
                  <div className="txt_12 pt_20 inline mb-1">匯率：{el.D1}</div>
                  <div className="txt_12 pt_20 inline pl_20">
                    <span className="i_clock" />
                    限時時間：
                    <span className="c_yellow">{el.DeltaTime} 秒</span>
                  </div>
                  <div className="row bb1 mx-0">
                    <div className="lightblue_bg txt_16 col-md-8 col-12">
                      <div className="inline pl_20 w45_m100">
                        <span className="i_red" />
                        <span className="red">
                          賣&nbsp;
                          <span className="bold_22">{el.UsdtAmt} </span>
                          <span style={{ fontWeight: 'bold' }}> USDT</span>
                        </span>
                      </div>
                      <div className="inline pl_20">
                        <span className="i_cny" />
                        <span className>收&nbsp;{el.D2} CNY</span>
                      </div>
                    </div>
                    <div className="col-md-1" />
                    <div className="col-md-3 col-12">
                      <button
                        onClick={() => handleClick(el.D1, el.D2, el.UsdtAmt, '賣', el.token)}
                        className="easy-btn margin0 w-100"
                      >
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}

        {httpLoading ? (
          <div className="mt-4">
            <BaseSpinner />
          </div>
        ) : null}

        {!httpLoading && !instantData.length ? (
          <h2 className="mt-4 text-center">目前沒有交易</h2>
        ) : null}
      </div>
    </>
  );
};

export default TheInstant;
