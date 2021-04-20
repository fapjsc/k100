import React from 'react';
import { Fragment, useState, useEffect } from 'react';

import { w3cwebsocket as W3CWebsocket } from 'websocket';
import { v4 as uuidv4 } from 'uuid';

// 圖片縮放
import Zmage from 'react-zmage';

// 圖片壓縮
import Resizer from 'react-image-file-resizer';

// RWD
import { useMediaQuery } from 'react-responsive';

import SendIcon from '../../Assets/send_icon.png';
import AttachIcon from '../../Assets/attach_icon.png';

import Card from 'react-bootstrap/Card';
import './index.scss';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  return isDesktop ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 1200 });
  return isMobile ? children : null;
};

const Chat = () =>  {
  state = {
    client: {},
    messages: [],
    userInput: '',
    orderToken: '',
    img: '',
  };

  const [client, setClient] = useState({})
  const [messages, setMessage] = useState([])
  const [userInput, setUserInput] = useState('')
  const [orderToken, setOrderToken] = useState(null)
  const [img, setImg] = useState('')


  cont setInput = e => {
    setUserInput(e.target.value)
    // this.setState({
    //   userInput: e.target.value,
    // });
  };

  //點擊後發送訊息到server
  sendMessage = (value, e) => {
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

  resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        uri => {
          resolve(uri);
        },
        'base64'
      );
    });

  sendImg = async e => {
    try {
      const file = e.target.files[0]; // get image

      if (!file) {
        return;
      }

      const image = await this.resizeFile(file);

      this.state.client.send(
        JSON.stringify({
          Message_Type: 2,
          Message: image,
        })
      );
    } catch (error) {
      alert(error);
    }
  };

  componentDidMount() {
    if (this.props.orderToken) {
      this.setState({
        orderToken: this.props.orderToken,
      });
      this.chatConnect(this.props.orderToken);
    } else {
      this.setState({
        orderToken: this.props.match.params.id,
      });
      this.chatConnect(this.props.match.params.id);
    }

    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    // this.closeWebSocket();
    console.log('unmount');
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
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${chatApi}?login_session=${loginSession}&order_token=${token}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${chatApi}?login_session=${loginSession}&order_token=${token}`;
    }

    const client = new W3CWebsocket(url);
    this.setState({
      client,
    });

    // 1.建立連接
    client.onopen = message => {};

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
      console.log('聊天室關閉');
      client.onopen();
    };
  };

  // 關閉連線
  closeWebSocket = () => {
    console.log('close chart');
    const { orderToken: token } = this.state;
    const loginSession = localStorage.getItem('token');
    const chatApi = `chat/WS_ChatOrder.ashx`;

    // 自動重連次數
    // const options = {
    //     maxRetries: null,
    // };

    let url;

    if (window.location.protocol === 'http:') {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}/${chatApi}?login_session=${loginSession}&order_token=${token}`;
    } else {
      url = `${process.env.REACT_APP_WEBSOCKET_URL_DOMAIN}/${chatApi}?login_session=${loginSession}&order_token=${token}`;
    }

    const client = new W3CWebsocket(url);

    if (client) {
      client.close();
    } else {
      // console.log('沒有webSocket Client');
    }
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const { messages, userInput } = this.state;
    return (
      <>
        <Desktop>
          <div className="chatContainer">
            <div
              className="mainChat"
              style={{
                display: this.props.isChat ? 'block' : 'none',
                opacity: this.props.isChat ? 1 : 0,
              }}
            >
              {/* title */}
              <div className="mb-3 chatTitle">
                <span>訂單號：</span>
                <span>{this.props.Tx_HASH}</span>
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
                  <Fragment key={uuidv4()}>
                    <Card
                      className="text-center"
                      style={{
                        width: 100,
                        margin: '16px 5px 0 5px',
                        backgroundColor: message.Message_Role === 1 ? '#F6F6F6' : '#D7E2F3',
                        alignSelf: message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                        border: 'none',
                      }}
                    >
                      {message.Message_Type === 1 ? (
                        <Card.Title className="p-4 text-left">{message.Message}</Card.Title>
                      ) : (
                        <Zmage alt="send img" src={message.Message} key={uuidv4()} />
                      )}
                    </Card>
                    <p
                      style={{
                        padding: '1rem',
                        alignSelf: message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {message.Sysdate.split(' ')
                        .splice(1, 1)
                        .join()
                        .split(':')
                        .splice(0, 2)
                        .join(':')}
                    </p>
                  </Fragment>
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
          </div>
        </Desktop>

        {/* mobile */}
        <Mobile>
          <div className="chatContainerMobile">
            <div
              className="mainChat"
              style={{
                display: this.props.isChat ? 'block' : 'none',
                opacity: this.props.isChat ? 1 : 0,
              }}
            >
              {/* title */}
              <div className="mb-3 chatTitle">
                <span>訂單號：</span>
                <span>{this.props.Tx_HASH}</span>
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
                  <Fragment key={uuidv4()}>
                    <Card
                      className="text-center"
                      style={{
                        width: 100,
                        margin: '16px 5px 0 5px',
                        backgroundColor: message.Message_Role === 1 ? '#F6F6F6' : '#D7E2F3',
                        alignSelf: message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                        border: 'none',
                      }}
                    >
                      {message.Message_Type === 1 ? (
                        <Card.Title className="p-4 text-left">{message.Message}</Card.Title>
                      ) : (
                        <Zmage alt="send img" src={message.Message} key={uuidv4()} />
                      )}
                    </Card>
                    <p
                      style={{
                        padding: '1rem',
                        alignSelf: message.Message_Role === 1 ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {message.Sysdate.split(' ')
                        .splice(1, 1)
                        .join()
                        .split(':')
                        .splice(0, 2)
                        .join(':')}
                    </p>
                  </Fragment>
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
          </div>
        </Mobile>
      </>
    );
  }
}

export default Chat;
