import React, { Component } from 'react';
import { Link } from "react-router-dom";


import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

export default class LoginForm extends Component {
  state = {
    phoneNumber: '',
    password: '',
    error: '',
    isLoading: false
  };

  // 保存使用者輸入的手機號碼到state
  setPhoneNumber = event => {
    this.setState({
      phoneNumber: event.target.value,
    });
  };

  // 保存使用者輸入的密碼到state
  setPassword = event => {
    this.setState({
      password: event.target.value,
    });
  };

  // 表單提交
  handleLoginSubmit =  async (event) => {
    event.preventDefault(); //防止表單提交
    const { phoneNumber, password } = this.state;
    
    let loginApi = '/j/login.aspx'

    try {
      const res = await fetch(loginApi, {
        method: "POST",
        body: JSON.stringify({
          Login_countrycode: 86,
          Login_tel: phoneNumber,
          Login_pwd: password
        })
      })

      const resData = await res.json()
      console.log(resData)
      
    } catch (error) {
      console.log(error)
    }

    


      
   




  
    

    
  };

  render() {
    return (
      <div className="form-container">
          <Form>
          <Form.Control as="select" defaultValue="區號" className="form-input">
            <option>區號</option>
            <option>台灣  ＋886</option>
            <option>中國  ＋86</option>
            <option>香港  ＋852</option>
          </Form.Control>


            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Control
                className="form-input"
                size="lg"
                type="tel"
                placeholder="電話號碼"
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
                placeholder="密碼"
                onChange={this.setPassword}
              />

            </Form.Group>

            <Button
              onClick={this.handleLoginSubmit}
              className="form-btn"
              variant="primary"
              block
              type="submit"
            >
              登入
            </Button>
            <div className="forget_pw-box">
              <Link to="/forget-pw" className="forget_pw-link">
              <span className="forget_pw"></span>
                忘記密碼
              </Link>
            </div>
          </Form>
      </div>
    );
  }
}
