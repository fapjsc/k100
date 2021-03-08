import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Nav } from 'react-bootstrap';
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
                <Link to="/home">
                    <div className={style.logo}></div>
                </Link>
                <Nav defaultActiveKey="/home" as="ul" className={style.navList}>
                    <Nav.Item as="li" className={style.navItem}>
                        <Nav.Link className={style.navLink} href="/home">
                            交易
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link className={style.navLink} href="/home">
                            紀錄
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link className={style.navLink} href="/home/wallet">
                            錢包
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                        <Nav.Link className={style.navLink} onClick={this.logout}>
                            登出
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* <Navbar collapseOnSelect expand="sm" className={style.navBar}>
                    <Navbar.Brand href="#home">
                        <div className={style.logo}></div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className={style.navList}>
                            <Nav.Link href="#features" className={style.navLink}>
                                交易
                            </Nav.Link>
                            <Nav.Link href="#pricing" className={style.navLink}>
                                紀錄
                            </Nav.Link>
                            <Nav.Link href="#pricing" className={style.navLink}>
                                錢包
                            </Nav.Link>
                            <Nav.Link href="#pricing" className={style.navLink}>
                                登出
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar> */}
            </header>
        );
    }
}
