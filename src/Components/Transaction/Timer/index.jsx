import React from 'react';

const Timer = ({ minutes, seconds }) => {
    // if (completed) {
    //     props.props.setInfo();
    // }

    return (
        <span>
            {minutes}:{seconds}
        </span>
    );
};

export default Timer;
