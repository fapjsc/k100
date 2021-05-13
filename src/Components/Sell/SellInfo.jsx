import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// ConText
import SellContext from '../../context/sell/SellContext';

// Components
import SellHeaders from './SellHeader';
// import SellCompleted from './SellCompleted';
import SetAccount from '../Buy/SetAccount';
import Chat from '../Chat';
import CancelSell from './CancelSell';
import FromFooter from '../Layout/FormFooter';
import CompleteStatus from '../universal/CompleteStatus';
import BaseSpinner from '../Ui/BaseSpinner';

// Style
import helpIcon from '../../Assets/i_ask2.png';
import btnWait from '../../Assets/btn_wait.png';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SellInfo = () => {
  // Break Points
  const lapTopBig = useMediaQuery({ query: '(max-width: 1200px)' });

  // Router Props
  const history = useHistory();

  let { id } = useParams();
  const sellContext = useContext(SellContext);
  const {
    wsData,
    closeWebSocket,
    payment,
    cancelOrder,
    confirmSellAction,
    confirmSell,
    sellWebSocket,
    CleanAll,
    setConfirmSell,
    wsClient,
  } = sellContext;

  const [isChat, setIsChat] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (id) sellWebSocket(id);
    return () => {
      if (wsClient) wsClient.close();
      if (id) closeWebSocket(id);
      CleanAll();
    };
    // eslint-disable-next-line
  }, []);

  const handleChat = () => {
    setIsChat(!isChat);
  };

  // 確認收款
  const handleSubmit = () => {
    if (!isClick) {
      setConfirmSell(true);
      confirmSellAction(id);
    }

    setIsClick(true);
  };

  const backToHome = () => {
    if (wsClient) wsClient.close();
    closeWebSocket(id);
    history.replace('/home/overview');

    CleanAll();
  };

  // confirmSell 判斷要render sell info 還是 提交確認/交易完成組件
  if (!confirmSell && wsData) {
    return (
      <Fragment>
        <CancelSell
          handleClose={setShowCancel}
          show={showCancel}
          cancelOrder={cancelOrder}
          orderToken={id && id}
          hash={wsData && wsData.Tx_HASH}
        />
        <SellHeaders />
        <Container>
          <Row className="mb-2">
            <Col className="mt-4 pl-1">
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                className="mb-0"
              >
                提交資料
              </p>
            </Col>
          </Row>

          <Row className=" mb-2 justify-content-between">
            <Col xl={6} className="txt_12 lightblue_bg mb-4">
              <p>
                收款金額： &emsp;
                <span
                  style={{
                    color: '#3e80f9',
                    fontSize: '17px',
                    fontWeight: 'bold',
                  }}
                >
                  {wsData && wsData.D2 + ` CNY`}
                </span>
              </p>
              <p>收款姓名：{wsData && wsData.P2}</p>
              <p>付款帳號：{wsData && wsData.P1}</p>
              <p>開戶銀行：{wsData && wsData.P3}</p>
              <p>所在省市：{wsData && wsData.P4}</p>
            </Col>

            {wsData && (
              <Col xl={5} className="pl-4">
                <SetAccount
                  usdtAmt={Math.abs(wsData.UsdtAmt).toFixed(2)}
                  rmbAmt={wsData.D2.toFixed(2)}
                />
              </Col>
            )}
          </Row>
          <Row className="justify-content-center">
            <Col className="mw400 text-center px-0">
              <Button
                onClick={handleSubmit}
                className=""
                block
                style={payment ? infoBtn : infoBtnDisabled}
              >
                {!payment && (
                  <img
                    src={btnWait}
                    alt="btn wait"
                    style={{
                      height: 25,
                      marginRight: 10,
                    }}
                  />
                )}

                <span className="">{payment ? ' 買家已付款，確認收款' : '對方準備中'}</span>
              </Button>
            </Col>
          </Row>
          {/* Footer */}
          <FromFooter />
        </Container>

        {/* Chat */}
        {lapTopBig && wsData ? (
          <Fragment>
            <Button style={helpBtn} variant="primary" onClick={handleChat}>
              <img
                style={{
                  width: 15,
                  height: 20,
                  marginRight: 8,
                }}
                src={helpIcon}
                alt="help icon"
              />
              幫助
            </Button>
            <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={isChat} />
          </Fragment>
        ) : null}

        {/* 1200px */}
        {wsData && !lapTopBig ? (
          <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={true} />
        ) : null}
      </Fragment>
    );
  } else if (confirmSell && wsData) {
    return (
      // 已提交以及交易完成，isCompleted判斷是否完成交易
      <Fragment>
        {/* <CompleteStatus
          Tx_HASH={wsData && wsData.Tx_HASH}
          isCompleted={sellIsCompleted}
          cleanAll={CleanAll}
        /> */}

        <CompleteStatus
          wsStatus={wsData.Order_StatusID}
          backToHome={backToHome}
          hash={wsData && wsData.Tx_HASH}
          type="sell"
        />

        {/* Chat */}
        <Button style={helpBtn} variant="primary" onClick={handleChat}>
          <img
            style={{
              width: 15,
              height: 20,
              marginRight: 8,
            }}
            src={helpIcon}
            alt="help icon"
          />
          幫助
        </Button>

        {wsData ? <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={isChat} /> : null}
      </Fragment>
    );
  } else return <BaseSpinner />;
};

const infoBtn = {
  backgroundColor: '#3E80F9',
  borderRadius: '5px',
  color: '#fff',
  width: '100%',
  padding: '15px',
  margin: '10px auto 15px',
  border: 'none',
  transition: '0.3s',
  cursor: 'pointer',
  fontSize: '17px',
};

const infoBtnDisabled = {
  backgroundColor: 'grey',
  borderRadius: '5px',
  color: '#fff',
  width: '100%',
  padding: '15px',
  margin: '10px auto 15px',
  border: 'none',
  transition: '0.3s',
  fontSize: '17px',
  opacity: '0.65',
  cursor: 'not-allowed',
};

// const cancelLink = {
//   fontSize: 15,
//   fontWeight: 'bold',
//   borderBottom: '1px solid grey',
//   display: 'inline-block',
//   cursor: 'pointer',
// };

const helpBtn = {
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 5,
  paddingBottom: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '1rem 2rem',
  fontSize: '1.5rem',
  fontWeight: 300,
  borderRadius: '10rem',
  position: 'fixed',
  bottom: '5%',
  right: '5%',
  backgroundColor: '#F80FA',
};

export default SellInfo;
