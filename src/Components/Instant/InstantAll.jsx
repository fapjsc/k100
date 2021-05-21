import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Context
import InstantContext from '../../context/instant/InstantContext';

// Components
import NoData from '../NoData';

// Style

const TheInstant = () => {
  // Route Props
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { instantData, setCountData } = instantContext;

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
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      {instantData.length > 0 &&
        instantData.map(el => {
          if (el.MType === 2) {
            return (
              <div id="sell" className="tabcontent mt-4" key={uuidv4()}>
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
                    <div className="ml-2 mobile-margin0" style={{ marginRight: 100 }}>
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
                    <div className="">
                      <span className="i_cny" />
                      <span className="mobile-text-md">付&nbsp;{el.D2.toFixed(2)} CNY</span>
                    </div>
                  </div>

                  <div className="col-md-1" />

                  {/* Button */}
                  <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
                    <button
                      onClick={() =>
                        handleClick(el.D1.toFixed(2), el.D2.toFixed(2), el.UsdtAmt, '買', el.token)
                      }
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
                    <div className="ml-2 mobile-margin0" style={{ marginRight: 100 }}>
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
                    <div className="">
                      <span className="i_cny" />
                      <span className="mobile-text-md">收&nbsp;{el.D2.toFixed(2)} CNY</span>
                    </div>
                  </div>

                  <div className="col-md-1" />

                  {/* Button */}
                  <div className="col-md-3 col-12 px-0 mobile-marginTop mw400 mx-auto">
                    <button
                      onClick={() =>
                        handleClick(el.D1.toFixed(2), el.D2.toFixed(2), el.UsdtAmt, '賣', el.token)
                      }
                      className="easy-btn margin0 w-100"
                    >
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}

      {!instantData.length && <NoData />}
    </section>
  );
};

export default TheInstant;
