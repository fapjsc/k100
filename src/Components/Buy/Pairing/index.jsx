import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './index.scss';
import searchIcon from '../../../Assets/icon_search.gif';
import closeBtn from '../../../Assets/blue_close_btn.png';

const Paring = props => {
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="text-right">
        <img
          src={closeBtn}
          alt="close btn"
          style={{
            cursor: 'pointer',
          }}
          onClick={props.backToHome}
        />
        <div className="text-center">
          <img src={searchIcon} alt="icon" className="" />
          <h3 style={{ color: '#3F80FA' }}>請稍等，現正整合交易者資料</h3>
          <p>
            購買訂單：{Number(props.usdtamt).toFixed(2)} USDT @ {Number(props.rmbamt).toFixed(2)}{' '}
            CNY
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Paring;
