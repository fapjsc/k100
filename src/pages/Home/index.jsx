import React, { Component } from 'react';
import Header from '../../Components/Layout/Header';
import MoneyRecord from '../../Components/MoneyRecord';
import Overview from '../../Components/Overview';
import Wallet from '../../Components/Wallet';

import { Route, Switch, Redirect } from 'react-router-dom';

export default class index extends Component {
    state = {
        token: null,
    };

    componentDidMount() {
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
        const { history } = this.props;
        const { token } = this.state;
        return (
            <>
                <Header history={history} token={token} />
                <MoneyRecord history={history} />
                <Switch>
                    <Route path="/home/overview" component={Overview} />
                    <Route path="/home/wallet" component={Wallet} />
                    <Redirect to="/home/overview" />
                </Switch>
            </>
        );
    }
}
