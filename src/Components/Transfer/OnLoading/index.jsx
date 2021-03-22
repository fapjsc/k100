import React from 'react';

import trans from '../../../Assets/icon_trans.gif';
import Modal from 'react-bootstrap/Modal';

const OnLoading = props => {
    return (
        // <div>
        //     <div className="loading_popup">
        //         <div className="load_box">
        //             <div style={{ textAlign: 'right' }}>
        //                 <img src="images/blue_close_btn.png" />
        //             </div>
        //             <div>
        //                 <img src={trans} />
        //             </div>
        //             <h3 style={{ color: '#3F80FA' }}>執行中，請稍等</h3>
        //             <p>轉賬1500.00 USDT</p>
        //         </div>
        //     </div>
        // </div>

        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Body className="text-center">
                    <img src={trans} alt="transfer" />
                    <h3 style={{ color: '#3F80FA' }}>執行中，請稍等</h3>
                    <p>轉賬1500.00 USDT</p>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    );
};

export default OnLoading;
