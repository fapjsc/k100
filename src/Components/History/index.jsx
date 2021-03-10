import React, { Component } from 'react';

import { Switch, Route, Link, Redirect } from 'react-router-dom';

import All from './All';
import Wait from './Wait';

import style from './History.module.scss';
import './index.scss';

export default class History extends Component {
    state = {
        historyState: 'all',
    };

    handleHistoryState = value => {
        if (value === 'all') this.setState({ historyState: 'all' });

        if (value === 'wait') this.setState({ historyState: 'wait' });
    };

    render() {
        const { historyState, isLoading } = this.state;
        return (
            <section className={style.section}>
                <div className="container h_88">
                    <div className="row">
                        <div className="col-12">
                            <p className="welcome_txt">歡迎登入</p>
                            <div className="contentbox">
                                <div className="history-tab">
                                    <Link
                                        to="/home/history/all"
                                        className={
                                            historyState === 'all'
                                                ? 'history-link history-link-active'
                                                : 'history-link'
                                        }
                                        onClick={() => this.handleHistoryState('all')}
                                    >
                                        所有紀錄
                                    </Link>
                                    <Link
                                        to="/home/history/wait"
                                        className={
                                            historyState === 'wait'
                                                ? 'history-link history-link-active'
                                                : 'history-link'
                                        }
                                        onClick={() => this.handleHistoryState('wait')}
                                    >
                                        待處理
                                    </Link>
                                </div>

                                <Switch>
                                    <Route
                                        path="/home/history/all"
                                        render={() => <All historyState={historyState} />}
                                    ></Route>
                                    <Route path="/home/history/wait" component={Wait}></Route>
                                    <Redirect to="/home/history/all" />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
