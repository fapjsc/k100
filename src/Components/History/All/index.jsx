import React, { Component, Fragment } from 'react';

import { Switch, Route, Link, Redirect } from 'react-router-dom';

import BaseSpinner from './../../Ui/BaseSpinner';

import Detail from './Detail';

import './index.scss';

export default class All extends Component {
    state = {
        historyList: [],
        detailToken: null,
        showDetail: false,
        isLoading: false,
    };

    setDetailToken = detailToken => {
        const { showDetail } = this.state;
        this.setState({
            detailToken,
            showDetail: !showDetail,
        });
    };

    getTransactions = async (token, headers) => {
        if (!token) {
            return;
        }

        this.setState({
            isLoading: true,
        });

        const historyApi = '/j/GetTxHistory.aspx';

        try {
            const res = await fetch(historyApi, {
                headers,
            });

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData || 'something wrong');
                console.log(resData, 'res error');
                this.setState({
                    isLoading: false,
                });
                throw error;
            }

            const { data } = resData;

            const newData = data.map(h => {
                if (h.MasterType === 0) {
                    h.MasterType = '買入';
                    return h;
                } else if (h.MasterType === 1) {
                    h.MasterType = '賣出';
                    return h;
                } else if (h.MasterType === 2) {
                    h.MasterType = '轉出';
                    return h;
                } else {
                    h.MasterType = '轉入';
                    return h;
                }
            });

            this.setState({
                historyList: [...newData],
            });
            this.setState({
                isLoading: false,
            });
        } catch (error) {
            console.log(error, 'catch');
            this.setState({
                isLoading: false,
            });
        }
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('login_session', token);

            this.getTransactions(token, headers);
        }
    }
    render() {
        const { historyList, detailToken, showDetail, isLoading } = this.state;

        return (
            <>
                {!isLoading ? (
                    historyList.map(h => (
                        <Fragment key={h.token}>
                            <Link
                                // to={`/home/history/all/${h.token}`}
                                to={`/home/history/all/detail`}
                                id="all"
                                className="tabcontent"
                                onClick={() => this.setDetailToken(h.token)}
                                replace
                            >
                                <div className="easy_history2">
                                    <div className="history-detail master-type">
                                        <div
                                            className={
                                                h.MasterType === '買入'
                                                    ? 'i_blue'
                                                    : h.MasterType === '賣出'
                                                    ? 'i_green'
                                                    : 'i_purple'
                                            }
                                        ></div>
                                        <span
                                            className={
                                                h.MasterType === '買入'
                                                    ? 'txt18'
                                                    : h.MasterType === '賣出'
                                                    ? 'txt18_g'
                                                    : 'txt18_p'
                                            }
                                        >
                                            {h.MasterType}
                                        </span>
                                    </div>
                                    <div className="history-detail">
                                        <h6 className="history-detail-title">日期</h6>
                                        <span className="history-detail-text history-date">
                                            {h.Date}
                                        </span>
                                    </div>
                                    <div className="history-detail">
                                        <h6 className="history-detail-title">交易額（USDT）</h6>
                                        <span className="history-detail-text">{h.UsdtAmt}</span>
                                    </div>

                                    <div className="history-detail">
                                        <h6 className="history-detail-title">結餘（USDT）</h6>
                                        <span className="history-detail-text">{h.Balance}</span>
                                    </div>
                                    {/* <div className="history-detail receiving ">
                                <h6>收款賬號</h6>2783721947813471
                            </div>
                            <div className="history-detail cny">
                                <h6>CNY</h6>100.00
                            </div>
                            <div className="history-detail rate">
                                <h6>匯率</h6>6.224
                            </div> */}
                                    <div className="history-detail">
                                        <h6 className="history-detail-title">狀態</h6>
                                        <span className="history-detail-text history-complete">
                                            完成
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {h.token === detailToken && showDetail ? (
                                <Switch>
                                    <Route
                                        path={`/home/history/all/detail`}
                                        component={() => <Detail detailToken={detailToken} />}
                                    />
                                    <Redirect to="/home/history/all" />
                                </Switch>
                            ) : null}
                        </Fragment>
                    ))
                ) : (
                    <div className="all-spinner">
                        <BaseSpinner />
                    </div>
                )}
            </>
        );
    }
}
