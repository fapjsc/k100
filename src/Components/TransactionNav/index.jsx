import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TransactionNav extends Component {
    render() {
        const { location } = this.props;
        return (
            <div className="history-tab trans-tab">
                <Link
                    to="/home/transaction/buy"
                    className={
                        location.pathname === '/home/transaction/buy'
                            ? 'history-link history-link-active'
                            : 'history-link'
                    }
                >
                    購買
                </Link>
                <Link
                    to="/home/transaction/sell"
                    className={
                        location.pathname === '/home/transaction/sell'
                            ? 'history-link history-link-active'
                            : 'history-link'
                    }
                >
                    出售
                </Link>

                <Link
                    to="/home/transaction/transfer"
                    className={
                        location.pathname === '/home/transaction/transfer'
                            ? 'history-link history-link-active'
                            : 'history-link'
                    }
                >
                    轉帳
                </Link>
            </div>
        );
    }
}
