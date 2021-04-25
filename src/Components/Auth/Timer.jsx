import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Timer = ({ minutes, seconds, completed, sendValidCode, phoneValid, isLoading }) => {
  if (completed) {
    return (
      <>
        <Button
          onClick={sendValidCode}
          aria-controls="example-collapse-text"
          aria-expanded={phoneValid}
          className="w-100 easy-btn-bs"
          disabled={isLoading}
          style={{
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading ? 'grey' : '#3e80f9',
          }}
        >
          {isLoading && <Spinner className="mr-3" animation="grow" variant="danger" />}

          {!isLoading ? <span>重新發送驗證碼</span> : <span>Loading...</span>}
        </Button>
        <p className="pl-2 text-danger">*點擊按鈕後發送一次性驗證碼</p>
      </>
    );
  } else {
    return (
      <Button
        aria-controls="example-collapse-text"
        aria-expanded={phoneValid}
        className="w-100 easy-btn-bs"
        disabled
        variant="secondary"
      >
        驗證碼已發送
        <span>
          {minutes}:{seconds}
        </span>
      </Button>
    );
  }

  //   return (
  //     <Button className="" variant="secondary" disabled>
  //       發送驗證碼
  //       <span>
  //         {minutes}:{seconds}
  //       </span>
  //     </Button>
  //   );
};

export default Timer;
