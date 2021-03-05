import React, { Component } from 'react';

export default class index extends Component {
 

  logout = () => {
    localStorage.removeItem('token')
    this.props.history.replace('/login')
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    if(!token) {
      this.props.history.replace('/auth')
    }
  }

  render() {
    return (
      <div>
        <h1>登入成功</h1>
        <button onClick={this.logout}>登出</button>

      </div>
      ) 
  }
}
