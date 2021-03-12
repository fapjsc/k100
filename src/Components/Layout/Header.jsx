import React, { Component, Fragments } from 'react';
import { Link } from 'react-router-dom';

import { Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './Header.module.scss';

export default class Header extends Component {
    logout = async () => {
        window.confirm('確定要登出嗎');

        const { token, history } = this.props;
        localStorage.removeItem('token');
        history.replace('/login');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('login_session', token);

        let logoutApi = '/j/logout.aspx';
        try {
            fetch(logoutApi, { headers });
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <header>
                <Navbar bg="dark" expand="md" variant="dark" className={style.navBar}>
                    <Link to="/home">
                        <div className={style.logo}></div>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className={style.navList}>
                            <Link to="/home" className={style.navLink}>
                                交易
                            </Link>
                            <Link to="/home/history" className={style.navLink}>
                                紀錄
                            </Link>
                            <Link to="/home/wallet" className={style.navLink}>
                                錢包
                            </Link>
                            <Nav.Link onClick={this.logout} className={style.navLink}>
                                登出
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        );
    }
}
