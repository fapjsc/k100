import React, { Component } from 'react';

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
        const { historyState } = this.state;

        return (
            <section className={style.section}>
                <div className="container h_88">
                    <div className="row">
                        <div className="col-12">
                            <p className="welcome_txt">歡迎登入</p>
                            <div className="contentbox">
                                <div className="tab">
                                    <button
                                        className={
                                            historyState === 'all' ? 'w_100 active' : 'w_100'
                                        }
                                        onClick={() => this.handleHistoryState('all')}
                                        id="defaultOpen"
                                    >
                                        所有紀錄
                                    </button>
                                    <button
                                        className={
                                            historyState === 'wait' ? 'w_100 active' : 'w_100'
                                        }
                                        onClick={() => this.handleHistoryState('wait')}
                                    >
                                        待處理
                                    </button>
                                </div>

                                {historyState === 'all' ? <All /> : <Wait />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
