import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import errorIcon from '../../Assets/icon-error-new.png';

const CancelSell = ({ show, handleClose, cancelOrder, orderToken, hash }) => {
  const handleConfirm = () => {
    cancelOrder(orderToken);
    handleClose(false);
  };
  return (
    <>
      <Modal size="sm" show={show} onHide={handleClose} centered>
        <Modal.Body className="text-center p-4">
          <img src={errorIcon} alt="icon" className="" />
          <Modal.Title
            style={{
              marginTop: 20,
              fontSize: 20,
              color: '#3e80f9',
            }}
          >
            確定取消訂單嗎？
          </Modal.Title>

          <div
            className="mt-4 text-left txt_12_grey"
            style={{
              backgroundColor: '#F7F9FD',
              padding: 10,
            }}
          >
            <p className="mb-0">訂單號：</p>
            <p
              style={{
                wordBreak: 'break-all',
              }}
              className="mb-0"
            >
              {hash}
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="" style={{ border: 'none' }}>
          <Button className="mr-3" variant="secondary" onClick={() => handleClose(false)}>
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
