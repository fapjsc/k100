import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import SellContext from '../../context/sell/SellContext';
import SellHeaders from './SellHeader';

import SellCompleted from './SellCompleted';
import SellCountDown from './SellCountDown';
import Chat from '../Chat';

import helpIcon from '../../Assets/i_ask2.png';
import btnWait from '../../Assets/btn_wait.png';
import Button from 'react-bootstrap/Button';

const SellInfo = () => {
    // Break Points
    const isLaptopFloor = useMediaQuery({ query: '(max-width: 1100px)' });
    const mobileApp = useMediaQuery({ query: '(max-width: 450px)' });

    let { id } = useParams();
    const sellContext = useContext(SellContext);
    const {
        wsData,
        sellWebSocket,
        closeWebSocket,
        payment,
        sellIsCompleted,
        cancelOrder,
    } = sellContext;

    const [timer, setTimer] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [seconds, setSeconds] = useState(null);
    const [overTime, setOverTime] = useState(false);
    const [isChat, setIsChat] = useState(true);
    const [confirmSell, setConfirmSell] = useState(false);

    useEffect(() => {
        sellWebSocket(id);

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setOverTime(false);
        if (wsData) {
            setTimer(900 - wsData.DeltaTime);

            let minutesTime;

            if (timer !== null) {
                if (timer <= 0) {
                    setMinutes(0);
                    setSeconds(0);
                    setOverTime(true);
                    return;
                }

                if (wsData.DeltaTime === 0) {
                    minutesTime = parseInt(timer / 60) + 1;
                } else {
                    minutesTime = parseInt(timer / 60);
                }

                let secondsTime = Math.round((timer / 60 - Math.trunc(timer / 60)) * 60);

                setMinutes(minutesTime);
                setSeconds(secondsTime);
            }
        }
    }, [timer, wsData]);

    const handleChat = () => {
        setIsChat(!isChat);
    };

    // 確認收款
    const handleSubmit = () => {
        setConfirmSell(true);
    };

    // confirmSell 判斷要render sell info 還是 提交確認/交易完成組件
    if (!confirmSell) {
        return (
            <Fragment>
                <SellHeaders />
                <main>
                    <section style={isLaptopFloor ? infoBoxLabTop : infoBox}>
                        <div style={mobileApp ? infoHeaderMobileApp : infoHeader}>
                            <p
                                style={{
                                    fontSize: 18,
                                }}
                            >
                                提交資料
                            </p>
                            <p
                                style={{
                                    fontSize: 18,
                                }}
                            >
                                剩餘時間：
                                <span
                                    style={{
                                        color: !overTime ? '#DAA520' : 'red',
                                    }}
                                >
                                    {/* 12分12秒 */}
                                    {timer && minutes && seconds && !overTime ? (
                                        <SellCountDown
                                            minutes={minutes}
                                            seconds={seconds}
                                            setOverTime={setOverTime}
                                        />
                                    ) : overTime ? (
                                        '逾時'
                                    ) : null}
                                </span>
                            </p>
                        </div>

                        <div style={isLaptopFloor ? infoBodyLabTop : infoBody}>
                            <p>
                                收款金額：
                                <span
                                    style={{
                                        color: '#007bff',
                                        fontSize: 30,
                                        fontWeight: '600',
                                    }}
                                >
                                    {wsData && wsData.D2 + ` CNY`}
                                </span>
                            </p>
                            <p>收款姓名：{wsData && wsData.P2}</p>
                            <p>付款帳號：{wsData && wsData.P1}</p>
                            <p>開戶銀行：{wsData && wsData.P3}</p>
                            <p>所在省市：{wsData && wsData.P4}</p>
                        </div>

                        <div
                            style={
                                isLaptopFloor && !mobileApp
                                    ? infoCountLabTop
                                    : mobileApp
                                    ? infoCountMobileApp
                                    : infoCount
                            }
                        >
                            <p
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                總價
                                <br />
                                <span
                                    style={{
                                        fontSize: 28,
                                        color: '#007bff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {wsData && wsData.D2.toFixed(2) + ` CNY`}
                                </span>
                            </p>
                            <p
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                數量
                                <br />
                                <span
                                    style={{
                                        fontSize: 28,
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {wsData && wsData.UsdtAmt.toFixed(2) + ` USDT`}
                                </span>
                            </p>
                        </div>
                    </section>
                    <div style={mobileApp ? infoBtnBoxMobileApp : infoBtnBox}>
                        {/* <Button
                            onClick={handleSubmit}
                            block
                            style={infoBtn}
                            variant={overTime ? 'secondary' : 'primary'}
                            disabled={overTime}
                        >
                            {overTime ? '逾時' : '確認收款'}
                        </Button> */}

                        <Button
                            onClick={handleSubmit}
                            block
                            style={infoBtn}
                            variant="secondary"
                            variant={payment ? 'primary' : 'secondary'}
                            disabled={!payment}
                        >
                            {!payment && (
                                <img
                                    src={btnWait}
                                    alt="btn wait"
                                    style={{
                                        height: 25,
                                        marginRight: 15,
                                    }}
                                />
                            )}

                            <span style={{}}>
                                {payment ? ' 買家已付款，確認收款' : '對方準備中'}
                            </span>
                        </Button>

                        <span
                            onClick={() => cancelOrder(id)}
                            className="txt_12_grey"
                            style={cancelLink}
                        >
                            取消訂單
                        </span>
                    </div>
                    {/* Footer */}
                    <footer
                        style={{
                            borderTop: '2px solid #ddd',
                            marginTop: 20,
                        }}
                    >
                        <ul className="txt_12_grey">
                            <li>請勿向上述地址充值任何非USDT資産，否則資産將不可找回。</li>
                            <br />
                            <li>
                                您充值至上述地址後，需要整個網絡節點的確認，12次網絡確認後到賬，12次網絡確認後可提幣。
                            </li>
                            <br />
                            <li>最小充值金額：1 USDT，小于最小金額的充值將不會上賬且無法退回。</li>
                            <br />
                            <li>
                                您的充值地址不會經常改變，可以重複充值；如有更改，我們會盡量通過網站公告或郵件通知您。
                            </li>
                            <br />
                            <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
                            <br />
                            <li>
                                USDT充幣僅支持以太坊transfer和transferFrom方法，使用其他方法的充幣暫時無法上賬，請您諒解。
                            </li>
                        </ul>
                    </footer>
                </main>

                <Button style={helpBtn} variant="primary" onClick={handleChat}>
                    <img
                        style={{
                            width: 15,
                            height: 20,
                            marginRight: 8,
                        }}
                        src={helpIcon}
                        alt="help icon"
                    />
                    幫助
                </Button>

                {wsData ? <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={isChat} /> : null}
            </Fragment>
        );
    } else {
        return (
            // 已提交以及交易完成，isCompleted判斷是否完成交易
            <Fragment>
                <SellCompleted Tx_HASH={wsData && wsData.Tx_HASH} isCompleted={sellIsCompleted} />
                <Button style={helpBtn} variant="primary" onClick={handleChat}>
                    <img
                        style={{
                            width: 15,
                            height: 20,
                            marginRight: 8,
                        }}
                        src={helpIcon}
                        alt="help icon"
                    />
                    幫助
                </Button>

                {wsData ? <Chat Tx_HASH={wsData.Tx_HASH} orderToken={id} isChat={isChat} /> : null}
            </Fragment>
        );
    }
};

const infoBox = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, min-content)',
    gridColumnGap: 30,
    fontSize: 20,
    marginTop: 25,
};

const infoHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
};

const infoBody = {
    gridRow: '2 / 3',
    gridColumn: '1 / 2',
    backgroundColor: '#f2f2f2',
    padding: 10,
};

const infoCount = {
    gridRow: '1 / 3',
    gridColumn: '2 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: 200,
    border: '3px solid #007bff',
    borderRadius: 7,
};

const infoBtnBox = {
    textAlign: 'center',
    maxWidth: '40%',
    margin: 'auto',
    marginTop: 30,
};

const infoBtn = {
    padding: 10,
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const cancelLink = {
    fontSize: 15,
    fontWeight: 'bold',
    borderBottom: '1px solid grey',
    display: 'inline-block',
    marginTop: 20,
    cursor: 'pointer',
};

const helpBtn = {
    fontSize: 18,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 40,
    position: 'fixed',
    bottom: 50,
    right: 50,
};

// Lab TOp
const infoBoxLabTop = {};

const infoBodyLabTop = {
    backgroundColor: '#f2f2f2',
    padding: 10,
    fontSize: 20,
};

const infoCountLabTop = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: 200,
    border: '3px solid #007bff',
    borderRadius: 7,
    marginTop: 20,
};

// Mobile App
const infoHeaderMobileApp = {
    display: 'flex',
    flexDirection: 'column-reverse',
    padding: 10,
};

const infoCountMobileApp = {
    border: '3px solid #007bff',
    borderRadius: 7,
    marginTop: 20,
    padding: 20,
};

const infoBtnBoxMobileApp = {
    textAlign: 'center',
    maxWidth: '100%',
    margin: 'auto',
    marginTop: 30,
};

export default SellInfo;