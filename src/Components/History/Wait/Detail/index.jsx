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
        const detailItem = historyList.find(h => h.token === detailToken);
        this.setState({
            detailItem,
        });
    };

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
