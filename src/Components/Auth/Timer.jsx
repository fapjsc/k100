import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

const Timer = ({ minutes, seconds, phoneValid, setExpirTime }) => {
  useEffect(() => {
    let time = Number(localStorage.getItem('expiresIn'));
    setExpirTime(time);

    // eslint-disable-next-line
  });
  return (
    <Button
      aria-controls="example-collapse-text"
      aria-expanded={phoneValid}
      className="w-100 easy-btn-bs"
      disabled
      variant="secondary"
      style={{
        cursor: 'auto',
      }}
    >
      驗證碼已發送
      <span>
        {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
      </span>
    </Button>
  );
};

export default Timer;
