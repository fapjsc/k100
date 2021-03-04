import React, { Component } from 'react';
import './index.scss';

export default class BaseCard extends Component {
  render() {
    return <div className="base-card">{this.props.children}</div>;
  }
}
