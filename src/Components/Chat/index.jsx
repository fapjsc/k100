import React from 'react';
import { w3cwebsocket as W3CWebsocket } from 'websocket';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FormControl, Form } from 'react-bootstrap';
import './index.scss';

class Chat extends React.Component {
    state = {
        client: {},
        messages: [],
        userInput: '',
        orderToken: '',
    };

    setInput = e => {
        this.setState({
            userInput: e.target.value,
        });
    };

    // 2.點擊後發送訊息到server
    sendMessage = value => {
        // send message to server
        this.state.client.send(
            JSON.stringify({
                Message_Type: 1,
                Message: value.toString(),
            })
        );

        this.setState({
            userInput: '',
        });

        // this.setState({
        //     searchVal: '',
        // });
    };

    componentDidMount() {
        this.setState({
            orderToken: this.props.match.params.id,
        });
        this.chatConnect(this.props.match.params.id);
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        // this.closeWebSocket(this.state.client);
    }

    // Chat WebSocket
    chatConnect = token => {
        const loginSession = localStorage.getItem('token');
        const chatApi = `chat/WS_ChatOrder.ashx`;

        // 自動重連次數
        // const options = {
        //     maxRetries: null,
        // };

        let url;

        if (window.location.protocol === 'http:') {
            url = `ws://10.168.192.1/${chatApi}?login_session=${loginSession}&order_token=${token}`;
        } else {
            url = `wss://k100u.com/${chatApi}?login_session=${loginSession}&order_token=${token}`;
        }

        const client = new W3CWebsocket(url);
        this.setState({
            client,
        });

        // 1.建立連接
        client.onopen = message => {
            console.log('Chat room client connected');
        };

        // 2.收到server回復
        client.onmessage = message => {
            const dataFromServer = JSON.parse(message.data);
            // console.log('got Chat reply!', dataFromServer);

            if (Array.isArray(dataFromServer)) {
                let newArr = dataFromServer.reverse();
                this.setState(state => ({
                    messages: [...newArr],
                }));
            } else {
                this.setState(state => ({
                    messages: [...state.messages, dataFromServer],
                }));
            }

            // if (dataFromServer.Message_Type === 1) {
            //     console.log('hi==========');
            //     let messageObj = {
            //         msg: dataFromServer.Message,
            //         user: dataFromServer.Message_Role,
            //     };

            //     let messageArray = [...messages, messageObj];

            //     setMessage(messageArray);
            // }
        };

        // 3.錯誤處理
        client.onclose = () => {
            console.log('關閉連線');
        };

        client.onclose = function (message) {};
    };

    // 關閉連線
    closeWebSocket = () => {
        const { orderToken: token } = this.state;
        const loginSession = localStorage.getItem('token');
        const chatApi = `chat/WS_ChatOrder.ashx`;

        // 自動重連次數
        // const options = {
        //     maxRetries: null,
        // };

        let url;

        if (window.location.protocol === 'http:') {
            url = `ws://10.168.192.1/${chatApi}?login_session=${loginSession}&order_token=${token}`;
        } else {
            url = `wss://k100u.com/${chatApi}?login_session=${loginSession}&order_token=${token}`;
        }

        const client = new W3CWebsocket(url);

        if (client) {
            client.close();
        } else {
            console.log('沒有webSocket Client');
        }
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    };

    render() {
        const { messages } = this.state;
        return (
            <>
                <div className="mainChat">
                    {/* title */}
                    <p
                        type="secondary"
                        style={{ fontSize: '1.5rem', color: 'blue' }}
                        className="text-center mb-3"
                    >
                        幫助中心
                    </p>
                    {/* message block */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        className="chatBlock  pre-scrollable"
                    >
                        {messages.map(message => (
                            <Card
                                key={message.Message}
                                className="text-center"
                                style={{
                                    width: 120,
                                    margin: '16px 0 0 0',
                                    backgroundColor:
                                        message.Message_Role === 1 ? '#f5d2be' : '#d9ffba',
                                    alignSelf:
                                        message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Card.Body>
                                    <Card.Text>{message.Message}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        <div
                            style={{ float: 'left', clear: 'both' }}
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                        ></div>
                    </div>

                    {/* 輸入訊息 */}
                    <Form inline className="mb-3 bottom">
                        <FormControl
                            type="text"
                            placeholder=""
                            className="mr-sm-2"
                            onChange={this.setInput}
                        />
                        <Button
                            onClick={() => this.sendMessage(this.state.userInput)}
                            variant="outline-success"
                        >
                            發送
                        </Button>
                    </Form>
                    {/* </InputGroup> */}
                </div>
            </>
        );
    }
}

export default Chat;
