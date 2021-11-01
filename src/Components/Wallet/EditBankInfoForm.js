import { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

// Helpers
import { _setAgentAccDataFormat } from '../../lib/helper';

// Hooks
import useHttp from '../../hooks/useHttp';

// Apis
import { setAgentAcc } from '../../lib/api';

const EditBankInfoForm = props => {
  const { getAccData, sendAccRequest, onHide } = props;

  const [formData, setFormData] = useState({
    account: getAccData.P1,
    name: getAccData.P2,
    bank: getAccData.P3,
    city: getAccData.P4,
  });

  const [errorText, setErrorText] = useState('');

  // Http
  const {
    data: setAccData,
    error: setAccError,
    status: setAccStatus,
    sendRequest: setAccReq,
  } = useHttp(setAgentAcc);

  const onChangeHandler = e => {
    if (e.target.id === 'formBasicAccount') {
      setFormData(preState => {
        return { ...preState, account: e.target.value };
      });
    }

    if (e.target.id === 'formBasicName') {
      setFormData(preState => {
        return { ...preState, name: e.target.value };
      });
    }

    if (e.target.id === 'formBasicCity') {
      setFormData(preState => {
        return { ...preState, city: e.target.value };
      });
    }

    if (e.target.id === 'formBasicBank') {
      setFormData(preState => {
        return { ...preState, bank: e.target.value };
      });
    }
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    if (
      formData.account === '' ||
      formData.name === '' ||
      formData.bank === '' ||
      formData.city === ''
    ) {
      setErrorText('*無效的輸入');
      return;
    }
    const reqData = _setAgentAccDataFormat(formData);
    setAccReq(reqData);
  };

  useEffect(() => {
    if (setAccData === 'SUCCESS') {
      onHide();
      sendAccRequest();
    }
  }, [setAccData, sendAccRequest, onHide]);

  return (
    <Modal
      style={{ padding: '1rem' }}
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">修改帳戶資訊</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicAccount">
            <Form.Label>收款帳號</Form.Label>
            <Form.Control
              type="account"
              placeholder=""
              defaultValue={getAccData && getAccData.P1}
              onChange={onChangeHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>收款姓名</Form.Label>
            <Form.Control
              type="name"
              placeholder=""
              defaultValue={getAccData && getAccData.P2}
              onChange={onChangeHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicBank">
            <Form.Label>開戶銀行</Form.Label>
            <Form.Control
              type="back"
              placeholder=""
              defaultValue={getAccData && getAccData.P3}
              onChange={onChangeHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCity">
            <Form.Label>所在省市</Form.Label>
            <Form.Control
              type="city"
              placeholder=""
              defaultValue={getAccData && getAccData.P4}
              onChange={onChangeHandler}
            />
          </Form.Group>

          {errorText && <Form.Text className="text-muted">{errorText}</Form.Text>}
          {setAccError && <Form.Text className="text-muted">{setAccError}</Form.Text>}

          <br />

          <Button block variant="primary" type="submit" disabled={setAccStatus === 'pending'}>
            {setAccStatus === 'pending' && (
              <>
                <Spinner animation="border" role="status"></Spinner>
                Loading...
              </>
            )}

            {setAccStatus !== 'pending' && '確定'}
          </Button>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default EditBankInfoForm;
