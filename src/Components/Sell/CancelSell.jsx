import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CancelSell = ({ show, handleClose, cancelOrder, orderToken, hash }) => {
    const handleConfirm = () => {
        cancelOrder(orderToken);
        handleClose(false);
    };
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        訂單號：
                        <p>{hash}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        fontSize: 16,
                    }}
                >
                    確定取消此筆訂單嗎？
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose(false)}>
                        返回
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        確定
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CancelSell;
