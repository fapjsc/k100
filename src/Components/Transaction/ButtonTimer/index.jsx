import React from 'react';
import Button from 'react-bootstrap/Button';

const index = ({ key, minutes, seconds, completed, ...props }) => {
    console.log('button timer mount');

    if (completed) {
        return (
            <div className="pairFoot">
                <Button
                    disabled={completed}
                    variant="primary"
                    className="pairFoot-btn"
                    onClick={props.props.getConfirmPay}
                >
                    已逾時
                </Button>
                <p>取消訂單</p>
            </div>
        );
    } else {
        return (
            <div className="pairFoot">
                <Button
                    disabled={completed}
                    variant="primary"
                    className="pairFoot-btn"
                    onClick={props.props.getConfirmPay}
                >
                    <p>已完成付款，下一步...</p>
                    <p>
                        剩餘時間:
                        {minutes}:{seconds}
                    </p>
                </Button>
                <p>取消訂單</p>
            </div>
        );
    }
};

export default index;
