import React, { Component } from 'react';
import { useMediaQuery } from 'react-responsive';

import InfoDetail from './InfoDetail';
// import Timer from '../Timer';
import ButtonTimer from '../ButtonTimer';
import BaseSpinner from '../../Ui/BaseSpinner';
import Chat from '../../Chat';
import ExRate from '../ExRate';

import CountDownUnreset from '../CountDownUnreset';

// import Countdown from 'react-countdown';
import PubSub from 'pubsub-js';

import TalkIcon from '../../../Assets/i_talk.png';
import clockIcon from '../../../Assets/i_clock.png';

import './index.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  return isDesktop ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 1200 });
  return isMobile ? children : null;
};

export default class PayInfo extends Component {
  state = {
    headers: {},
    showInfo: true,
    transactionDone: false,
    data: null,
    masterType: null,
    isCompletePay: false,
    client: {},
    isChat: false,
    message: [],
    timer: 900,
    timer2: 1800,
    minutes: null,
    seconds: null,
    minutes2: null,
    seconds2: null,
    completed: false,
    overTime: false,
    bigScreenChat: true,
  };

  setInfo = () => {
    this.setState({
      showInfo: false,
    });
  };

  handleHttpError = data => {
    if (data.code === '1') {
      alert('系統錯誤');
      return;
    }

    if (data.code === '10') {
      alert('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      alert('此帳號已經註冊過');
      return;
    }

    if (data.code === '12') {
      alert('此帳號無法註冊，可能被列入黑名單');
      return;
    }

    if (data.code === '13') {
      alert('json格式錯誤');
      return;
    }
    if (data.code === '14') {
      alert('json格式錯誤');
      return;
    }

    if (data.code === '15') {
      alert('無效的token');
      return;
    }

    if (data.code === '16') {
      alert('錯誤的操作');
      return;
    }

    if (data.code === '17') {
      alert('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      alert('數據格式錯誤');
      return;
    }

    if (data.code === '21') {
      alert('請勿連續發送請求');
      return;
    }

    if (data.code === '22') {
      alert('無效的一次性驗證碼');
      return;
    }

    if (data.code === '30') {
      alert('無效的錢包地址');
      return;
    }

    if (data.code === '31') {
      alert('不能轉帳給自己');
      return;
    }

    if (data.code === 'ˇ32') {
      alert('可提不足');
      return;
    }

    if (data.code === 'ˇ91') {
      alert('session過期，請重新登入');
      return;
    }
  };

  cancelOrder = async () => {
    const orderToken = this.props.match.params.id;
    const token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    try {
      const cancelApi = `/j/Req_CancelOrder.aspx`;
      const res = await fetch(cancelApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });

      const resData = await res.json();

      // console.log(resData);
      if (resData.code === 200) {
        alert('取消成功');
        this.props.history.replace('/home/transaction/buy');
      } else {
        this.handleHttpError(resData);
        alert('訂單未取消');
      }
    } catch (error) {
      alert(error);
    }
  };

  getConfirmPay = async () => {
    const token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    try {
      const reqBuy2Api = `/j/Req_Buy2.aspx`;
      const res = await fetch(reqBuy2Api, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: this.state.orderToken,
        }),
      });

      const resData = await res.json();

      if (resData.code === 200) {
        this.setState({
          isCompletePay: true,
        });
      } else {
        this.handleHttpError(resData);
      }
    } catch (error) {
      alert(error);
    }
  };

  getStatId = (_, data) => {
    this.setState({
      stateId: data,
      isCompletePay: true,
    });

    if (data === 1) {
      this.setState({
        transactionDone: true,
      });
    }
  };

  openChat = () => {
    const { orderToken } = this.props.match.params.id;
    this.props.submitTransaction(orderToken);
    this.setState({
      isChat: !this.state.isChat,
    });
  };

  componentDidMount() {
    this.setState(
      {
        orderToken: this.props.match.params.id,
      },
      () => {
        this.detailReq();
        const { orderToken } = this.state;
        this.props.submitTransaction(orderToken);
        this.getDeltaTime();
      }
    );

    PubSub.subscribe('statId', this.getStatId);
  }

  getDeltaTime2 = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const { orderToken } = this.state;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const detailApi = '/j/GetTxDetail.aspx';

    const res = await fetch(detailApi, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Token: orderToken,
      }),
    });
    const resData = await res.json();

    const { data } = resData;

    const { timer2 } = this.state;
    let countTimer = timer2 - data.DeltaTime;

    if (countTimer <= 0) {
      this.setState({
        completed: true,
      });
    }

    let minutesTime;

    if (data.DeltaTime === 900) {
      minutesTime = countTimer / 60;
    } else {
      minutesTime = countTimer / 60;
    }

    let secondsTime = (minutesTime - Math.trunc(minutesTime)) * 60;

    this.setState({
      minutes2: minutesTime,
      seconds2: secondsTime,
    });
  };

  getDeltaTime = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const { orderToken } = this.state;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const detailApi = '/j/GetTxDetail.aspx';

    const res = await fetch(detailApi, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Token: orderToken,
      }),
    });
    const resData = await res.json();

    const { data } = resData;
    const { timer } = this.state;
    let countTimer = timer - data.DeltaTime;

    if (countTimer <= 0) {
      this.getDeltaTime2();
      this.setState({
        overTime: true,
        showInfo: false,
      });
      return;
    }

    // console.log(7600 / 60);
    // console.log((7600 / 60 - Math.trunc(7600 / 60)) * 60);

    let minutesTime;

    if (data.DeltaTime === 0) {
      minutesTime = countTimer / 60;
    } else {
      minutesTime = countTimer / 60;
    }

    let secondsTime = (minutesTime - Math.trunc(minutesTime)) * 60;

    this.setState({
      minutes: minutesTime,
      seconds: secondsTime,
    });
  };

  mediaOnChange = e => {
    this.setState({
      bigScreenChat: !this.state.bigScreenChat,
    });
  };

  detailReq = async () => {
    // PubSub.subscribe('getData', this.getTransData);

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const { orderToken } = this.state;

    // this.props.submitTransaction(orderToken);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const detailApi = '/j/GetTxDetail.aspx';

    try {
      const res = await fetch(detailApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: orderToken,
        }),
      });
      const resData = await res.json();

      if (resData.code !== 200) {
        this.handleHttpError(resData);
        this.props.history.replace('/home/overview');

        return;
      }

      const { data } = resData;

      this.setState({
        masterType: data.MasterType,
        stateId: data.Order_StatusID,
        Tx_HASH: data.Tx_HASH,
        DeltaTime: data.DeltaTime,
      });

      if (data.MasterType === 1 || data.MasterType === 0) {
        this.setState({
          master: {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            account: data.P1,
            payee: data.P2,
            bank: data.P3,
            branch: data.P4,
            exchangePrice: data.D1,
            rmb: data.D2,
            charge: data.D3,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          },
        });
      }

      if (data.MasterType === 2) {
        this.setState({
          master: {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            receivingAddress: data.P1,
            charge: data.D1,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          },
        });
      }

      if (data.MasterType === 3) {
        this.setState({
          master: {
            date: data.Date,
            txHASH: data.Tx_HASH,
            usdtAmt: data.UsdtAmt,
            orderState: data.Order_StatusID,
            type: data.MasterType,
          },
        });
      }
    } catch (error) {
      alert(error);
      return;
    }
  };

  backToHome = () => {
    this.props.history.replace('/home/overview');
  };

  render() {
    const {
      showInfo,
      isCompletePay,
      transactionDone,
      master,
      stateId,
      Tx_HASH,
      isChat,
      minutes,
      seconds,
      minutes2,
      seconds2,
      overTime,
      completed,
    } = this.state;

    const pairTitleBox = {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '-17px',
    };

    const clockStyle = {
      height: 17,
      marginRight: 3,
    };

    return (
      <div>
        <ExRate title="購買USDT" />
        <div className="pairBox pl-0">
          {showInfo && !isCompletePay && !overTime && stateId === 33 ? (
            <>
              <div style={pairTitleBox} className="titleBoxSm">
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  轉帳資料
                </p>

                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <img style={clockStyle} src={clockIcon} alt="clock icon" />
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    剩餘支付時間：
                    <span className="payTime c_yellow">
                      {minutes && (
                        <CountDownUnreset
                          minutes={minutes}
                          seconds={seconds}
                          setInfo={this.setInfo}
                        />
                      )}
                      {/* <Countdown
                                            date={Date.now() + timer}
                                            renderer={Timer}
                                            onComplete={() => this.setInfo(false)}
                                        ></Countdown> */}
                    </span>
                  </p>
                </div>
              </div>
              <InfoDetail
                transferData={master}
                getConfirmPay={this.getConfirmPay}
                orderToken={this.props.match.params.id}
                cancelOrder={this.cancelOrder}
              />
              <ul className="txt_12_grey">
                <li>
                  請注意,如果您已經透過網路銀行或其他第三方付款平臺轉帳給賣方，
                  “請絕對不能點擊取消交易”， 除非您已收到退款,否則訂單取消後您將無法拿回退款
                </li>
              </ul>

              {/* Chat */}
              <Mobile>
                <div style={chatMobil}>
                  <Chat isChat={isChat} {...this.props} Tx_HASH={Tx_HASH} />
                </div>
                <Button
                  variant="primary"
                  className=""
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    borderRadius: '10rem',
                    position: 'fixed',
                    bottom: '5%',
                    right: '5%',
                    backgroundColor: '#F80FA',
                  }}
                  onClick={this.openChat}
                >
                  <img src={TalkIcon} alt="talk icon" className="mr-2" />
                  <span>對話</span>
                </Button>
              </Mobile>

              <Desktop>
                <Chat isChat={true} {...this.props} Tx_HASH={Tx_HASH} />
              </Desktop>
            </>
          ) : !showInfo && !isCompletePay && stateId === 33 ? (
            <>
              {/* <ExRate title="購買USDT" /> */}
              {/* <Countdown
                                date={Date.now() + 10000}
                                renderer={ButtonTimer}
                                getConfirmPay={this.getConfirmPay}
                            ></Countdown> */}

              <ButtonTimer
                minutes={minutes2}
                seconds={seconds2}
                isCompleted={completed}
                getConfirmPay={this.getConfirmPay}
                getDeltaTime2={this.getDeltaTime2}
              />

              {/* Chat */}
              <Mobile>
                <div style={chatMobil}>
                  <Chat isChat={isChat} {...this.props} Tx_HASH={Tx_HASH} />
                </div>
                <Button
                  variant="primary"
                  className=""
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    borderRadius: '10rem',
                    position: 'fixed',
                    bottom: '5%',
                    right: '5%',
                    backgroundColor: '#F80FA',
                  }}
                  onClick={this.openChat}
                >
                  <img src={TalkIcon} alt="talk icon" className="mr-2" />
                  <span>對話</span>
                </Button>
              </Mobile>

              <Desktop>
                <Chat isChat={true} {...this.props} Tx_HASH={Tx_HASH} />
              </Desktop>
            </>
          ) : stateId === 34 && isCompletePay && !transactionDone ? (
            <div>
              {/* <div className="txt_12 pt_20">購買USDT...</div> */}
              <Card className="text-center border-0">
                <div className="i_notyet" />
                <h4 className="c_blue">已提交，等待確認中</h4>
                <p className="txt_12_grey">
                  交易回執：
                  {/* {props.transferData.Tx_HASH ? props.transferData.Tx_HASH : props.hash} */}
                  {Tx_HASH}
                  <br />
                  購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
                </p>
                <button onClick={this.backToHome} className="easy-btn mw400">
                  返回主頁
                </button>
              </Card>
              {/* Chat */}
              <Mobile>
                <div style={chatMobil}>
                  <Chat isChat={isChat} {...this.props} Tx_HASH={Tx_HASH} />
                </div>
                <Button
                  variant="primary"
                  className=""
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    borderRadius: '10rem',
                    position: 'fixed',
                    bottom: '5%',
                    right: '5%',
                    backgroundColor: '#F80FA',
                  }}
                  onClick={this.openChat}
                >
                  <img src={TalkIcon} alt="talk icon" className="mr-2" />
                  <span>對話</span>
                </Button>
              </Mobile>

              <Desktop>
                <Chat isChat={true} {...this.props} Tx_HASH={Tx_HASH} />
              </Desktop>
            </div>
          ) : stateId === 1 || (isCompletePay && transactionDone) ? (
            <div>
              {/* <div className="txt_12 pt_20">購買USDT</div> */}
              <Card className="text-center border-0">
                <div className="i_done" />
                <h4 className="c_blue">交易完成</h4>
                <p className="txt_12_grey">
                  交易回執：
                  {Tx_HASH}
                  <br />
                  購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
                </p>
                <button onClick={this.backToHome} className="easy-btn mw400">
                  返回主頁
                </button>
                <br />
                {/* <p>詳細購買紀錄</p> */}
              </Card>
              {/* Chat */}
              <Mobile>
                <div style={chatMobil}>
                  <Chat isChat={isChat} {...this.props} Tx_HASH={Tx_HASH} />
                </div>
                <Button
                  variant="primary"
                  className=""
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    borderRadius: '10rem',
                    position: 'fixed',
                    bottom: '5%',
                    right: '5%',
                    backgroundColor: '#F80FA',
                  }}
                  onClick={this.openChat}
                >
                  <img src={TalkIcon} alt="talk icon" className="mr-2" />
                  <span>對話</span>
                </Button>
              </Mobile>

              <Desktop>
                <Chat isChat={true} {...this.props} Tx_HASH={Tx_HASH} />
              </Desktop>
            </div>
          ) : (
            <BaseSpinner />
          )}
          {/* <Button onClick={this.openChat} variant="primary">
                        幫助
                    </Button> */}
        </div>
      </div>
    );
  }
}

const chatMobil = {
  position: 'fixed',
  bottom: '11%',
  right: '5%',
};
