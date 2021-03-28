import React from 'react';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import { v4 as uuidv4 } from 'uuid';
import Zmage from 'react-zmage';

import SendIcon from '../../Assets/send_icon.png';
import AttachIcon from '../../Assets/attach_icon.png';

import Card from 'react-bootstrap/Card';

import './index.scss';

class Chat extends React.Component {
    state = {
        client: {},
        messages: [],
        userInput: '',
        orderToken: '',
        img: '',
    };

    setInput = e => {
        this.setState({
            userInput: e.target.value,
        });
    };

    // 2.點擊後發送訊息到server
    sendMessage = (value, e) => {
        console.log(value, typeof e.keyCode);
        if (value === '') {
            return;
        }

        if (e.keyCode === 13 || e.keyCode === undefined) {
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
        } else {
            return;
        }
    };

    sendImg = e => {
        console.log(e.target.files[0]);
        const file = e.target.files[0];
        const fileReader = new FileReader(); // FileReader為瀏覽器內建類別，用途為讀取瀏覽器選中的檔案
        fileReader.addEventListener('load', this.fileLoad);
        fileReader.readAsDataURL(file); // 讀取完檔案後，變成URL

        e.target.value = '';
    };

    fileLoad = e => {
        this.setState(
            {
                img: e.target.result, // 讀取到DataURL後，儲存在result裡面，指定為img
            },
            () => {
                // send img to server
                this.state.client.send(
                    JSON.stringify({
                        Message_Type: 2,
                        Message: e.target.result,
                    })
                );
            }
        );
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
            console.log('got Chat reply!', dataFromServer);

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
        const { messages, userInput, orderToken } = this.state;
        return (
            <>
                <div
                    className="mainChat"
                    style={{
                        display: this.props.isChat ? 'none' : 'block',
                        // display: 'none',
                    }}
                >
                    {/* title */}
                    <div className="mb-3 chatTitle">
                        <span>訂單號：</span>
                        <span>{orderToken}</span>
                    </div>

                    {/* message block */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        className="chatBlock  pre-scrollable"
                    >
                        {messages.map(message => (
                            <>
                                <Card
                                    key={uuidv4()}
                                    className="text-center"
                                    style={{
                                        width: 100,
                                        margin: '16px 5px 0 5px',
                                        backgroundColor:
                                            message.Message_Role === 1 ? '#F6F6F6' : '#D7E2F3',
                                        alignSelf:
                                            message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                                        border: 'none',
                                    }}
                                >
                                    {message.Message_Type === 1 ? (
                                        <Card.Title className="p-4 text-left">
                                            {message.Message}
                                        </Card.Title>
                                    ) : (
                                        <Zmage
                                            alt="send img"
                                            src={message.Message}
                                            key={uuidv4()}
                                        />
                                    )}
                                </Card>
                                <p
                                    style={{
                                        padding: '1rem',
                                        alignSelf:
                                            message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {message.Sysdate.split(' ')
                                        .splice(1, 1)
                                        .join()
                                        .split(':')
                                        .splice(0, 2)
                                        .join(':')}
                                </p>
                            </>
                        ))}
                        <div
                            style={{ float: 'left', clear: 'both' }}
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                        ></div>
                    </div>

                    {/* 輸入訊息 */}
                    <div className="bottom">
                        {/* 圖片上傳 */}
                        <label className="attach-iconBox">
                            <input
                                id="upload_img"
                                style={{ display: 'none' }}
                                type="file"
                                onChange={e => this.sendImg(e)}
                            />
                            <img src={AttachIcon} className="attach-icon" alt="attach" />
                        </label>

                        <input
                            placeholder="對話......"
                            className="userInput"
                            onChange={this.setInput}
                            onKeyUp={e => this.sendMessage(userInput, e)}
                            value={userInput}
                        />
                        <img
                            src={SendIcon}
                            alt="send message icon"
                            className="send-icon"
                            onClick={e => this.sendMessage(userInput, e)}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default Chat;
