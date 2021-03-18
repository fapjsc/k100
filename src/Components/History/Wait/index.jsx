import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';

import BaseSpinner from './../../Ui/BaseSpinner';

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

        const historyApi = '/j/GetTxPendings.aspx';

        try {
            const res = await fetch(historyApi, {
                headers,
            });

            const resData = await res.json();

            if (!res.ok) {
                const error = new Error(resData || 'something wrong');
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
        const { historyList, isLoading } = this.state;
        console.log(historyList);

        return (
            <>
                {!isLoading ? (
                    historyList.map(h => (
                        <Fragment key={h.token}>
                            <Link
                                // to={`/home/history/all/${h.token}`}
                                to={`/home/history/wait`}
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
                                        <span
                                            className={
                                                h.MasterType === '買入'
                                                    ? 'txt18 history-detail-text'
                                                    : h.MasterType === '賣出'
                                                    ? 'txt18_g history-detail-text'
                                                    : 'txt18_p history-detail-text'
                                            }
                                        >
                                            {h.UsdtAmt}
                                        </span>
                                    </div>

                                    <div className="history-detail">
                                        <h6 className="history-detail-title">結餘（USDT）</h6>
                                        <span className="history-detail-text">{h.Balance}</span>
                                    </div>

                                    <div className="history-detail">
                                        <h6 className="history-detail-title">狀態</h6>
                                        <span className="history-detail-text history-complete">
                                            {h.Order_StatusID === 34
                                                ? '收款確認中'
                                                : h.Order_StatusID === 33
                                                ? '等待付款'
                                                : h.Order_StatusID === 0
                                                ? '執行中'
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* {h.token === detailToken && showDetail ? (
                                <Switch>
                                    <Route
                                        path={`/home/history/wait/detail`}
                                        component={() => (
                                            <Detail
                                                detailToken={detailToken}
                                                historyList={historyList}
                                            />
                                        )}
                                    />
                                    <Redirect to="/home/history/wait" />
                                </Switch>
                            ) : null} */}
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
