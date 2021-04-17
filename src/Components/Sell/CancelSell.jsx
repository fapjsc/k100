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
        <Modal.Header>
          <Modal.Title>
            訂單號：
            <p>{hash}</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(false)}>
            返回
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            確定取消訂單
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelSell;
