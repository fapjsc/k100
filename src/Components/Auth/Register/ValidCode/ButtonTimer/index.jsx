import React from 'react';
import Button from 'react-bootstrap/Button';

const index = ({ resendValidCode, getValidCode, minutes, seconds, completed }) => {
  if (completed || !resendValidCode) {
    localStorage.removeItem('expiresIn');
    return (
      <Button className="" variant="primary" onClick={getValidCode}>
        發送驗證碼
      </Button>
    );
  } else {
    return (
      <>
        <Button className="" variant="secondary" disabled>
          發送驗證碼
          <span>
            {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
          </span>
        </Button>
      </>
    );
  }
};

export default index;
