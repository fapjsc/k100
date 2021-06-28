import React, { Component } from 'react';

import style from './Header.module.scss';

export default class Header extends Component {
  render() {
    return (
      <div className="" style={{ backgroundColor: '#242e47 ' }}>
        <header className={style.header}>{this.props.children}</header>
      </div>
    );
  }
}
