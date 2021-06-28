import React from 'react';

// Lang Context
import { useI18n } from '../../../lang';

// Style
import './index.scss';
import Modal from 'react-bootstrap/Modal';
import searchIcon from '../../../Assets/icon_search.gif';
import closeBtn from '../../../Assets/blue_close_btn.png';

const Paring = props => {
  const { t } = useI18n();
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="text-right">
        <img
          src={closeBtn}
          alt="close btn"
          style={{
            cursor: 'pointer',
          }}
          onClick={props.onHide}
        />
        <div className="text-center">
          <img src={searchIcon} alt="icon" className="" />
          <h3 style={{ color: '#3F80FA' }}>{t('please_wait')}</h3>
          {props.usdt ? (
            <p>
              {t('buy_order')}：{Math.abs(Number(props.usdt).toFixed(2))} USDT = ${Number(props.rmb).toFixed(2)} CNY
            </p>
          ) : (
            <p>{t('btn_loading')}...</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Paring;
