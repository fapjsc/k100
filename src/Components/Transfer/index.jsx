import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// import OnLoading from './OnLoading';
import TransferInfo from './TransferInfo';
import ExRate from '../Buy/ExRate';

import validator from 'validator';

// import PubSub from 'pubsub-js';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { Form, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default class Transfer extends Component {
  state = {
    transfercount: {
      val: '',
      isValid: true,
      error: '',
    },
    transferAddress: {
      val: '',
      isValid: true,
      error: '',
    },
    formIsValid: true,
    Avb_Balance: null, // 可提
    headers: null,
    isComplete: false,
    isloading: true,
    isfailed: false,
    token: '',
    data: {},
    transferLoading: false,
    isSubmit: false,
    isClick: false,
    btnLoading: false,
  };

  setTransferCount = e => {
    this.setState({
      transfercount: {
        val: e.target.value.replace(/^((-\d+(\.\d+)?)|((\.0+)?))$/).trim(),
        isValid: true,
      },
      isClick: false,
    });
  };

  setTransferAddress = e => {
    this.setState(
      {
        transferAddress: {
          val: e.target.value.trim(),
          isValid: true,
        },
        isClick: false,
      },
      () => {}
    );
  };

  valid = () => {
    const { transfercount, transferAddress } = this.state;
    const { Avb_Balance } = this.props;

    // 錢包地址小於40位
    if (transferAddress.val.length < 40) {
      this.setState({
        transferAddress: {
          val: '',
          isValid: false,
          error: '錢包地址錯誤',
        },
        formIsValid: false,
      });
    }

    // 輸入的數量小數點超過兩位數
    let rule = /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;

    if (!rule.test(transfercount.val)) {
      this.setState({
        transfercount: {
          val: '',
          isValid: false,
          error: '請輸入有效數量, (不能為0或是負數，最多小數第二位)',
        },
        formIsValid: false,
      });
      // alert('請輸入有效數量, (不能為0，最多小數第二位)');
      return;
    }

    // 不能是負數
    let negative = /^((-\d+(\.\d+)?)|((\.0+)?))$/;
    if (negative.test(transfercount.val)) {
      this.setState({
        transfercount: {
          val: '',
          isValid: false,
          error: '不能是負數',
        },
        formIsValid: false,
      });

      return;
    }

    // 輸入數量大於可提加上手續費
    if (Number(transfercount.val) > Avb_Balance + Number(this.props.exRate.TransferHandle)) {
      this.setState({
        transfercount: {
          val: '',
          isValid: false,
          error: '超出最大可提',
        },
        formIsValid: false,
      });
    }

    // 可提為0
    if (Number(Avb_Balance <= 0)) {
      this.setState({
        transfercount: {
          val: '',
          isValid: false,
          error: '超出最大可提',
        },
        formIsValid: false,
      });
    }

    // 是否為有效的數字
    if (
      !validator.isNumeric(transfercount.val) ||
      transfercount.val <= 0 ||
      transfercount.val === ''
    ) {
      this.setState({
        transfercount: {
          val: '',
          isValid: false,
          error: '請輸入有效的數量',
        },
        formIsValid: false,
      });
    }
  };

  getAll = async () => {
    this.setState({
      transferLoading: true,
    });

    const token = localStorage.getItem('token');
    await this.props.getBalance(token);

    const all = (this.props.Avb_Balance - Number(this.props.exRate.TransferHandle)).toFixed(2);
    if (all <= 0) {
      this.setState({
        transfercount: {
          val: '0',
          isValid: true,
        },
        transferLoading: false,
      });

      return;
    }
    this.setState({
      transfercount: {
        val: String(all),
        isValid: true,
      },
      transferLoading: false,
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

  handleSubmit = async () => {
    this.setState({
      isClick: true,
      btnLoading: true,
    });
    if (!this.state.click) {
      this.setState({
        isloading: true,
        handleSubmit: true,
      });

      this.setState({
        formIsValid: true,
      });
      await this.valid();

      if (!this.state.formIsValid) {
        return;
      }

      const { transferAddress, transfercount, headers } = this.state;
      const transferApi = '/j/Req_Transfer1.aspx';

      try {
        const res = await fetch(transferApi, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ToAddress: transferAddress.val,
            UsdtAmt: transfercount.val,
          }),
        });

        const resData = await res.json();

        if (resData.code === 200) {
          const loginToken = localStorage.getItem('token');
          this.setState(
            {
              // isloading: false,
              // isComplete: true,
              loginSession: loginToken,
              token: resData.data.order_token,
            },
            () => {
              this.submitTransaction(loginToken);
              this.getDetail(resData.data.order_token);
            }
          );

          this.props.history.replace({
            pathname: `/home/transaction/transfer/${resData.data.order_token}`,
            state: {
              item: {
                UsdtAmt: transfercount.val,
              },
            },
          });
          return;
        } else {
          this.handleHttpError(resData);

          this.setState({
            isfailed: true,
            isloading: false,
          });
        }
      } catch (error) {
        this.setState({
          isfailed: true,
          isloading: false,
        });
      }
    }
  };

  detailReq = async value => {
    // PubSub.subscribe('getData', this.getTransData);

    let token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    let { orderToken } = this.state;
    // this.props.submitTransaction(orderToken);

    if (!orderToken) {
      orderToken = value;
    }

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

      const { data } = resData;

      this.setState({
        masterType: data.MasterType,
        stateId: data.Order_StatusID,
        Tx_HASH: data.Tx_HASH,
        DeltaTime: data.DeltaTime,
      });
    } catch (error) {
      alert(error);
      return;
    }
  };

  // webSocket 連接
  submitTransaction = value => {
    let { token, loginSession } = this.state;

    const transactionApi = 'j/ws_orderstatus.ashx';

    if (!loginSession) {
      loginSession = localStorage.getItem('token');
    }

    if (!token) {
      token = value;
    }

    // 自動重連次數
    // const options = {
    //     maxRetries: null,
    // };

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${transactionApi}?login_session=${loginSession}&order_token=${token}`;
    }

    const client = new ReconnectingWebSocket(url);

    this.setState({
      client,
    });

    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected');
      this.setState({
        isPairing: true,
      });
    };

    // 2.收到server回復
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      // console.log('got reply!', dataFromServer);

      // 轉帳中
      if (dataFromServer.data.Order_StatusID === 0) {
        this.setState({
          isloading: true,
          isComplete: false,
        });
      } else {
        this.setState({
          isloading: false,
          isComplete: true,
          hash: dataFromServer.data.Tx_HASH,
        });
      }
    };

    // 3.錯誤處理
    // client.onclose = () => {
    //     console.log('關閉連線');
    // };

    client.onclose = function (message) {
      // console.log('關閉連線', message);
      // console.log('關閉連線', message.target.url);
      localStorage.removeItem('order_token');
    };
  };

  getDetail = async token => {
    const detailApi = `/j/GetTxDetail.aspx`;
    const { headers } = this.state;

    if (!headers) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('login_session', token);
    }

    try {
      const res = await fetch(detailApi, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Token: token,
        }),
      });

      const resData = await res.json();

      this.setState({
        isloading: false,
      });

      if (resData.code !== 200) {
        alert(resData.msg);
        return;
      }

      if (resData.code === 200) {
        this.setState({
          data: resData.data,
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  backToHome = () => {
    this.props.history.replace('/home/overview');
  };

  closeModal = () => {
    this.setState({
      isloading: false,
      isfailed: false,
    });

    this.props.history.replace('/home/history/wait');
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('login_session', token);

      this.setState({
        loginSession: token,
        headers,
      });
    } else {
      return;
    }
  }

  render() {
    const {
      isloading,
      transferAddress,
      transfercount,
      isComplete,
      isfailed,
      token,
      transferLoading,
      btnLoading,
      isClick,
      hash,
    } = this.state;
    const { exRate } = this.props;

    const inputText = {
      color: '#D7E2F3',
      position: 'absolute',
      top: 0,
      transform: 'translateY(56%)',
      right: 45,
      fontSize: 17,
    };

    return (
      <div>
        <ExRate title="轉帳USDT" />
        <Route exact path="/home/transaction/transfer">
          <>
            <Form className="text-center">
              <Form.Row className="">
                <Form.Group as={Col} sm={12} md={6} className="text-right ">
                  {transferLoading ? (
                    <Button variant="secondary" disabled className="" style={{}}>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </Button>
                  ) : (
                    <Button
                      disabled={transferLoading}
                      variant="outline-primary"
                      size="lg"
                      onClick={this.getAll}
                    >
                      提取所有
                    </Button>
                  )}
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={6} sm={12} controlId="transferUsdt" className="">
                  <Form.Control
                    type="number"
                    placeholder="請輸入轉帳數量"
                    className="p_sm-2 easy-border"
                    onChange={this.setTransferCount}
                    autoComplete="off"
                    value={transfercount.val}
                    isInvalid={!transfercount.isValid}
                    // onKeyUp={this.countryInput}
                  />
                  <span style={inputText}>USDT</span>
                  {transfercount.error ? (
                    <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                      *{transfercount.error}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <Form.Group as={Col} md={6} sm={12} controlId="transferAddress" className="">
                  <Form.Control
                    type="text"
                    placeholder="請輸入收款地址"
                    className="p_sm-2 easy-border"
                    autoComplete="off"
                    onChange={this.setTransferAddress}
                    isInvalid={!transferAddress.isValid}
                  />

                  {transferAddress.error ? (
                    <Form.Text className="text-muted text-left" style={{ fontSize: '12px' }}>
                      *{transferAddress.error}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              </Form.Row>
              {exRate !== null ? (
                <Form.Row>
                  <Form.Group as={Col} className="text-right" style={{}}>
                    <span className="text-dark">手續費: {exRate.TransferHandle} USDT</span>
                  </Form.Group>
                </Form.Row>
              ) : null}
              {/* <Button
                            variant="primary"
                            className="easy-btn mw400"
                            onClick={() => this.onLoading(true)}
                            disabled={formIsValid}
                        >
                            下一步
                        </Button> */}

              <Button
                // variant={formIsValid ? 'primary' : 'secondary'}
                className="easy-btn smScreen-btn mt-4"
                onClick={this.handleSubmit}
                disabled={isClick}
                style={{
                  cursor: btnLoading ? 'auto' : 'pointer',
                }}
              >
                {btnLoading && <Spinner animation="grow" variant="danger" />}
                {btnLoading ? '處理中...' : '下一步'}
              </Button>
            </Form>

            <div>
              <hr className="mt_mb" />
              <ul className="txt_12_grey">
                <li>本平台目前只提供USDT交易，其他數字貨幣交易將不予受理</li>
                <br />
                <li>本平台錢包地址充值或轉出，都是經由 USDT區塊鏈系統網絡確認。</li>
                <br />
                <li>本平台錢包地址可以重複充值或轉出；如因系統更新，我們會通過網站或口訊通知。</li>
                <br />
                <li>請勿向錢包地址充值任何非USDT資産，否則資産將不可找回。</li>
                <br />
                <li>最小充值金額：100 USDT，小于最小金額的充值將不會上賬且無法退回。</li>
                <br />
                <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
                <br />
                <li>如有其他問題或要求提出爭議，可透過網頁上的客服對話窗聯絡我們。</li>
              </ul>
            </div>
          </>
        </Route>

        <Route
          path="/home/transaction/transfer/:id"
          render={props => (
            <TransferInfo
              {...props}
              show={isloading}
              transfercount={transfercount.val}
              submitTransaction={this.submitTransaction}
              token={token}
              backToHome={this.backToHome}
              isfailed={isfailed ? 1 : 0}
              isloading={isloading}
              isComplete={isComplete ? 1 : 0}
              onHide={this.closeModal}
              detailReq={this.detailReq}
              hash={hash}
            />
          )}
        />
      </div>
    );
  }
}
