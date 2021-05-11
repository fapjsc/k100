import { useEffect, useContext, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Zmage from 'react-zmage'; // 圖片縮放
import Resizer from 'react-image-file-resizer'; // 圖片壓縮
import { v4 as uuidv4 } from 'uuid';

// Context
import ChatContext from '../../context/chat/ChatContext';

// Style
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageGroup,
  Message,
  MessageInput,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react';

import './chat.scss';

const TheChat = props => {
  // Init State
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat Context
  const chatContext = useContext(ChatContext);
  const { chatConnect, closeWebSocket, messages, setOrderToken, orderToken, client } = chatContext;

  // Router Props
  const match = useRouteMatch();

  useEffect(() => {
    const orderToken = match.params.id;
    if (orderToken) {
      setOrderToken(orderToken);
    }

    return closeWebSocket(orderToken);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (orderToken) chatConnect(orderToken);

    //eslint-disable-next-line
  }, [orderToken]);

  //點擊後發送訊息到server
  const sendMessage = (value, e) => {
    if (value === '') {
      return;
    }

    client.send(
      JSON.stringify({
        Message_Type: 1,
        Message: value.toString(),
      })
    );

    setInputValue('');
  };

  // Send Img
  const sendImg = async e => {
    try {
      const file = e.target.files[0]; // get image

      if (!file) {
        return;
      }

      const image = await resizeFile(file);

      client.send(
        JSON.stringify({
          Message_Type: 2,
          Message: image,
        })
      );
    } catch (error) {
      alert(error);
    }
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

  return (
    <div
      className="mainChat"
      style={{
        display: props.isChat ? 'block' : 'none',
      }}
    >
      <MainContainer>
        <ChatContainer>
          <ConversationHeader className="chatTitle">
            <ConversationHeader.Content className="" userName="訂單號：" info={props.Tx_HASH} />
          </ConversationHeader>
          <MessageList>
            {messages.map(item => {
              if (item.Message_Type === 1) {
                // 文字
                return (
                  <>
                    <MessageGroup
                      key={uuidv4()}
                      direction={item.Message_Role === 2 ? 'incoming' : 'outgoing'}
                    >
                      <MessageGroup.Messages>
                        <Message
                          model={{
                            message: item.Message,
                          }}
                        />
                        <MessageGroup.Footer
                          className={
                            item.Message_Role === 2
                              ? 'justify-content-start px-2'
                              : 'justify-content-end px-2'
                          }
                        >
                          {item.Sysdate.split(' ')
                            .splice(1, 1)
                            .join()
                            .split(':')
                            .splice(0, 2)
                            .join(':')}
                        </MessageGroup.Footer>
                      </MessageGroup.Messages>
                    </MessageGroup>
                    <br />
                  </>
                );
              } else {
                return (
                  // 圖片
                  <>
                    <MessageGroup
                      key={uuidv4()}
                      direction={item.Message_Role === 2 ? 'incoming' : 'outgoing'}
                    >
                      <MessageGroup.Messages>
                        <Message
                          type="image"
                          model={{
                            payload: {
                              src: item.Message,
                              alt: 'images',
                              width: '230px',
                            },
                          }}
                        ></Message>

                        <MessageGroup.Footer
                          className={
                            item.Message_Role === 2
                              ? 'justify-content-start px-2'
                              : 'justify-content-end px-2'
                          }
                        >
                          {item.Sysdate.split(' ')
                            .splice(1, 1)
                            .join()
                            .split(':')
                            .splice(0, 2)
                            .join(':')}
                        </MessageGroup.Footer>
                      </MessageGroup.Messages>
                    </MessageGroup>
                    <br />
                  </>
                );
              }
            })}
          </MessageList>

          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={e => sendMessage(inputValue)}
            placeholder="對話..."
            onAttachClick={() => document.getElementById('file1').click()}
          />
        </ChatContainer>
      </MainContainer>
      <input
        onChange={e => sendImg(e, orderToken)}
        id="file1"
        type="file"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default TheChat;
