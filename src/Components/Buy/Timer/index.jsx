import React, { useState, useEffect } from 'react';

const Timer = ({ minutes, seconds, getDeltaTime }) => {
    return (
        <span>
            {minutes}:{seconds}
        </span>
    );
};

export default Timer;
