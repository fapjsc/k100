import { useContext, useEffect, useState, Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Zmage from 'react-zmage'; // 圖片縮放
import Resizer from 'react-image-file-resizer'; // 圖片壓縮
// import { v4 as uuidv4 } from 'uuid';

import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';

// Context
import ChatContext from '../../context/chat/ChatContext';

// Style
import './TheChat.css';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

const TheChat = props => {
  // Router Props
  const match = useRouteMatch();

  // Init State
  const [userInput, setUserInput] = useState('');
  const [messagesEnd, setMessagesEnd] = useState(null);

  // Chat Context
  const chatContext = useContext(ChatContext);
  const {
    instantClient,
    client,
    instantMessages,
    messages,
    chatConnect,
    instantChat,
    setInstantMessages,
    setMessages,
  } = chatContext;

  // ===========
  //  function
  // ===========
  const handleChange = e => {
    setUserInput(e.target.value);
  };

  //點擊後發送訊息到server
  const sendMessage = (value, e) => {
    if (value === '') return;

    if (e.keyCode === 13 || e.target.id === 'sendIcon' || e.target.id === 'sendIcon1') {
      if (instantClient) {
        instantClient.send(
          JSON.stringify({
            Message_Type: 1,
            Message: value.toString(),
          })
        );
      }

      if (client) {
        client.send(
          JSON.stringify({
            Message_Type: 1,
            Message: value.toString(),
          })
        );
      }

      setUserInput('');
    }

    return;
  };

  const resizeFile = file =>
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

  const sendImg = async e => {
    try {
      const file = e.target.files[0]; // get image

      if (!file) {
        return;
      }

      const image = await resizeFile(file);

      if (instantClient) {
        instantClient.send(
          JSON.stringify({
            Message_Type: 2,
            Message: image,
          })
        );
      }

      if (client) {
        client.send(
          JSON.stringify({
            Message_Type: 2,
            Message: image,
          })
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    if (client) client.close();
    if (instantClient) instantClient.close();

    if (match.path.includes('instant')) instantChat(match.params.id);
    if (match.path.includes('transaction')) chatConnect(match.params.id);

    return () => {
      setMessages([]);
      setInstantMessages([]);
      if (client) client.close();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <>
      <div
        className="chatbox"
        style={{
          display: props.isChat ? 'block' : 'none',
        }}
      >
        {/* Chat Header */}
        <div className="top">
          {/* <p>客服中心</p>
          {/* <span /> */}
          <p className="mb-1" style={{ display: 'block' }}>
            訂單號：
          </p>
          <p className="">{props.hash}</p>
        </div>

        {instantClient ? (
          <>
            {/* Chat Body */}
            <div className="talk">
              {instantMessages.map((el, index) => {
                return (
                  <div className="mb-2" key={index}>
                    {/* CS  === 2 , instant === 3, */}
                    <div>
                      {/* messages */}
                      {el.Message_Type === 1 ? (
                        <>
                          {el.Message_Role === 2 && <Badge variant="danger">客服</Badge>}
                          <p
                            className={
                              el.Message_Role === 1 || el.Message_Role === 2 ? 'talk_l' : 'talk_r'
                            }
                          >
                            {el.Message}
                          </p>
                        </>
                      ) : (
                        <>
                          {el.Message_Role === 2 && (
                            <div>
                              <Badge variant="danger">客服</Badge>
                            </div>
                          )}

                          <PhotoProvider>
                            <PhotoConsumer key={index} src={el.Message}>
                              <img
                                style={{
                                  cursor: 'zoom-in',
                                }}
                                src={el.Message}
                                alt="send img"
                                className={
                                  el.Message_Role === 1 || el.Message_Role === 2
                                    ? 'talk_l'
                                    : 'talk_r'
                                }
                              />
                            </PhotoConsumer>
                          </PhotoProvider>

                          {/* <Zmage
                            zoom={true}
                            alt="send img"
                            src={el.Message}
                            className={
                              el.Message_Role === 1 || el.Message_Role === 2 ? 'talk_l' : 'talk_r'
                            }
                          /> */}
                        </>
                      )}

                      {/* 日期 */}
                      <div
                        className={
                          el.Message_Role === 1 || el.Message_Role === 2
                            ? 'talk_time'
                            : 'talk_time a_right'
                        }
                      >
                        {el.Sysdate.split(' ')
                          .splice(1, 1)
                          .join()
                          .split(':')
                          .splice(0, 2)
                          .join(':')}
                      </div>
                    </div>
                    <div
                      style={{ float: 'left', clear: 'both' }}
                      ref={el => {
                        setMessagesEnd(el);
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Chat Bottom */}
            <div className="bottom">
              <label className="attach-iconBox">
                <input
                  id="upload_img"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={e => sendImg(e)}
                />
                <div className="attach_icon" style={{ cursor: 'pointer' }} />
              </label>
              <div className="w_77">
                <input
                  className="easy-input talkbox"
                  type="text"
                  name="talk"
                  placeholder="對話......"
                  value={userInput}
                  onChange={handleChange}
                  onKeyUp={e => sendMessage(userInput, e)}
                />
              </div>
              <span
                id="sendIcon"
                style={{ cursor: 'pointer' }}
                className="send_icon"
                onClick={e => sendMessage(userInput, e)}
              />
            </div>
          </>
        ) : client ? (
          <>
            {/* Chat Body */}
            <div className="talk">
              {messages.map((el, index) => {
                return (
                  <div className="mb-2" key={index}>
                    {/* CS  === 2 , instant === 3, */}
                    <div>
                      {/* messages */}
                      {el.Message_Type === 1 ? (
                        <>
                          {el.Message_Role === 2 && <Badge variant="danger">客服</Badge>}
                          <p
                            className={
                              el.Message_Role === 2 || el.Message_Role === 3 ? 'talk_l' : 'talk_r'
                            }
                          >
                            {el.Message}
                          </p>
                        </>
                      ) : (
                        <>
                          {el.Message_Role === 2 && (
                            <div>
                              <Badge variant="danger">客服</Badge>
                            </div>
                          )}

                          {/* <Zmage
                            alt="send img"
                            src={el.Message}
                            className={
                              el.Message_Role === 3 || el.Message_Role === 2 ? 'talk_l' : 'talk_r'
                            }
                          /> */}

                          <PhotoProvider>
                            <PhotoConsumer key={index} src={el.Message}>
                              <img
                                src={el.Message}
                                alt="send img"
                                style={{
                                  cursor: 'zoom-in',
                                }}
                                className={
                                  el.Message_Role === 3 || el.Message_Role === 2
                                    ? 'talk_l'
                                    : 'talk_r'
                                }
                              />
                            </PhotoConsumer>
                          </PhotoProvider>
                        </>
                      )}

                      {/* 日期 */}
                      <div
                        className={
                          el.Message_Role === 3 || el.Message_Role === 2
                            ? 'talk_time'
                            : 'talk_time a_right'
                        }
                      >
                        {el.Sysdate.split(' ')
                          .splice(1, 1)
                          .join()
                          .split(':')
                          .splice(0, 2)
                          .join(':')}
                      </div>
                    </div>
                    <div
                      style={{ float: 'left', clear: 'both' }}
                      ref={el => {
                        setMessagesEnd(el);
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Chat Bottom */}
            <div className="bottom d-flex align-items-center">
              <label className="attach-iconBox mt-2">
                <input
                  id="upload_img"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={e => sendImg(e)}
                />
                <div className="attach_icon" style={{ cursor: 'pointer' }} />
              </label>
              <div className="w_77">
                <input
                  className="easy-input talkbox"
                  type="text"
                  name="talk"
                  placeholder="對話......"
                  value={userInput}
                  onChange={handleChange}
                  onKeyUp={e => sendMessage(userInput, e)}
                />
              </div>
              <span
                id="sendIcon1"
                style={{ cursor: 'pointer' }}
                className="send_icon"
                onClick={e => sendMessage(userInput, e)}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              marginTop: 200,
            }}
          >
            <Spinner animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default TheChat;
