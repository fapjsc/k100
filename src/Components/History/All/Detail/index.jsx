import React, { Component } from 'react';

import Table from 'react-bootstrap/Table';
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

        const {
            match: { params },
        } = this.props;

        const detailApi = '/j/GetTxDetail.aspx';

        try {
            const res = await fetch(detailApi, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    Token: params.id,
                }),
            });
            const resData = await res.json();

            console.log(resData);

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
                ) : !isLoading && error ? (
                    <h1>test</h1>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {masterType === 1 || masterType === 0 ? (
                                    <>
                                        <th>日期</th>
                                        <th>交易回執</th>
                                        <th>UsdtAmt</th>
                                        <th>帳號</th>
                                        <th>收款人</th>
                                        <th>銀行</th>
                                        <th>分行</th>
                                        <th>兌換費</th>
                                        <th>RMB</th>
                                        <th>手續費 %</th>
                                        <th>State</th>
                                    </>
                                ) : masterType === 2 ? (
                                    <>
                                        <th>日期</th>
                                        <th>交易回執</th>
                                        <th>UsdtAmt</th>
                                        <th>收款地址</th>
                                        <th>手續費</th>
                                        <th>State</th>
                                    </>
                                ) : masterType === 3 ? (
                                    <>
                                        <th>日期</th>
                                        <th>交易回執</th>
                                        <th>UsdtAmt</th>
                                        <th>State</th>
                                    </>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {(masterType === 0 || masterType === 1) && master ? (
                                    <>
                                        <td>{master.date}</td>
                                        <td>{master.txHASH}</td>
                                        <td>{master.usdtAmt}</td>
                                        <td>{master.account}</td>
                                        <td>{master.payee}</td>
                                        <td>{master.bank}</td>
                                        <td>{master.branch}</td>
                                        <td>{master.exchangePrice}</td>
                                        <td>{master.rmb}</td>
                                        <td>{master.charge}%</td>
                                        <td>{master.orderState}</td>
                                    </>
                                ) : masterType === 2 && master ? (
                                    <>
                                        <td>{master.date}</td>
                                        <td>{master.txHASH}</td>
                                        <td>{master.usdtAmt}</td>
                                        <td>{master.receivingAddress}</td>
                                        <td>{master.charge}</td>
                                        <td>{master.orderState}</td>
                                    </>
                                ) : masterType === 3 && master ? (
                                    <>
                                        <td>{master.date}</td>
                                        <td>{master.txHASH}</td>
                                        <td>{master.usdtAmt}</td>
                                        <td>{master.orderState}</td>
                                    </>
                                ) : null}
                            </tr>
                        </tbody>
                    </Table>
                )}
            </div>
        );
    }
}
