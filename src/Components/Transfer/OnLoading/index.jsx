import React from 'react';

import trans from '../../../Assets/icon_trans.gif';
import iconError from '../../../Assets/icon_error.png';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import closeBtn from '../../../Assets/blue_close_btn.png';

const OnLoading = props => {
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      {props.isloading && props.isfailed ? (
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
            <img src={iconError} alt="iconError" />
            <h3 style={{ color: '#3F80FA' }}>轉帳失敗</h3>
            <p>轉賬 {Math.abs(Number(props.usdtcount)).toFixed(2)}USDT</p>
          </div>
        </Modal.Body>
      ) : (
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
            <img src={trans} alt="transfer" />
            <h3 style={{ color: '#3F80FA' }}>執行中，請稍等</h3>
            <p>轉賬 {Math.abs(Number(props.usdtcount)).toFixed(2)} USDT</p>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};

export default OnLoading;
