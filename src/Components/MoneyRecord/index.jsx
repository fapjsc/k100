import React, { Component } from 'react'
import './index.scss'

export default class MoneyRecord extends Component {

    state = {
        Avb_Balance: 0,
        Real_Balance: 0,
        tick: null,
        token: null
    }

    getBalance = async (token) => {
        if(!token) {
            return 
        }

        console.log('get balance')
        
        let headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('login_session', token)
    
            const balanceApi = '/j/ChkBalance.aspx'
    
            try {
                const res = await fetch(balanceApi, {
                    headers: headers
                })
                const resData = await res.json()
                const {Avb_Balance, Real_Balance} = resData.data
                
    
                this.setState({
                    Avb_Balance,
                    Real_Balance
                })
            } catch (error) {
                console.log(error)
            }
    }

    getTick = async (token) => {
        if(!token) {
            return
        }
        console.log('get tick')

        let headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('login_session', token)
    
            const updateTickApi = '/j/ChkUpdate.aspx'

    
            try {
                const res = await fetch(updateTickApi, {
                    headers
                })
                const resData = await res.json()
                const {UpdateTick: tick} = resData.data
                this.setState({
                    tick
                })

            } catch (error) {
                console.log(error)
            }
    }

    checkTick = async (token) => {
        if(!token) {
            return
        }
        console.log('check tick')

        const {tick} = this.state

        let headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('login_session', token)
    
            const updateTickApi = '/j/ChkUpdate.aspx'

    
            try {
                const res = await fetch(updateTickApi, {
                    headers
                })
                const resData = await res.json()
                const {UpdateTick: checkTick} = resData.data

                if(tick !== checkTick) {
                    this.getTick()
                }
                

            } catch (error) {
                console.log(error)
            }
    }

    

    

    componentDidMount() {
        const token = localStorage.getItem('token')
        if(token) {
            this.setState({
                token
            })

            this.getBalance(token)
            this.getTick(token)
    
    
            setInterval(() => {
                this.checkTick(token)
            }, 60000);
        }
    }

   


    render() {
        const {Avb_Balance, Real_Balance, token} = this.state
        return (
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="balance">
                                結餘：
                                <span className="usdt"></span>
                                <span className="c_green">USDT</span>
                                <span className="c_green fs_20">{Real_Balance}</span>
                            </div>
                            
                            <div className="balance pl_6">
                                可提：
                                <span className="usdt"></span>
                                <span className="c_green">USDT</span>
                                <span className="c_green fs_20">{Avb_Balance}</span>
                            </div>
                        </div>
                 </div>
                </div>
                <button onClick={() => this.getBalance(token)}>test balance api</button>
                <button onClick={() => this.getTick(token)}>Tick api</button>
            </section>
        )
    }
}
