import { useContext, useEffect, useState, useRef } from "react";

import { useSelector } from "react-redux";

import { useRouteMatch } from "react-router-dom";
import Resizer from "react-image-file-resizer"; // 圖片壓縮
import { PhotoProvider, PhotoConsumer } from "react-photo-view"; // 圖片檢視
import "react-photo-view/dist/index.css";

// Context
import ChatContext from "../../context/chat/ChatContext";

// Lang Context
import { useI18n } from "../../lang";

// Play Sound
import useSound from "use-sound";
import newMessageSound from "../../Assets/mp3/newMessage.mp3";

// Style
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import classes from "./TheChat.module.scss";

const TheChat = (props) => {
  const { orderStatus } = useSelector((state) => state.order);
  const { Order_StatusID: statusID } = orderStatus || {};

  console.log(orderStatus);

  // Lang Context
  const { t } = useI18n();
  // Router Props
  const match = useRouteMatch();

  const messagesEndRef = useRef();

  // Init State
  const [userInput, setUserInput] = useState("");
  // const [messagesEnd, setMessagesEnd] = useState(null);
  const [isAgent, setIsAgent] = useState(false);

  // Play Sound State
  const [play, { stop }] = useSound(newMessageSound, {
    interrupt: false,
    loop: true,
  });
  // const [loop, setLoop] = useState();
  const [soundState, setSoundState] = useState(true);

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
    chatLoading,
    setChatLoading,
    newMessage,
    setNewMessage,
  } = chatContext;

  // ===========
  //  function
  // ===========
  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  //點擊後發送訊息到server
  const sendMessage = (value, e) => {
    if (value === "") return;

    if (
      e.keyCode === 13 ||
      e.target.id === "sendIcon" ||
      e.target.id === "sendIcon1"
    ) {
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

      setUserInput("");
    }

    return;
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1024,
        1024,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const sendImg = async (e) => {
    setChatLoading(true);
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
      setChatLoading(false);
    }
  };

  const scrollToBottom = () => {
    // if (messagesEnd) {
    //   messagesEnd.scrollIntoView({ behavior: "smooth" });
    // }

    messagesEndRef.current?.scroll({
      top: 10000,
      behavior: "smooth",
    });
  };

  const handleStopSound = () => {
    stop();
    // clearInterval(loop);
    setSoundState(!soundState);
    setNewMessage(false);
  };

  // ===========
  //  UseEffect
  // ===========
  useEffect(() => {
    if (client) client.close();
    if (instantClient) instantClient.close();

    if (match.path.includes("instant")) instantChat(match.params.id);
    if (match.path.includes("transaction")) chatConnect(match.params.id);

    if (localStorage.getItem("agent")) setIsAgent(true);

    return () => {
      setMessages([]);
      setInstantMessages([]);
      if (client) client.close();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (soundState && newMessage) {
      // 新訊息聲音提示
      play();
      // const soundLoop = setInterval(() => {
      //   play();
      // }, 7000);
      // setLoop(soundLoop);
    }

    return () => {
      stop();

      // if (loop) {
      //   stop();
      //   clearInterval(loop);
      // }
    };

    // eslint-disable-next-line
  }, [newMessage, soundState]);

  useEffect(() => {
    scrollToBottom();
  }, [instantMessages, messages]);

  return (
    <>
      <div
        className={classes.chatBox}
        style={{
          display: props.isChat ? "block" : "none",
        }}
      >
        {isAgent && (
          <div className={classes.soundBtnBox}>
            <Button
              className={soundState ? "btn-info" : "btn-danger"}
              onClick={handleStopSound}
            >
              {!soundState ? t("chat_sound_close") : t("chat_sound_open")}
            </Button>
          </div>
        )}

        {/* Chat Header */}
        <div className={classes.top}>
          <p className="mb-1" style={{ display: "block" }}>
            {t("chat_order_number")}：
          </p>
          <p className="">{props.hash}</p>
        </div>

        {instantClient ? (
          <>
            {/* Chat Body */}
            <div
              ref={messagesEndRef}
              className={classes.talk}
              style={{
                width: "100%",
                paddingTop: "3rem",
              }}
              // ref={scrollRef}f
            >
              {instantMessages.map((el, index) => {
                return (
                  <div className="mb-2" key={index} style={{}}>
                    {/* CS  === 2 , instant === 3, */}
                    <div>
                      {/* messages */}
                      {el.Message_Type === 1 ? (
                        <>
                          {el.Message_Role === 2 && (
                            <Badge variant="danger">
                              {t("chat_customer_server")}
                            </Badge>
                          )}
                          <p
                            className={
                              el.Message_Role === 1 || el.Message_Role === 2
                                ? classes.talk_l
                                : classes.talk_r
                            }
                          >
                            {el.Message}
                          </p>
                        </>
                      ) : (
                        <>
                          {el.Message_Role === 2 && (
                            <div>
                              <Badge variant="danger">
                                {t("chat_customer_server")}
                              </Badge>
                            </div>
                          )}

                          <PhotoProvider>
                            <PhotoConsumer key={index} src={el.Message}>
                              <img
                                style={{
                                  cursor: "zoom-in",
                                }}
                                src={el.Message}
                                alt="send img"
                                className={
                                  el.Message_Role === 1 || el.Message_Role === 2
                                    ? classes.talk_l
                                    : classes.talk_r
                                }
                              />
                            </PhotoConsumer>
                          </PhotoProvider>
                        </>
                      )}

                      {/* 日期 */}
                      <div
                        className={
                          el.Message_Role === 1 || el.Message_Role === 2
                            ? classes.talk_time
                            : `${classes.talk_time} ${classes.a_right}`
                        }
                      >
                        {el.Sysdate.split(" ")
                          .splice(1, 1)
                          .join()
                          .split(":")
                          .splice(0, 2)
                          .join(":")}
                      </div>
                    </div>
                    {/* <div
                      style={{ float: 'left', clear: 'both', }}
                      ref={el => {
                        setMessagesEnd(el);
                      }}
                    ></div> */}
                  </div>
                );
              })}
              {chatLoading && (
                <div className="text-center">
                  <Spinner animation="border" role="status" />
                </div>
              )}

              {(statusID === 1 || statusID === 99) && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#707070" }}>對話結束</p>
                </div>
              )}

              {/* <div
                // style={{ float: "left", clear: "both" }}
                ref={messagesEndRef}
              ></div> */}
            </div>

            {/* Chat Bottom */}
            <div className={classes.bottom}>
              {/* attach-iconBox */}
              <label className="">
                <input
                  id="upload_img"
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e) => sendImg(e)}
                  disabled={statusID === 1 || statusID === 99}
                />
                <div
                  className={classes.attach_icon}
                  style={{
                    cursor:
                      statusID === 1 || statusID === 99 ? "no-drop" : "pointer",
                  }}
                />
              </label>
              <div className="w_77">
                <input
                  className={`easy-input ${classes.talkBox}`}
                  type="text"
                  name="talk"
                  placeholder={`${t("chat_send_message")}...`}
                  value={userInput}
                  onChange={handleChange}
                  onKeyUp={(e) => sendMessage(userInput, e)}
                  disabled={statusID === 1 || statusID === 99}
                />
              </div>
              <span
                id="sendIcon"
                style={{
                  cursor:
                    statusID === 1 || statusID === 99 ? "no-drop" : "pointer",
                }}
                className={classes.send_icon}
                onClick={(e) => sendMessage(userInput, e)}
              />
            </div>
          </>
        ) : client ? (
          <>
            {/* Chat Body */}
            <div className={classes.talk} ref={messagesEndRef}>
              {messages.map((el, index) => {
                return (
                  <div className="mb-2" key={index}>
                    {/* CS  === 2 , instant === 3, */}

                    <div>
                      {/* messages */}
                      {el.Message_Type === 1 ? (
                        <>
                          {el.Message_Role === 2 && (
                            <Badge variant="danger">
                              {t("chat_customer_server")}
                            </Badge>
                          )}
                          <p
                            className={
                              el.Message_Role === 2 || el.Message_Role === 3
                                ? classes.talk_l
                                : classes.talk_r
                            }
                          >
                            {el.Message}
                          </p>
                        </>
                      ) : (
                        <>
                          {el.Message_Role === 2 && (
                            <div>
                              <Badge variant="danger">
                                {t("chat_customer_server")}
                              </Badge>
                            </div>
                          )}

                          <PhotoProvider>
                            <PhotoConsumer key={index} src={el.Message}>
                              <img
                                src={el.Message}
                                alt="send img"
                                style={{
                                  cursor: "zoom-in",
                                }}
                                className={
                                  el.Message_Role === 3 || el.Message_Role === 2
                                    ? classes.talk_l
                                    : classes.talk_r
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
                            ? classes.talk_time
                            : `${classes.talk_time} ${classes.a_right}`
                        }
                      >
                        {el.Sysdate.split(" ")
                          .splice(1, 1)
                          .join()
                          .split(":")
                          .splice(0, 2)
                          .join(":")}
                      </div>
                    </div>
                    {/* <div
                      style={{ float: "left", clear: "both" }}
                      ref={(el) => {
                        setMessagesEnd(el);
                      }}
                    ></div> */}
                  </div>
                );
              })}

              {chatLoading && (
                <div className="text-center">
                  <Spinner animation="border" role="status" />
                </div>
              )}
              {(statusID === 1 || statusID === 99) && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#707070" }}>對話結束</p>
                </div>
              )}
            </div>

            {/* Chat Bottom */}
            <div className={`${classes.bottom} d-flex align-items-center`}>
              {/* attach-iconBox  label className */}
              <label className="mt-2">
                <input
                  id="upload_img"
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e) => sendImg(e)}
                  disabled={statusID === 1 || statusID === 99}
                />
                <div
                  className={classes.attach_icon}
                  style={{
                    cursor:
                      statusID === 1 || statusID === 99 ? "no-drop" : "pointer",
                  }}
                />
              </label>
              <div className="w_77">
                <input
                  className={`easy-input ${classes.talkBox}`}
                  type="text"
                  name="talk"
                  placeholder={`${t("chat_send_message")}...`}
                  value={userInput}
                  onChange={handleChange}
                  onKeyUp={(e) => sendMessage(userInput, e)}
                  disabled={statusID === 1 || statusID === 99}
                />
              </div>
              <span
                id="sendIcon1"
                style={{
                  cursor:
                    statusID === 1 || statusID === 99 ? "no-drop" : "pointer",
                }}
                className={classes.send_icon}
                onClick={(e) => sendMessage(userInput, e)}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
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
