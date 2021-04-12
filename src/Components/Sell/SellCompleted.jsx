import { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import confirmIcon from '../../Assets/icon_load02.gif';
import completedIcon from '../../Assets/i_complete.png';

const SellCompleted = props => {
    const history = useHistory();
    const backHome = () => {
        history.replace('/home/overview');
    };

    if (!props.isCompleted) {
        return (
            <Fragment>
                <div className="txt_12 pt_20">出售USDT</div>
                <div className="text-center">
                    <img src={confirmIcon} alt="confirm icon" style={notYet} />
                    <h4 className="c_blue mt-4 mb-4" style={notYetTitle}>
                        已提交，等待確認中
                    </h4>
                    <p className="txt_12_grey mb-4" style={notYetText}>
                        交易回執：
                        {props.Tx_HASH !== null && props.Tx_HASH}
                    </p>
                    <p className="txt_12_grey mb-4" style={notYetText}>
                        購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                    </p>
                    <button
                        className="easy-btn mw400"
                        onClick={backHome}
                        style={{
                            fontSize: 18,
                        }}
                    >
                        返回主頁
                    </button>
                    <span className="txt_12_grey" style={detailLink}>
                        詳細交易紀錄
                    </span>
                </div>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <div className="txt_12 pt_20">出售USDT</div>
                <div className="text-center">
                    <img src={completedIcon} alt="completeIcon" style={notYet} />
                    <h4 className="c_blue my-4" style={notYetTitle}>
                        交易完成
                    </h4>
                    <p className="txt_12_grey" style={notYetText}>
                        交易回執： {props.Tx_HASH !== null && props.Tx_HASH}
                    </p>
                    <p className="txt_12_grey" style={notYetText}>
                        購買成功後，數字貨幣將全額充值到您要付款的商戶，完成付款。訂單已開始處理，預計到賬時間：15分鐘內
                    </p>
                    <button
                        onClick={backHome}
                        className="easy-btn mw400"
                        style={{
                            fontSize: 18,
                        }}
                    >
                        返回主頁
                    </button>
                    <span className="txt_12_grey" style={detailLink}>
                        詳細交易紀錄
                    </span>
                </div>
            </Fragment>
        );
    }
};

const notYet = {
    height: 100,
};

const notYetTitle = {
    fontSize: 30,
    fontWeight: 'bold',
};

const notYetText = {
    fontSize: 16,
};

const detailLink = {
    fontSize: 15,
    fontWeight: 'bold',
    borderBottom: '1px solid grey',
    display: 'inline-block',
    marginBottom: 30,
};

export default SellCompleted;
