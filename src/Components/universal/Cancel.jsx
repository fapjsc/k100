import { useState, useContext } from 'react';

// Context
import BuyContext from '../../context/buy/BuyContext';
import HttpErrorContext from '../../context/httpError/HttpErrorContext';

// Components
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

// Style
import errorIcon from '../../Assets/icon-error-new.png';

const Cancel = props => {
  // Http Error Context
  const httpErrorContext = useContext(HttpErrorContext);
  const { httpLoading, setHttpLoading } = httpErrorContext;

  // Buy Context
  const buyContext = useContext(BuyContext);
  const { buyWsData, cancelOrder, buyOrderToken } = buyContext;

  const handleCancel = () => {
    setHttpLoading(true);

    if (props.type === 'instant') {
      cancelOrder(props.token);
      return;
    }

    cancelOrder(buyOrderToken);
  };

  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
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
            {buyWsData && buyWsData.hash}
            {props.hash && props.hash}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="" style={{ border: 'none' }}>
        <Button className="mr-3" variant="secondary" onClick={props.onHide}>
          返回
        </Button>
        {httpLoading ? (
          <Button variant="primary" disabled>
            <Spinner animation="grow" variant="danger" />
            Loading...
          </Button>
        ) : (
          <Button variant="primary" onClick={handleCancel}>
            確定取消訂單
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Cancel;
