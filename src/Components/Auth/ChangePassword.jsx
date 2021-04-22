import { useState, useEffect, useContext } from 'react';

import AuthContext from '../../context/auth/AuthContext';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import validator from 'validator';

const ChangePassword = () => {
  const authContext = useContext(AuthContext);
  const { changePw } = authContext;

  const [formData, setFormData] = useState({
    oldPw: {
      val: '',
      isValid: true,
      error: '',
    },
    newPw: {
      val: '',
      isValid: true,
      error: '',
    },
    confirmPw: {
      val: '',
      isValid: true,
      error: '',
    },
    formIsValid: false,
  });

  const { oldPw, newPw, confirmPw, formIsValid } = formData;

  useEffect(() => {
    if (formIsValid) {
      const data = {
        oldPw: oldPw.val,
        newPw: newPw.val,
      };
      changePw(data);
    } else {
      console.log('faild');
    }
  }, [formIsValid]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: {
        val: e.target.value,
        isValid: true,
        error: '',
      },
    });
  };

  const validForm = () => {
    setFormData({
      ...formData,
      formIsValid: true,
    });

    if (oldPw.val === '' || !validator.isAlphanumeric(oldPw.val) || oldPw.val.length < 6) {
      setFormData({
        ...formData,
        oldPw: {
          val: '',
          isValid: false,
          error: '密碼只能是英文及數字，且至少六位數',
        },
        formIsValid: false,
      });
    }

    if (newPw.val === '' || !validator.isAlphanumeric(newPw.val) || newPw.val.length < 6) {
      setFormData({
        ...formData,
        oldPw: {
          val: '',
          isValid: false,
          error: '密碼只能是英文及數字，且至少六位數',
        },
        formIsValid: false,
      });
    }

    if (newPw.val !== confirmPw.val) {
      setFormData({
        ...formData,
        confirmPw: {
          val: confirmPw.val,
          isValid: false,
          error: '新密碼輸入不一致',
        },
        formIsValid: false,
      });
    }
  };

  const formSubmit = e => {
    e.preventDefault();
    validForm();
  };

  return (
    <Container className="">
      <Card
        body
        className="mt_120 mx-auto p_sm"
        style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '500px' }}
      >
        <h1 className="text-center mb-4">更換密碼</h1>
        <Form onSubmit={formSubmit}>
          <Form.Row className="mb-4">
            <Form.Group as={Col} controlId="oldPassword">
              <Form.Label className="txt_12">請輸入舊密碼</Form.Label>
              <Form.Control
                className="utileInput"
                type="password"
                placeholder="請輸入舊密碼"
                name="oldPw"
                onChange={handleChange}
              />

              {oldPw.error && (
                <Form.Text style={{ fontSize: 12 }} className="text-muted">
                  *{oldPw.error}
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="mb-4">
            <Form.Group as={Col} controlId="newPassword" name="new">
              <Form.Label className="txt_12">重設密碼</Form.Label>
              <Form.Control
                className="utileInput"
                type="password"
                placeholder="重設密碼"
                name="newPw"
                onChange={handleChange}
              />
              {newPw.error && (
                <Form.Text style={{ fontSize: 12 }} className="text-muted">
                  *{oldPw.error}
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="mb-4">
            <Form.Group as={Col} controlId="confirmPassword" name="confirm">
              <Form.Label className="txt_12">確認密碼</Form.Label>
              <Form.Control
                className="utileInput"
                type="password"
                placeholder="確認密碼"
                name="confirmPw"
                onChange={handleChange}
              />
              {confirmPw.error && (
                <Form.Text style={{ fontSize: 12 }} className="text-muted">
                  *{confirmPw.error}
                </Form.Text>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row className="justify-content-center align-items-center">
            <Form.Group className="mb-0 mw400 px-0" as={Col}>
              <button className="easy-btn w-100" type="submit">
                確定
              </button>
            </Form.Group>
          </Form.Row>
        </Form>
      </Card>
    </Container>
  );
};

export default ChangePassword;
