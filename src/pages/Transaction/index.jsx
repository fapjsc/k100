import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import TransactionNav from '../../Components/TransactionNav';
import Buy from '../../Components/Buy';
import Sell from '../../Components/Sell';
import Transfer from '../../Components/Transfer';

export default class Transaction extends Component {
    render() {
        const { location } = this.props;
        return (
            <>
                <section className="overview bg_grey">
                    <div className="container h_88">
                        <div className="row">
                            <div className="col-12 ">
                                <p className="welcome_txt">歡迎登入</p>
                            </div>

                            <div className="col-12 transaction-card">
                                {/* Nav */}
                                <TransactionNav location={location} />

                                {/* 申請購買 */}
                                {/* <Buy /> */}
                                <Route path="/home/transaction/buy" component={Buy} />
                                <Route path="/home/transaction/sell" component={Sell} />
                                <Route path="/home/transaction/transfer" component={Transfer} />
                                <Redirect to="/home/transaction/buy" />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
