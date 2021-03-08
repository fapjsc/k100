import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

const index = props => {
    const { httpError, closeDialog } = props;
    return (
        <Modal
            size="lg"
            show={!!httpError}
            onHide={closeDialog}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    <h4 className="fs_40">{httpError.title}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="fs_20">{httpError.body}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button size="lg" onClick={closeDialog}>
                    <span className="p_sm ">關閉</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default index;
