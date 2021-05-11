import Card from 'react-bootstrap/Card';

const CompleteStatus = props => {
  console.log(props);
  if (props.wsStatus === 34) {
    return (
      <Card className="border-0 text-center">
        <div className="i_notyet mt-4" />
        <h4 className="c_blue">已提交，等待確認中</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <p className="txt_12_grey text-break">
          購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
        </p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 1) {
    return (
      <Card className="border-0 text-center">
        <div className="i_done mt-4" />
        <h4 className="c_blue">交易完成</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <p className="txt_12_grey text-break">
          購買成功後，數字貨幣預計15~30分鐘內到達你的錢包地址
        </p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 99) {
    return (
      <Card className="border-0 text-center">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">交易取消</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }

  if (props.wsStatus === 98) {
    return (
      <Card className="border-0 text-center">
        <div className="i_error mt-4" />
        <h4 className="c_blue mt-4">交易超時</h4>
        <br />
        <p className="txt_12_grey text-break">交易回執： {props.hash}</p>
        <br />
        <button onClick={props.backToHome} className="easy-btn mw400">
          返回主頁
        </button>
      </Card>
    );
  }
};

export default CompleteStatus;
