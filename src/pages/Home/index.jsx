import React, { Component } from 'react';
import Header from '../../Components/Layout/Header';
import TheNav from '../../Components/Layout/TheNav';

import MoneyRecord from '../../Components/MoneyRecord';
import Overview from '../../Components/Overview';
import Wallet from '../../Components/Wallet';
import History from '../../Components/History';
import Transaction from '../../Components/Transaction';

import { Route, Switch, Redirect, Link } from 'react-router-dom';

import style from '../../Components/Layout/Header.module.scss';

export default class index extends Component {
    state = {
        token: null,
    };

    logout = async () => {
        window.confirm('確定要登出嗎');

        const { token, history } = this.props;
        localStorage.removeItem('token');
        history.replace('/login');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        this.props.setAuth();

        let logoutApi = '/j/logout.aspx';
        try {
            fetch(logoutApi, { headers });
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount() {
        console.log('home mount');
        const token = localStorage.getItem('token');
        const { history, location } = this.props;
        this.setState({
            token,
        });
        if (!token) {
            history.replace('/auth');
        }

        if (location.pathname === '/home' || location.pathname === '/home/') {
            history.replace('/home/overview');
        }
    }

    render() {
        const { history, setAuth } = this.props;
        const { token } = this.state;
        return (
            <>
                <Header history={history} token={token} setAuth={setAuth}>
                    <Link to="/home" className={style.logoLink}>
                        <div className={style.logo}></div>
                    </Link>
                    <TheNav logout={this.logout} />
                </Header>
                <MoneyRecord history={history} />
                <Switch>
                    <Route path="/home/overview" component={Overview} />
                    <Route path="/home/wallet" component={Wallet} />
                    <Route path="/home/history" component={History} />
                    <Route path="/home/transaction" component={Transaction} />
                    <Redirect to="/home/overview" />
                </Switch>
            </>
        );
    }
}
