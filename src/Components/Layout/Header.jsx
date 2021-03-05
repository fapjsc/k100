import React, { Component } from 'react'

import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.scss'

export default class Header extends Component {

    logout = () => {
        localStorage.removeItem('token')
        this.props.history.replace('/login')
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
                        <Nav.Link href="/home">錢包</Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link href="/home" onClick={this.logout}>登出</Nav.Link>
                    </Nav.Item>
                </Nav>
            </header>
        )
    }
}
