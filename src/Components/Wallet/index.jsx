import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import copy from 'copy-to-clipboard';

import './index.scss';

export default class index extends Component {
  state = {
    WalletAddress: null,
    Qr_img: null,
    Avb_Balance: null,
    Real_Balance: null,
  };

  getQrCode = async token => {
    if (!token) {
      alert('session過期，請重新登入');
      this.props.history.replace('/auth/login');
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const walletApi = '/j/GetWallet.aspx';

    try {
      const res = await fetch(walletApi, {
        headers,
      });

      const resData = await res.json();

      if (!res.ok) {
        console.log(resData);
        return;
      }

      const { WalletAddress, Qr_img } = resData.data;

      this.setState({
        WalletAddress,
        Qr_img,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleCopy = value => {
    copy(value);

    if (copy(value)) {
      alert('複製成功');
    } else {
      alert('複製失敗，請手動複製');
    }
  };

  getBalance = async token => {
    if (!token) {
      alert('session過期，請重新登入');
      this.props.history.replace('/auth/login');
    }

    const { history } = this.props;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('login_session', token);

    const balanceApi = '/j/ChkBalance.aspx';

    try {
      const res = await fetch(balanceApi, {
        headers: headers,
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.code === '91' || resData.code === '90') {
          console.log('token 過期 => check tick');
          localStorage.removeItem('token');

          window.confirm('session過期，請重新登入');

          history.replace('/auth/login');
        }

        return;
      }

      const { Avb_Balance, Real_Balance } = resData.data;

      this.setState({
        Avb_Balance,
        Real_Balance,
      });

      const balance = {
        Avb_Balance,
        Real_Balance,
      };

      PubSub.publish('getBalance', balance);
    } catch (error) {
      const errStr = String(error);
      this.setState({
        httpError: {
          title: 'Server錯誤',
          body: errStr,
        },
      });
      clearInterval(this.checkTickLoop);

      return;
    }
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getQrCode(token);
      this.getBalance(token);
    }
  }

  render() {
    const { WalletAddress, Qr_img, Avb_Balance, Real_Balance } = this.state;
    return (
      <section className="wallet bg_grey">
        <div className="container h_88">
          <div className="row">
            <div className="col-12">
              <p className="welcome_txt">歡迎登入</p>
              <div className="content-box">
                <div className="txt_12 pt_20">我的錢包</div>
                <div className="row">
                  <div className="col-md-3 col-12 center_p20">
                    <img
                      className="qrCode-img"
                      src={`data:image/png;base64,${Qr_img}`}
                      alt="qr code"
                    ></img>
                  </div>

                  <div className="col-md-8 col-12 pt_20">
                    <div className="walletAddress-box">
                      <span className="easy_link">{WalletAddress}</span>
                      <div className="i_copy2" onClick={() => this.handleCopy(WalletAddress)}></div>
                    </div>

                    <div className="pt_20">
                      <div className="balance">
                        結餘：
                        <span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{Number(Real_Balance).toFixed(2)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="balance">
                        可提：
                        <span className="usdt mr_sm"></span>
                        <span className="c_green mr_sm">USDT</span>
                        <span className="c_green fs_20">{Number(Avb_Balance).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <hr className="mt_mb" />
                  <ul className="txt_12_grey">
                    <li>本平台目前只提供USDT交易，其他數字貨幣交易將不予受理</li>
                    <br />
                    <li>本平台錢包地址充值或轉出，都是經由 USDT區塊鏈系統網絡確認。</li>
                    <br />
                    <li>
                      本平台錢包地址可以重複充值或轉出；如因系統更新，我們會通過網站或口訊通知。
                    </li>
                    <br />
                    <li>請勿向錢包地址充值任何非USDT資産，否則資産將不可找回。</li>
                    <br />
                    <li>最小充值金額：100USDT，小于最小金額的充值將不會上賬且無法退回。</li>
                    <br />
                    <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
                    <br />
                    <li>如有其他問題或要求提出爭議，可透過網頁上的客服對話窗聯絡我們。</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <p className="txt_12_grey txt_center pt_20">
                            訂單號：A213141 I 付款參考號：2313
                        </p> */}
          </div>
        </div>
      </section>
    );
  }
}
