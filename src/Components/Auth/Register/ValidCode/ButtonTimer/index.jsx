import React from 'react';
import Button from 'react-bootstrap/Button';

const index = ({ resendValidCode, getValidCode, minutes, seconds, completed }) => {
    if (completed || !resendValidCode) {
        localStorage.removeItem('expiresDate');
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
                        {minutes}:{seconds}
                    </span>
                </Button>
            </>
        );
    }
};

export default index;
