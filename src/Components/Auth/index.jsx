import React, { Component } from 'react'
import { NavLink, Route, Switch, Redirect } from "react-router-dom";

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


    
    render() {
        return (
            <div className="user-auth">
                <BaseCard>
                    <h4 className="text-center p-4">{this.state.formState}</h4>

                    <nav className='form-nav'>
                        <NavLink className='form-link' to="/login" onClick={() => this.toggleForm('登入')}>登入</NavLink>
                        <NavLink className='form-link' to="/register" onClick={() => this.toggleForm('註冊')}>註冊</NavLink>
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
