import React, { Component } from 'react';

import { Switch, Route, Link, Redirect } from 'react-router-dom';
import Detail from './Detail';

import './index.scss';

export default class All extends Component {
    state = {
        masterType: null,
        date: null,
        usdtAmt: null,
        balance: null,
        historyList: [],
        token: null,
        headers: null,
        transactionState: '',
        showDetail: false,
        detailToken: null,
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
            console.log('return');
            return;
        }

        const historyApi = '/j/GetTxHistory.aspx';

        try {
            const res = await fetch(historyApi, {
                headers,
            });

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData || 'something wrong');
                console.log(resData, 'res error');
                throw error;
            }

            const { data } = resData;

            const newData = data.map(h => {
                if (h.MasterType === 1) {
                    h.MasterType = '買';
                    return h;
                } else if (h.MasterType === 2) {
                    h.MasterType = '賣';
                    return h;
                } else {
                    h.MasterType = '轉';
                    return h;
                }
            });

            this.setState({
                historyList: [...newData],
            });
        } catch (error) {
            console.log(error, 'catch');
        }
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('login_session', token);

            this.getTransactions(token, headers);
            // this.getDetail(token, headers);
        }
    }
    render() {
        const { historyList, detailToken, showDetail } = this.state;

        return (
            <>
                {historyList.map(h => (
                    <Link
                        to={`/home/history/all/${h.token}`}
                        key={h.token}
                        id="all"
                        className="tabcontent"
                        onClick={() => this.setDetailToken(h.token)}
                        replace
                    >
                        <div className="row easy_history2">
                            <div className="history-detail master-type">
                                <span
                                    className={
                                        h.MasterType === '買'
                                            ? 'i_blue'
                                            : h.MasterType === '賣'
                                            ? 'i_green'
                                            : 'i_purple'
                                    }
                                ></span>
                                <span className="txt18">{h.MasterType}</span>
                            </div>
                            <div className="history-detail">
                                <h6>日期</h6>
                                {h.Date}
                            </div>
                            <div className="history-detail">
                                <h6>交易額（USDT）</h6>
                                {h.UsdtAmt}
                            </div>
                            <div className="history-detail">
                                <h6>結餘（USDT）</h6>
                                {h.Balance}
                            </div>
                            <div className="history-detail receiving ">
                                <h6>收款賬號</h6>2783721947813471
                            </div>
                            <div className="history-detail cny">
                                <h6>CNY</h6>100.00
                            </div>
                            <div className="history-detail rate">
                                <h6>匯率</h6>6.224
                            </div>
                            <div className="history-detail complete">
                                <h6>狀態</h6>完成
                            </div>
                        </div>

                        {h.token === detailToken && showDetail ? (
                            <Switch>
                                <Route path={`/home/history/all/:id*`} component={Detail} />
                                <Redirect to="/home/history/all" />
                            </Switch>
                        ) : null}
                    </Link>
                ))}
            </>
        );
    }
}
