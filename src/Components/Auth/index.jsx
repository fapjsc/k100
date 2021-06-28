import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import BaseCard from './../Ui/BaseCard';
import BaseDialog from './../Ui/BaseDialog';
import Header from '../Layout/Header';
import RegisterForm from './Register';
import LoginForm from './LoginForm';

import './index.scss';
import style from '../Layout/Header.module.scss';

const Auth = () => {
  const [formType, setFormType] = useState('登入帳號');

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth/login') setFormType('登入帳號');
    if (location.pathname === '/auth/register') setFormType('註冊帳號');
    // eslint-disable-next-line
  }, []);

  return (
    <div className="authBg" style={{}}>
      <Header>
        <div className={style.logo}></div>
      </Header>
      <div className="user-auth">
        <BaseCard className="">
          {
            <div>
              <h4 className="text-center font-weight-bold">{formType}</h4>

              <nav className="form-nav">
                <Link className={location.pathname === '/auth/login' ? 'isActive form-link' : 'form-link'} to="/auth/login" onClick={() => setFormType('登入帳號')}>
                  登入
                </Link>

                <Link
                  className={location.pathname === '/auth/register' || location.pathname === '/auth/register/valid' ? 'isActive form-link' : 'form-link'}
                  to="/auth/register"
                  onClick={() => setFormType('註冊帳號')}
                >
                  註冊
                </Link>
              </nav>

              {formType === '登入帳號' ? <LoginForm /> : formType === '註冊帳號' ? <RegisterForm /> : null}
            </div>
          }
        </BaseCard>
      </div>
    </div>
  );
};

export default Auth;
