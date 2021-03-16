import React from 'react';

const index = ({ key, minutes, seconds, completed, ...props }) => {
    if (completed) {
        props.props.setInfo();
    }
    return (
        <span>
            {minutes}:{seconds}
        </span>
    );
};

export default index;
