import React from 'react';

import CompleteImg from '../../../../Assets/i_complete.png';

import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import './index.scss';

const SuccessRegister = props => {
    return (
        <div className="successRegBox">
            <img src={CompleteImg} alt="complete" />
            <h2 className="successRegText mt_sm">註冊成功</h2>
            <Button block size="lg" className="fs_15 mt_sm">
                <Link className="color-white registerLink" to="/auth/login">
                    登入
                </Link>
            </Button>
        </div>
    );
};

export default SuccessRegister;
