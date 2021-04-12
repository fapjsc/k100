import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import CountDownUnreset from '../CountDownUnreset';

const Index = ({ minutes, seconds, getDeltaTime2, getConfirmPay, isCompleted }) => {
    console.log('button timer mount');

    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        getDeltaTime2();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="pairFoot">
            <Button
                disabled={completed || isCompleted}
                variant={completed || isCompleted ? 'secondary' : 'primary'}
                className="pairFoot-btn"
                onClick={getConfirmPay}
            >
                {completed || isCompleted ? (
                    '逾時'
                ) : (
                    <>
                        <p>已完成付款，下一步..</p>
                        <p>
                            剩餘時間:
                            {minutes && (
                                <CountDownUnreset
                                    setCompleted={setCompleted}
                                    minutes={minutes}
                                    seconds={seconds}
                                />
                            )}
                        </p>
                    </>
                )}
            </Button>
            <p>取消訂單</p>
        </div>
    );

    // if (completed) {
    //     return (
    //         <div className="pairFoot">
    //             <Button
    //                 disabled={completed}
    //                 variant="secondary"
    //                 className="pairFoot-btn"
    //                 onClick={props.props.getConfirmPay}
    //             >
    //                 已逾時
    //             </Button>
    //             <p>取消訂單</p>
    //         </div>
    //     );
    // } else {
    //     return (
    //         <div className="pairFoot">
    //             <Button
    //                 disabled={completed}
    //                 variant="primary"
    //                 className="pairFoot-btn"
    //                 onClick={props.props.getConfirmPay}
    //             >
    //                 <p>已完成付款，下一步...</p>
    //                 <p>
    //                     剩餘時間:
    //                     {minutes}:{seconds}
    //                 </p>
    //             </Button>
    //             <p>取消訂單</p>
    //         </div>
    //     );
    // }
};

export default Index;
