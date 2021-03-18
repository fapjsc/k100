import React, { Component } from 'react';

import Spinner from 'react-bootstrap/Spinner';

import './index.scss';

export default class Detail extends Component {
    state = {
        masterType: null,
        master: null,
        isLoading: false,
        error: null,
    };

    getDetail = (token, headers) => {
        if (!token) {
            return;
        }

        this.detailReq(headers);
    };

    detailReq = async headers => {
        this.setState({
            isLoading: true,
        });

        // const {
        //     match: { params },
        // } = this.props;

        const { detailToken } = this.props;

        const detailApi = '/j/GetTxDetail.aspx';

        try {
            const res = await fetch(detailApi, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    Token: detailToken,
                }),
            });
            const resData = await res.json();

            if (!res.ok) {
                this.setState({
                    isLoading: false,
                    error: resData,
                });
                alert(resData);
                return;
            }

            const { data } = resData;
            this.setState({
                masterType: data.MasterType,
            });

            if (data.MasterType === 1 || data.MasterType === 0) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        account: data.P1,
                        payee: data.P2,
                        bank: data.P3,
                        branch: data.P4,
                        exchangePrice: data.D1,
                        rmb: data.D2,
                        charge: data.D3,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }

            if (data.MasterType === 2) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        receivingAddress: data.P1,
                        charge: data.D1,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }

            if (data.MasterType === 3) {
                this.setState({
                    master: {
                        date: data.Date,
                        txHASH: data.Tx_HASH,
                        usdtAmt: data.UsdtAmt,
                        orderState: data.Order_StatusID,
                        type: data.MasterType,
                    },
                });
            }

            this.setState({
                isLoading: false,
            });
        } catch (error) {
            this.setState({
                isLoading: false,
            });
            alert(error);
        }
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('login_session', token);
            this.getDetail(token, headers);
        }
    }

    render() {
        const { masterType, master, isLoading, error } = this.state;

        return (
            <div className="detail-box">
                {isLoading && !error ? (
                    <div className="detail-spinner">
                        <Spinner animation="grow" variant="info" />
                    </div>
                ) : !isLoading && error ? null : (
                    <ul>
                        <li className="thead">
                            <ol className="tr">
                                {masterType === 1 || masterType === 0 ? (
                                    <>
                                        <li>交易回執</li>
                                        <li>帳號</li>
                                        <li>收款人</li>
                                        <li>銀行</li>
                                        <li>分行</li>
                                        <li>手續費 %</li>
                                        <li>兌換費</li>
                                        <li>RMB</li>
                                    </>
                                ) : masterType === 2 ? (
                                    <>
                                        <li>交易回執</li>
                                        <li>收款地址</li>
                                        <li>手續費</li>
                                    </>
                                ) : masterType === 3 ? (
                                    <>
                                        <li>交易回執</li>
                                    </>
                                ) : null}
                            </ol>
                        </li>
                        <li className="tbody">
                            <ol className="tr">
                                {(masterType === 0 || masterType === 1) && master ? (
                                    <>
                                        <li data-title="交易回執">{master.txHASH}</li>
                                        <li data-title="帳號">{master.account}</li>
                                        <li data-title="收款人">{master.payee}</li>
                                        <li data-title="銀行">{master.bank}</li>
                                        <li data-title="分行">{master.branch}</li>
                                        <li data-title="手續費 %">{master.charge}%</li>
                                        <li data-title="兌換費">{master.exchangePrice}</li>
                                        <li data-title="RMB">{master.rmb}</li>
                                    </>
                                ) : masterType === 2 && master ? (
                                    <>
                                        <li data-title="交易回執">{master.txHASH}</li>
                                        <li data-title="收款地址">{master.receivingAddress}</li>
                                        <li data-title="手續費">{master.charge}</li>
                                    </>
                                ) : masterType === 3 && master ? (
                                    <>
                                        <li data-title="交易回執">{master.txHASH}</li>
                                    </>
                                ) : null}
                            </ol>
                        </li>
                    </ul>
                )}
            </div>
        );
    }
}
