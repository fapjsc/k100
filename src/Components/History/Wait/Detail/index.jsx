import React, { Component } from 'react';

import './index.scss';

export default class Detail extends Component {
    state = {
        masterType: null,
        master: null,
        isLoading: false,
        error: null,
        detailItem: {},
    };

    getDetail = () => {
        const { detailToken, historyList } = this.props;
        console.log(detailToken, historyList);
        const detailItem = historyList.find(h => h.token === detailToken);
        this.setState({
            detailItem,
        });
    };

    // detailReq = async headers => {
    //     this.setState({
    //         isLoading: true,
    //     });

    //     // const {
    //     //     match: { params },
    //     // } = this.props;

    //     const { detailToken } = this.props;

    //     const detailApi = '/j/GetTxPendings.aspx';

    //     try {
    //         const res = await fetch(detailApi, {
    //             method: 'POST',
    //             headers,
    //             body: JSON.stringify({
    //                 Token: detailToken,
    //             }),
    //         });
    //         const resData = await res.json();

    //         console.log(resData);

    //         if (!res.ok) {
    //             this.setState({
    //                 isLoading: false,
    //                 error: resData,
    //             });
    //             alert(resData);
    //             return;
    //         }

    //         const { data } = resData;

    //         this.setState({
    //             masterType: data.MasterType,
    //         });

    //         if (data.MasterType === 1 || data.MasterType === 0) {
    //             this.setState({
    //                 master: {
    //                     date: data.Date,
    //                     txHASH: data.Tx_HASH,
    //                     usdtAmt: data.UsdtAmt,
    //                     account: data.P1,
    //                     payee: data.P2,
    //                     bank: data.P3,
    //                     branch: data.P4,
    //                     exchangePrice: data.D1,
    //                     rmb: data.D2,
    //                     charge: data.D3,
    //                     orderState: data.Order_StatusID,
    //                     type: data.MasterType,
    //                 },
    //             });
    //         }

    //         if (data.MasterType === 2) {
    //             this.setState({
    //                 master: {
    //                     date: data.Date,
    //                     txHASH: data.Tx_HASH,
    //                     usdtAmt: data.UsdtAmt,
    //                     receivingAddress: data.P1,
    //                     charge: data.D1,
    //                     orderState: data.Order_StatusID,
    //                     type: data.MasterType,
    //                 },
    //             });
    //         }

    //         if (data.MasterType === 3) {
    //             this.setState({
    //                 master: {
    //                     date: data.Date,
    //                     txHASH: data.Tx_HASH,
    //                     usdtAmt: data.UsdtAmt,
    //                     orderState: data.Order_StatusID,
    //                     type: data.MasterType,
    //                 },
    //             });
    //         }

    //         this.setState({
    //             isLoading: false,
    //         });
    //     } catch (error) {
    //         this.setState({
    //             isLoading: false,
    //         });
    //         alert(error);
    //     }
    // };

    componentDidMount() {
        console.log('detail mount');
        const token = localStorage.getItem('token');
        if (token) {
            this.getDetail();
        }
    }

    render() {
        const { detailItem } = this.state;

        console.log(detailItem);

        return (
            <div className="detail-box">
                <ul>
                    <li className="thead">
                        <ol className="tr">
                            {detailItem.MasterType === '買入' ||
                            detailItem.MasterType === '賣出' ? (
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
                            ) : detailItem.MasterType === '轉出' ? (
                                <>
                                    <li>交易回執</li>
                                    <li>收款地址</li>
                                    <li>手續費</li>
                                </>
                            ) : detailItem ? (
                                <>
                                    <li>交易回執</li>
                                </>
                            ) : null}
                        </ol>
                    </li>
                    <li className="tbody">
                        <ol className="tr">
                            {(detailItem.MasterType === '買入' ||
                                detailItem.MasterType === '賣出') &&
                            detailItem ? (
                                <>
                                    <li data-title="交易回執">{detailItem.txHASH}</li>
                                    <li data-title="帳號">{detailItem.account}</li>
                                    <li data-title="收款人">{detailItem.payee}</li>
                                    <li data-title="銀行">{detailItem.bank}</li>
                                    <li data-title="分行">{detailItem.branch}</li>
                                    <li data-title="手續費 %">{detailItem.charge}%</li>
                                    <li data-title="兌換費">{detailItem.exchangePrice}</li>
                                    <li data-title="RMB">{detailItem.rmb}</li>
                                </>
                            ) : detailItem.masterType === '轉出' ? (
                                <>
                                    <li data-title="交易回執">{detailItem.txHASH}</li>
                                    <li data-title="收款地址">{detailItem.receivingAddress}</li>
                                    <li data-title="手續費">{detailItem.charge}</li>
                                </>
                            ) : detailItem.masterType === '轉入' ? (
                                <>
                                    <li data-title="交易回執">{detailItem.txHASH}</li>
                                </>
                            ) : null}
                        </ol>
                    </li>
                </ul>
            </div>
        );
    }
}
