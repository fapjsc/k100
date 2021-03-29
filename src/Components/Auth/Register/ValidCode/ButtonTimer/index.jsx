import React from 'react';
import Button from 'react-bootstrap/Button';

const index = ({ resendValidCode, getValidCode, minutes, seconds, completed }) => {
    if (completed || !resendValidCode) {
        return (
            <Button className="mt-4" variant="primary" onClick={getValidCode}>
                發送驗證碼
            </Button>
        );
    } else {
        return (
            <>
                <Button className="mt-4" variant="secondary" disabled>
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
