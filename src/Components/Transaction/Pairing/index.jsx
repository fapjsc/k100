import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './index.scss';
import searchIcon from '../../../Assets/icon_search.gif';

const Paring = props => {
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={false}
        >
            <Modal.Header closeButton className="modal-title">
                <Modal.Title id="contained-modal-title-vcenter">
                    <div className="text-center">
                        <img src={searchIcon} alt="icon" className="modal-img" />
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <h3 style={{ color: '#3F80FA' }}>請稍等，現正整合交易者資料</h3>
                    <p>
                        購買訂單：{props.usdtamt} USDT @ {props.rmbamt} CNY
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default Paring;
