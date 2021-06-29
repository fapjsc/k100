import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Lang Context
import { useI18n } from '../../lang';

// Components
import BaseCard from './../Ui/BaseCard';
import BaseDialog from './../Ui/BaseDialog';
import Header from '../Layout/Header';
import RegisterForm from './Register';
import LoginForm from './LoginForm';

// Style
import './index.scss';
import style from '../Layout/Header.module.scss';

const Auth = () => {
  // Lang Context
  const { t } = useI18n();

  // Init State
  const [formType, setFormType] = useState(t('auth_login'));

  // Router Props
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth/login') setFormType(t('auth_login'));
    if (location.pathname === '/auth/register') setFormType(t('auth_register'));
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
                <Link className={location.pathname === '/auth/login' ? 'isActive form-link' : 'form-link'} to="/auth/login" onClick={() => setFormType(t('auth_login'))}>
                  {t('auth_nav_login')}
                </Link>

                <Link
                  className={location.pathname === '/auth/register' || location.pathname === '/auth/register/valid' ? 'isActive form-link' : 'form-link'}
                  to="/auth/register"
                  onClick={() => setFormType(t('auth_register'))}
                >
                  {t('auth_nav_register')}
                </Link>
              </nav>

              {formType === t('auth_login') ? <LoginForm /> : formType === t('auth_register') ? <RegisterForm /> : null}
            </div>
          }
        </BaseCard>
      </div>
    </div>
  );
};

export default Auth;
