import React from 'react';
import Modal from 'react-bootstrap/Modal';
import errorIcon from '../../Assets/icon-error-new.png';
import successIcon from '../../Assets/i_complete.png';
import closeBtn from '../../Assets/blue_close_btn.png';

const Paring = props => {
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="text-right p-4">
        <img
          src={closeBtn}
          alt="close btn"
          style={{
            cursor: 'pointer',
            height: 15,
          }}
          onClick={props.onHide}
        />
        <div className="text-center">
          <img src={props.status === 'fail' ? errorIcon : successIcon} alt="icon" className="" />
          <h3
            style={{
              marginTop: 20,
              fontSize: 20,
              color: '#3e80f9',
            }}
          >
            {props.title}
          </h3>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Paring;
