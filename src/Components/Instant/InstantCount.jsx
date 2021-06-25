import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import InstantContext from '../../context/instant/InstantContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import NoOrder from '../universal/NoOrder';

// Style
import Button from 'react-bootstrap/Button';

const InstantCount = props => {
  // Router Props
  const history = useHistory();

  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { errorText, setHttpError } = httpErrorContext;

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { countData, sellMatch1, buyMatch1, orderExists, setOrderExists } = instantContext;

  // ============
  //  UseEffect
  // ============
  useEffect(() => {
    if (errorText !== '') alert(errorText);
    return setHttpError('');
    // eslint-disable-next-line
  }, [errorText]);

  useEffect(() => {
    if (!orderExists) props.setShowPop(false);
    //eslint-disable-next-line
  }, [orderExists]);

  // ===========
  //  Function
  // ===========
  const handleClick = type => {
    if (!orderExists) return;
    props.setShowPop(true);

    if (type === '買') {
      sellMatch1(countData.token);
    } else {
      buyMatch1(countData.token);
    }
  };

  const onHide = () => {
    setOrderExists(true);
    history.replace('/home/overview');
  };

  return (
    <div id="buy" className="tabcontent">
      {countData && <NoOrder show={!orderExists} exRate={countData.exRate} type={countData.type} usdt={countData.usdt.toFixed(2)} onHide={onHide} />}
      {countData ? (
        <>
          <div className="txt_12 pt_20 mb-3 pl-1">即時買賣</div>

          <div className="easy_info mobile-width" style={{ float: 'inherit' }}>
            <div className="inline">
              <div className="txt_12_grey">匯率：</div>
              <span className="">{countData.exRate}</span>
            </div>

            <div className="right_txt16">
              {/* <span className="i_blue1" /> */}
              <span className={countData.type === '買' ? 'i_blue1' : 'i_red'} />
              <span className={countData.type === '買' ? 'blue' : 'red'}>{countData.type}</span>
            </div>

            <hr />

            <div className="inline ">
              <div className="txt_12_grey mobile-text">總價</div>
              <span className="c_blue mobile-text">{countData.cny} CNY</span>
            </div>

            <div className="inline pl_40 " style={{ float: 'right' }}>
              <div className="txt_12_grey mobile-text" style={{ textAlign: 'right' }}>
                數量
              </div>
              <span className="mobile-text">{countData.usdt.toFixed(2)} USDT</span>
            </div>
          </div>

          <Button onClick={() => handleClick(countData.type)} disabled={props.showPop} className="easy-btn mw400 btn-sm-screen-100" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            即時交易
          </Button>
        </>
      ) : (
        <h2>目前沒有交易</h2>
      )}
    </div>
  );
};

export default InstantCount;
