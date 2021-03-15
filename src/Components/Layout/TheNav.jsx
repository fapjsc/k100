import React from 'react';
import { Link } from 'react-router-dom';

import { Nav, Navbar } from 'react-bootstrap';
import style from './Header.module.scss';

const TheNav = props => {
    return (
        <>
            <Navbar bg="dark" expand="md" variant="dark" className={style.navBar}>
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
                        <Nav.Link onClick={props.logout} className={style.navLink}>
                            登出
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default TheNav;
