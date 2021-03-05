import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import BaseCard from './../Ui/BaseCard';
import LoginForm from './Login';
import RegisterForm from './Register';

import './index.scss';

export default class Auth extends Component {
  state = {
    formState: '登入',
    isAuthenticated: true,
    token: null
  };

  toggleForm = mode => {
    let { formState } = this.state;

    if (mode === '登入') {
      formState = '登入';
    } else if (mode === '註冊') {
      formState = '註冊';
    }
    this.setState({
      formState,
    });
  };

  setUserAuth = token => {
    if(token) {
      this.setState({
        isAuthenticated: true
      })
      this.props.history.replace('/home')
    }
  }

  componentDidMount() {
    let curPath = window.location.pathname;
    if (curPath === '/register') {
      this.setState({
        formState: '註冊',
      });
    } else if (curPath === '/login') {
      this.setState({
        formState: '登入',
      });
    }

    const token = localStorage.getItem('token')
    console.log(token)
    if(token) {
      this.props.history.replace('/home')
    }
  }

  render() {
    const { formState } = this.state;
    return (
      <div className="user-auth">
        <BaseCard>
          <h4 className="text-center p-4 font-weight-bold">{formState}帳號</h4>

          <nav className="form-nav">
            <Link
              className={
                formState === '登入' ? 'isActive form-link' : 'form-link'
              }
              to="/auth/login"
              onClick={() => this.toggleForm('登入')}
            >
              登入
            </Link>

            <Link
              className={
                formState === '註冊' ? 'isActive form-link' : 'form-link'
              }
              to="/auth/register"
              onClick={() => this.toggleForm('註冊')}
            >
              註冊
            </Link>
          </nav>

          {/* 註冊路由 */}
          <Switch>
            {/* <Route path="/auth/login" component={LoginForm} /> */}
            <Route path="/auth/login" component={(props) => <LoginForm {...props} setUserAuth={this.setUserAuth} />} />
            <Route path="/auth/register" component={RegisterForm} />
            <Redirect to="/auth/login" />
          </Switch>
        </BaseCard>
      </div>
    );
  }
}
