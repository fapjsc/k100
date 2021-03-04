import React, { Component } from 'react';

import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

export default class index extends Component {

  state = {
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    error: '',
    isLoading: false

  }

  setPhoneNumber = event => {
    this.setState({
      phoneNumber: event.target.value
    })
  }

  setPassword = event => {
    this.setState({
      password: event.target.value
    })
  }

  setConfirmPassword = event => {
    this.setState({
      confirmPassword: event.target.value
    })
  }


  handleRegisterSubmit = async (event) => {
    event.preventDefault(); //防止表單提交
  }

  render() {
    return <div className="form-container">
    <Form>
      <Form.Group controlId="formBasicPhoneNumber">
        <Form.Control
          className="form-input"
          size="lg"
          type="tel"
          placeholder="手機號碼"
          onChange={this.setPhoneNumber}
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
          placeholder="設置密碼"
          onChange={this.setPassword}
        />
      </Form.Group>

      <Form.Group controlId="formConfirmPassword">
        <Form.Control
          className="form-input"
          size="lg"
          type="password"
          placeholder="確認密碼"
          onChange={this.setConfirmPassword}
        />
      </Form.Group>

      <Form.Group controlId="formBasicCheckbox" className="user-agreement">
        <Form.Check className="user-agreement__check" type="checkbox" label='我已閱讀並同意' /> 
        <span>{`《用戶協議》`}</span>
      </Form.Group>


      <Button
        onClick={this.handleLoginSubmit}
        className="form-btn"
        variant="primary"
        block
        type="submit"
      >
        註冊
      </Button>
     
    </Form>
</div>
  }
}
