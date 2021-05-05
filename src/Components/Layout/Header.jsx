import React, { Component } from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
import style from './Header.module.scss';

export default class Header extends Component {
  render() {
    return <header className={style.header}>{this.props.children}</header>;
  }
}
