import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default class LoginForm extends Component {
  render() {
    return (
      <div>
        <h4 className="text-center p-4">登入帳號</h4>
        <Form>
          <Form.Group controlId="formBasicPhoneNumber">
            <Form.Control
              className="form-input"
              size="lg"
              type="tel"
              placeholder="手機號碼"
            />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="form-input"
              size="lg"
              type="password"
              placeholder="密碼"
            />
          </Form.Group>

          <Button className="form-btn" variant="primary" block type="submit">
            登入
          </Button>
        </Form>
      </div>
    );
  }
}
