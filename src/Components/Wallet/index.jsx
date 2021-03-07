import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default class index extends Component {
  render() {
    return (
      <section className="bg_grey">
        <div className="container h_88">
          <div className="row">
            <div className="col-12">
              <p className="welcome_txt">歡迎登入</p>
              <div className="content-box">
                <div className="txt_12 pt_20">我的錢包</div>
                <div className="row">
                  <div className="col-md-3 col-12 center_p20">
                    <img src="/src/Assets/qr_demo.png" alt="qr code" />
                  </div>

                  <div className="col-md-8 col-12 pt_20 pre">
                    <Link to="/home" className="easy_link">
                      https://www.easyusdt.com/search?q=qrcode&tbm=isch&ved=2ahUKEwiBs5iTsb7uAhWXEogKHXDpC-MQ2cCegQIABAA&oq=qrcode&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQQzICCAAyBAgAEEMyAggAMgIIADICCAAyAggAMgIIADICCAA6BQgAELEDOgQIABAeOgYIABAFEB5QwsQvWIbPL2D81S9oAHAAeACAAWOIAecCkgEBNpgBAKABAaoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=KI0SYIH_GZeloATw0q-YDg&bih=874&biw=919#imgrc=1_ez_zG7bRI5oM
                    </Link>
                    <div className="i_copy2"></div>
                    <div className="pt_20">
                      <div className="balance">
                        結餘：
                        <span className="usdt"></span>
                        <span className="c_green">USDT</span>
                        <span className="c_green fs_20">2112.00</span>
                      </div>
                    </div>
                    <div>
                      <div className="balance">
                        可提：
                        <span className="usdt"></span>
                        <span className="c_green">USDT</span>
                        <span className="c_green fs_20">2112.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt_mb" />
                <p className="txt_12_grey">
                  • 請勿向上述地址充值任何非USDT資産，否則資産將不可找回。
                  <br />
                  <br />
                  •
                  您充值至上述地址後，需要整個網絡節點的確認，12次網絡確認後到賬，12次網絡確認後可提幣。
                  <br />
                  <br />
                  • 最小充值金額：1
                  USDT，小于最小金額的充值將不會上賬且無法退回。
                  <br />
                  <br />
                  •
                  您的充值地址不會經常改變，可以重複充值；如有更改，我們會盡量通過網站公告或郵件通知您。
                  <br />
                  <br />
                  • 請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。
                  <br />
                  <br />•
                  USDT充幣僅支持以太坊transfer和transferFrom方法，使用其他方法的充幣暫時無法上賬，請您諒解。
                </p>
              </div>
            </div>
            <p className="txt_12_grey txt_center pt_20">
              訂單號：A213141 I 付款參考號：2313
            </p>
          </div>
        </div>
      </section>
    );
  }
}
