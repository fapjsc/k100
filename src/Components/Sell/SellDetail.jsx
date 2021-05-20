import { useContext, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

// Context
import SellContext from '../../context/sell/SellContext';

// Components
import SetAccount from '../Buy/SetAccount';
import FormFooter from '../Layout/FormFooter';

// Style
import btnWait from '../../Assets/btn_wait.png';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SellDetail = () => {
  // Router Props
  const match = useRouteMatch();

  // Init State
  const [isClick, setIsClick] = useState(false);

  // Sell Context
  const sellContext = useContext(SellContext);
  const { wsData, setConfirmSell, confirmSellAction, sellStatus } = sellContext;

  // 確認收款
  const handleSubmit = () => {
    if (!isClick) {
      setConfirmSell(true);
      confirmSellAction(match.params.id);
    }

    setIsClick(true);
  };

  return (
    <Container>
      <Row className="mb-2 mt-4">
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

      <Row className="mb-2 justify-content-between">
        <Col xl={6} className="txt_12 lightblue_bg h-100">
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
      <Row className="justify-content-center mt-4">
        <Col className="mw400 text-center px-0">
          <Button
            onClick={handleSubmit}
            className=""
            block
            style={sellStatus === 34 ? infoBtn : infoBtnDisabled}
          >
            {sellStatus === 33 && (
              <img
                src={btnWait}
                alt="btn wait"
                style={{
                  height: 25,
                  marginRight: 10,
                }}
              />
            )}

            <span className="">{sellStatus === 34 ? ' 買家已付款，確認收款' : '對方準備中'}</span>
          </Button>
        </Col>
      </Row>

      <FormFooter />
    </Container>
  );
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

export default SellDetail;
