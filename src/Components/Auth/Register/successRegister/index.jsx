import React from 'react';
import { Link, useHistory } from 'react-router-dom';

// Lang Context
import { useI18n } from '../../../../lang';

// Style
import CompleteImg from '../../../../Assets/i_complete.png';
import { Button } from 'react-bootstrap';
import './index.scss';

const SuccessRegister = props => {
  const history = useHistory();
  const { t } = useI18n();
  return (
    <div className="successRegBox">
      <img src={CompleteImg} alt="complete" />
      <h2 className="successRegText mt_sm">
        {/* {props.alreadyRegister ? '這個手機號碼已經註冊過了' : '註冊成功'} */}
        {t('register_success')}
      </h2>
      <Button block size="lg" className="fs_15 mt_sm" onClick={() => history.replace('/auth/login')}>
        {t('btn_login')}
      </Button>
    </div>
  );
};

export default SuccessRegister;
