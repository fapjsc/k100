import './index.scss';
import Card from 'react-bootstrap/Card';

const CompletePay = props => {
  const backToHome = () => {
    props.history.replace('/home/overview');
  };

  if (!props.transactionDone) {
    return (
      <Card className="border-0">
        {/* <div className="txt_12 pt_20">購買USDT</div> */}
        <div className="text-center ">
          <div className="i_notyet" />
          <h4 className="c_blue">已提交，等待確認中</h4>
          <p className="txt_12_grey text-break">
            交易回執：
            {/* {props.transferData.Tx_HASH ? props.transferData.Tx_HASH : props.hash} */}
            {props.transferData.Tx_HASH}
            <br />
            購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            返回主頁
          </button>
        </div>
      </Card>
    );
  } else {
    return (
      <Card className="border-0">
        {/* <div className="txt_12 pt_20">購買USDT</div> */}
        <div className="text-center">
          <div className="i_done" />
          <h4 className="c_blue">交易完成</h4>
          <p className="txt_12_grey">
            交易回執：
            {props.transferData.Tx_HASH}
            <br />
            購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
          </p>
          <button onClick={backToHome} className="easy-btn mw400">
            返回主頁
          </button>
          <br />
          <p>詳細購買紀錄</p>
        </div>
      </Card>
    );
  }
};

export default CompletePay;
