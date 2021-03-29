import React from 'react';

import trans from '../../../Assets/icon_trans.gif';
import iconError from '../../../Assets/icon_error.png';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const OnLoading = props => {
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            {props.isloading && props.isfailed ? (
                <Modal.Header closeButton>
                    <Modal.Body className="text-center">
                        <img src={iconError} alt="iconError" />
                        <h3 style={{ color: '#3F80FA' }}>轉帳失敗</h3>
                        <p>轉賬 {Number(props.usdtCount).toFixed(2)}USDT</p>
                    </Modal.Body>
                </Modal.Header>
            ) : (
                <Modal.Header>
                    <Modal.Body className="text-center">
                        <img src={trans} alt="transfer" />
                        <h3 style={{ color: '#3F80FA' }}>執行中，請稍等</h3>
                        <p>轉賬 {Number(props.usdtCount).toFixed(2)}USDT</p>
                        <Modal.Footer>
                            <Button onClick={props.onHide}>Back</Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal.Header>
            )}
        </Modal>
    );
};

export default OnLoading;
