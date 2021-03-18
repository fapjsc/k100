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
                                            <div
                                                className="i_copy2"
                                                onClick={() => this.handleCopy(WalletAddress)}
                                            ></div>
                                        </div>
                                        <div className="pt_20">
                                            <div className="balance">
                                                結餘：
                                                <span className="usdt mr_sm"></span>
                                                <span className="c_green mr_sm">USDT</span>
                                                <span className="c_green fs_20">
                                                    {Real_Balance}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="balance">
                                                可提：
                                                <span className="usdt mr_sm"></span>
                                                <span className="c_green mr_sm">USDT</span>
                                                <span className="c_green fs_20">{Avb_Balance}</span>
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
                                    • 最小充值金額：1 USDT，小于最小金額的充值將不會上賬且無法退回。
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
