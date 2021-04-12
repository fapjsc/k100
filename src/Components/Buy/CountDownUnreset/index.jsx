import React, { useState, useEffect } from 'react';

const Index = props => {
    const { minutes = 0, seconds = 0, setInfo, setCompleted } = props;
    const [time, setTime] = useState({
        minutes: parseInt(minutes),
        seconds: parseInt(seconds),
    });

    const [over, setOver] = useState(false);

    const tick = () => {
        // 暂停，或已结束
        if (over) {
            if (setInfo) {
                setInfo();
            } else {
                setCompleted(true);
            }
            return;
        }

        if (time.minutes === 0 && time.seconds === 0) setOver(true);
        else if (time.seconds === 0)
            setTime({
                minutes: time.minutes - 1,
                seconds: 59,
            });
        else
            setTime({
                minutes: time.minutes,
                seconds: time.seconds - 1,
            });
    };

    useEffect(() => {
        let timerId = setInterval(() => {
            tick();
        }, 1000);

        // 卸載時清除計時器
        return () => clearInterval(timerId);
    });

    return (
        <>
            {`${time.minutes.toString().padStart(2, '0')}:${time.seconds
                .toString()
                .padStart(2, '0')}`}
        </>
    );
};

export default Index;
