import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import BaseCard from './../Ui/BaseCard';
import BaseDialog from './../Ui/BaseDialog';
import Header from '../Layout/Header';

import LoginForm from './Login';
import RegisterForm from './Register';

import BaseSpinner from '../Ui/BaseSpinner';
import './index.scss';
import style from '../Layout/Header.module.scss';

export default class Auth extends Component {
    state = {
        formState: '登入',
        token: null,
        isLoading: false,
        httpError: null,
    };

    toggleForm = mode => {
        let { formState } = this.state;
        console.log('toggleForm');

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
        console.log('set user auth');
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

    setLoadingState = isLoading => {
        console.log('setLoadingState');

        this.setState({
            isLoading,
        });
    };

    setHttpError = (errTitle, errBody) => {
        console.log('setHttpError');

        const err = String(errBody);
        this.setState({
            httpError: {
                title: errTitle,
                body: err,
            },
        });
    };

    closeDialog = () => {
        console.log('closeDialog');

        this.setState({
            httpError: null,
        });
    };

    componentDidMount() {
        console.log('auth component did mount');
        const token = localStorage.getItem('token');
        let curPath = window.location.hash;
        if (curPath === '#/auth/register') {
            console.log('register');
            this.setState({
                formState: '註冊',
            });
        } else if (curPath === '#/auth/login') {
            console.log('login');
            this.setState({
                formState: '登入',
            });
        }

        if (token) {
            this.setUserAuth(token);
        }
    }

    render() {
        const { formState, isLoading, httpError } = this.state;
        const { location } = this.props;
        return (
            <div className="user-auth">
                <Header>
                    <div className={style.logo}></div>
                </Header>
                <BaseCard isLoading={isLoading}>
                    {isLoading ? (
                        <div className="mt_120">
                            <BaseSpinner />
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-center p-4 font-weight-bold">{formState}帳號</h4>

                            <nav className="form-nav">
                                <Link
                                    className={
                                        location.pathname === '/auth/login'
                                            ? 'isActive form-link'
                                            : 'form-link'
                                    }
                                    to="/auth/login"
                                    onClick={() => this.toggleForm('登入')}
                                >
                                    登入
                                </Link>

                                <Link
                                    className={
                                        location.pathname === '/auth/register'
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
                                        />
                                    )}
                                />
                                <Route path="/auth/register" component={RegisterForm} />
                                <Redirect to="/auth/login" />
                            </Switch>
                        </div>
                    )}
                </BaseCard>
            </div>
        );
    }
}
