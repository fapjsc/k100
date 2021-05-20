import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Components
import TheInstant from '../Instant/TheInstant';

// Style
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './index.scss';

const OverView = () => {
  const history = useHistory();

  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) history.replace('/auth/login');
    setAgent(localStorage.getItem('agent'));
    // eslint-disable-next-line
  }, []);

  // state = {
  //   agent: null,
  // };
  // componentDidMount() {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     this.props.history.replace('/auth/login');
  //     return;
  //   }

  //   this.setState({
  //     agent: localStorage.getItem('agent'),
  //   });
  // }

  return (
    <Container style={{ maxWidth: '1140px' }} className="mt-4">
      <p className="welcome_txt text-left pl-0">歡迎登入</p>
      <Row className="">
        <Col className="" as={Col} md={3} xs={6}>
          <Link className="home_btn w-100" to="/home/transaction/buy">
            <div className="trade"></div>
            <p>買賣</p>
          </Link>
        </Col>
        <Col className="" as={Col} md={3} xs={6}>
          <Link className="home_btn w-100" to="/home/transaction/transfer">
            <div className="i_01"></div>
            <p>轉賬</p>
          </Link>
        </Col>

        <Col className="" as={Col} md={3} xs={6}>
          <Link className="home_btn w-100" to="/home/wallet">
            <div className="i_wallet"></div>
            <p>我的錢包</p>
          </Link>
        </Col>
        <Col className="" as={Col} md={3} xs={6}>
          <Link className="home_btn w-100" to="/home/history">
            <div className="i_trans"></div>
            <p>交易紀錄</p>
          </Link>
        </Col>
      </Row>

      {agent && (
        <Row className="mt-4">
          <Col lg={12}>
            <TheInstant />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OverView;
