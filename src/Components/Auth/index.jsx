import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import BaseCard from './../Ui/BaseCard';
import BaseDialog from './../Ui/BaseDialog';
import Header from '../Layout/Header';

// import LoginForm from './Login';
import RegisterForm from './Register';

import LoginForm from './LoginForm';

import ErrorModal from '../Ui/ErrorModal';

import BaseSpinner from '../Ui/BaseSpinner';
import './index.scss';
import style from '../Layout/Header.module.scss';

export default class Auth extends Component {
  state = {
    formState: '登入',
    token: null,
    isLoading: false,
    httpError: null,
    showModal: false,
    loginErr: '',
    showRegister: false,
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

  handleRegisterFrom = value => {
    this.setState({
      showRegister: value,
    });
  };

  setUserAuth = token => {
    if (token) {
      this.setState(
        {
          token,
        },
        () => {
          this.props.setAuth(token);
          this.props.history.replace('/home');
        }
      );
    }
  };

  setLoginErr = (showModal, err, status) => {
    this.setState({
      showModal: showModal,
      loginErr: err,
      status,
    });
  };

  setShow = value => {
    this.setState({
      showModal: value,
      loginErr: '',
    });
  };

  setLoadingState = isLoading => {
    this.setState({
      isLoading,
    });
  };

  setHttpError = (errTitle, errBody) => {
    const err = String(errBody);
    this.setState({
      httpError: {
        title: errTitle,
        body: err,
      },
    });
  };

  closeDialog = () => {
    this.setState({
      httpError: null,
    });
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    let curPath = window.location.hash;
    if (curPath === '#/auth/register') {
      this.setState({
        formState: '註冊',
      });
    } else if (curPath === '#/auth/login') {
      this.setState({
        formState: '登入',
      });
    }

    if (token) {
      this.setUserAuth(token);
    }
  }

  render() {
    const { formState, isLoading, httpError, showModal, loginErr, status } = this.state;
    const { location } = this.props;
    return (
      <div className="authBg" style={{}}>
        <Header>
          <div className={style.logo}></div>
        </Header>
        <div className="user-auth">
          <BaseCard className="" isLoading={isLoading}>
            {isLoading ? (
              <div className="mt_120">
                <BaseSpinner />
              </div>
            ) : !isLoading && showModal ? (
              // <Modal
              //   size="sm"
              //   show={showModal}
              //   onHide={() => this.setShow(false)}
              //   aria-labelledby="example-modal-sizes-title-sm"
              // >
              //   <Modal.Header closeButton>
              //     <Modal.Title id="example-modal-sizes-title-sm">{loginErr}</Modal.Title>
              //   </Modal.Header>
              // </Modal>
              <ErrorModal
                show={showModal}
                title={loginErr}
                status={status}
                onHide={() => this.setShow(false)}
              />
            ) : (
              <div>
                <h4 className="text-center font-weight-bold">{formState}帳號</h4>

                <nav className="form-nav">
                  <Link
                    className={
                      location.pathname === '/auth/login' ? 'isActive form-link' : 'form-link'
                    }
                    to="/auth/login"
                    onClick={() => this.toggleForm('登入')}
                  >
                    登入
                  </Link>

                  <Link
                    className={
                      location.pathname === '/auth/register' ||
                      location.pathname === '/auth/register/valid'
                        ? 'isActive form-link'
                        : 'form-link'
                    }
                    to="/auth/register"
                    onClick={() => this.toggleForm('註冊')}
                  >
                    註冊
                  </Link>
                </nav>

                {!!httpError ? (
                  <BaseDialog httpError={httpError} closeDialog={this.closeDialog} />
                ) : null}

                {/* 註冊路由 */}
                <Switch>
                  {/* <Route path="/auth/login" component={LoginForm} /> */}
                  <Route
                    path="/auth/login"
                    component={props => (
                      <LoginForm
                        {...props}
                        setUserAuth={this.setUserAuth}
                        setLoadingState={this.setLoadingState}
                        setHttpError={this.setHttpError}
                        setLoginErr={this.setLoginErr}
                      />
                    )}
                  />
                  <Route path="/auth/register" component={props => <RegisterForm {...props} />} />

                  <Redirect to="/auth/login" />
                </Switch>
              </div>
            )}
          </BaseCard>
        </div>
      </div>
    );
  }
}
