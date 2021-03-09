import React, { Component } from 'react';
import BaseDialog from './../Ui/BaseDialog';
import PubSub from 'pubsub-js';

import './index.scss';

export default class MoneyRecord extends Component {
    state = {
        Avb_Balance: 0,
        Real_Balance: 0,
        tick: null,
        token: null,
        httpError: null,
    };

    getBalance = async token => {
        if (!token) {
            return;
        }
        console.log('get balance');

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

    pubBalance = () => {
        const { Avb_Balance, Real_Balance } = this.state;

        const balance = {
            Avb_Balance,
            Real_Balance,
        };

        PubSub.publish('getBalance', balance);
    };

    getTick = async token => {
        if (!token) {
            return;
        }
        console.log('get tick');

        const { history } = this.props;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        const getTickApi = '/j/ChkUpdate.aspx';

        try {
            const res = await fetch(getTickApi, {
                headers,
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

            const { UpdateTick: tick } = resData.data;
            this.setState({
                tick,
            });
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

    checkTick = async token => {
        if (!token) {
            return;
        }

        console.log('check tick');

        const { tick } = this.state;
        const { history } = this.props;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        const getTickApi = '/j/ChkUpdate.aspx';

        try {
            const res = await fetch(getTickApi, {
                headers,
            });

            const resData = await res.json();

            if (res.ok) {
                if (resData.code === '91' || resData.code === '90') {
                    console.log('token 過期 => check tick');
                    localStorage.removeItem('token');

                    window.confirm('session過期，請重新登入');

                    history.replace('/auth/login');
                }

                return;
            }

            const { UpdateTick: checkTick } = resData.data;

            if (tick !== checkTick) {
                this.getBalance();
            }
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

    closeDialog = () => {
        this.setState({
            httpError: null,
        });
    };

    componentDidMount() {
        const { history } = this.props;
        const token = localStorage.getItem('token');
        if (token) {
            this.setState({
                token,
            });

            this.getTick(token);
            this.getBalance(token);

            const timer = 1000 * 60; //一分鐘

            this.checkTickLoop = setInterval(() => {
                this.checkTick(token);
            }, timer);
        } else {
            history.replace('/auth/login');
        }
    }

    componentWillUnmount() {
        clearInterval(this.checkTickLoop);
        this.pubBalance();
    }

    render() {
        const { Avb_Balance, Real_Balance, httpError } = this.state;
        return (
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 balance-box">
                            <div className="balance">
                                結餘：
                                <span className="usdt mr_sm"></span>
                                <span className="c_green mr_sm">USDT</span>
                                <span className="c_green fs_20">{Real_Balance}</span>
                            </div>

                            <div className="balance">
                                可提：
                                <span className="usdt mr_sm"></span>
                                <span className="c_green mr_sm">USDT</span>
                                <span className="c_green fs_20">{Avb_Balance}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!!httpError ? (
                    <BaseDialog httpError={httpError} closeDialog={this.closeDialog} />
                ) : null}
            </section>
        );
    }
}
