import React, { Component } from 'react'

import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.scss'

export default class Header extends Component {

    logout = async () => {
        window.confirm('確定要登出嗎');

        const {token, history} = this.props
        localStorage.removeItem('token')
        history.replace('/login')

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('login_session', token)

        let logoutApi = '/j/logout.aspx';
        try {
             fetch(logoutApi, { headers })

        } catch (error) {
            console.log(error)
        }
      }


    render() {
        return (
            <header>
                <Nav defaultActiveKey="/home" as="ul" className="justify-content-end">
                    <Nav.Item as="li">
                        <Nav.Link href="/home">交易</Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link href="/home">紀錄</Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link href="/home/wallet">錢包</Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link onClick={this.logout}>登出</Nav.Link>
                    </Nav.Item>
                </Nav>
            </header>
        )
    }
}
