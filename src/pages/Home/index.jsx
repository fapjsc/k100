import React, { Component } from 'react';
import Header from '../../Components/Layout/Header'
import MoneyRecord from '../../Components/MoneyRecord'
import Overview from '../../Components/Overview'

export default class index extends Component {
 

  

  componentDidMount() {
    const token = localStorage.getItem('token')
    if(!token) {
      this.props.history.replace('/auth')
    }
  }

  render() {
    return  (
      <>
        <Header />
        <MoneyRecord />
        <Overview />
      </>
      )
  }
}
