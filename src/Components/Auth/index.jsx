import React, { Component } from 'react'
import { Link, Route, Switch, Redirect  } from "react-router-dom";

import BaseCard from './../Ui/BaseCard'
import LoginForm from './Login'
import RegisterForm from './Register'

import './index.scss'


export default class Auth extends Component {

    state = {
        formState: '登入'
    }

    toggleForm = mode => {
        let {formState} = this.state
        
        if(mode === '登入') {
            formState = '登入'
        } else if(mode === '註冊') {
            formState = '註冊'
        }
        this.setState({
            formState
        })
    }

    componentDidMount() {
        let curPath = window.location.pathname
       if(curPath === '/register') {
           this.setState({
               formState: '註冊'
           })
       } else if (curPath === '/login') {
           this.setState({
               formState: '登入'
           })
       }
    }
    
    render() {
        const {formState} = this.state
        return (
            <div className="user-auth">
                <BaseCard>
                    <h4 className="text-center p-4 font-weight-bold">{formState}帳號</h4>

                    <nav className='form-nav'>
                        <Link  className={ formState === '登入' ? 'isActive form-link' : 'form-link'} to="/login" onClick={() => this.toggleForm('登入')}>登入</Link>
                        <Link  className={ formState === '註冊' ? 'isActive form-link' : 'form-link'}  to="/register" onClick={() => this.toggleForm('註冊')}>註冊</Link>
                    </nav>

                    {/* 註冊路由 */}
                    <Switch>
                        <Route path="/login" component={LoginForm} />
                        <Route path="/register" component={RegisterForm} />
                        <Redirect to="/login" />
                    </Switch>
                </BaseCard>
            </div>
        )
    }
}
