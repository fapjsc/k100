import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import TransactionNav from '../../Components/TransactionNav';
import Buy from '../../Components/Buy';
import Sell from '../../Components/Sell';
import Transfer from '../../Components/Transfer';

import './index.scss';

export default class Transaction extends Component {
    state = {
        Avb_Balance: null,
        Real_Balance: null,
        exRate: null,
    };

    // 獲取匯率
    getExRate = async headers => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('token 過期');
        }

        const exRateApi = `/j/ChkExRate.aspx`;

        try {
            const res = await fetch(exRateApi, {
                headers,
            });

            const resData = await res.json();

            const { data } = resData;

            this.setState({
                exRate: data,
            });
        } catch (error) {
            alert(error, 'getExRate');
        }
    };

    getBalance = async token => {
        if (!token) {
            const { history } = this.props;

            alert('請重新登入, get balance');
            localStorage.removeItem('token');
            history.replace('/auth/login');

            return;
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

            if (resData.code === '91' || resData.code === '90') {
                localStorage.removeItem('token');
                window.confirm('session過期，請重新登入 get balance !res.ok');

                history.replace('/auth/login');
                clearInterval(this.checkTickLoop);
                return;
            }

            const { Avb_Balance, Real_Balance } = resData.data;

            this.setState({
                Avb_Balance,
                Real_Balance,
            });
        } catch (error) {
            localStorage.removeItem('token');
            clearInterval(this.checkTickLoop);
            alert('session過期，請重新登入 get balance catch');
            // history.replace('/auth/login');
        }
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
            this.getExRate(headers);

            this.getBalance(token);
        } else {
            return;
        }
    }

    render() {
        const { location } = this.props;
        const { Avb_Balance, exRate } = this.state;
        return (
            <>
                <section className="transaction bg_grey">
                    <div className="h_88">
                        <div className="row">
                            <div className="col-12">
                                <p className="welcome_txt">歡迎登入</p>
                            </div>

                            <div className="col-10 transaction-card">
                                {/* Nav */}
                                <TransactionNav location={location} />

                                <Switch>
                                    {/* BUY */}
                                    <Route
                                        path="/home/transaction/buy"
                                        component={props => <Buy exRate={exRate} {...props} />}
                                    />

                                    {/* SELL */}
                                    <Route path="/home/transaction/sell" component={Sell} />

                                    {/* Transfer */}
                                    <Route
                                        path="/home/transaction/transfer"
                                        component={props => (
                                            <Transfer
                                                Avb_Balance={Avb_Balance}
                                                exRate={exRate}
                                                getExRate={this.getExRate}
                                                {...props}
                                            />
                                        )}
                                    />
                                    <Redirect to="/home/transaction/buy" />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
