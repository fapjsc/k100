import React from 'react';
import Button from 'react-bootstrap/Button';

const index = ({ resendValidCode, getValidCode, minutes, seconds, completed, t }) => {
  if (resendValidCode) {
    // localStorage.removeItem('expiresIn');
    return (
      <Button className="" variant="primary" onClick={getValidCode}>
        {t('btn_send_valid_code')}
      </Button>
    );
  } else {
    return (
      <>
        <Button className="" variant="secondary" disabled>
          {t('btn_send_valid_code')}
          <span>
            {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
          </span>
        </Button>
      </>
    );
  }
};

export default index;
