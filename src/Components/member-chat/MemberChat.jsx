import React, { useEffect, useState, useRef } from "react";
import { MessageBox, Input } from "react-chat-elements";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { PhotoProvider, PhotoConsumer } from "react-photo-view"; // 圖片檢視


// Actions
import {
  setMessage,
  setMessageList,
} from "../../store/actions/memberChatActions";

// Utils
import { scrollToBottomAnimated } from "../../lib/scrollToBottom";
import { resizeFile } from "../../lib/imageResize";

// Hooks
import { useWebSocket } from "../../hooks/useWebSocket";

import csImage from "../../Assets/cs.png";
import uploadImageIcon from "../../Assets/attach_icon.png";
import sendImageIcon from "../../Assets/send_icon.png";

import styles from "./MemberChat.module.scss";
import "react-chat-elements/dist/main.css";
import "react-photo-view/dist/index.css";

const loginSession = localStorage.getItem("token");
const connectWs = "ws_chatuser.ashx";
const url = `${process.env.REACT_APP_K100U_CHAT_WEBSOCKET}${connectWs}?login_session=${loginSession}`;

const MemberChat = () => {
  const { socket, connectMemberLevelWs, sendMessage, sendImage } =
    useWebSocket(url);

  const inputRef = useRef();
  const imageInputRef = useRef();

  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();
  const { messages, showChat } = useSelector((state) => state.memberChat);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return;
    sendMessage(inputValue);
    setInputValue("");
    inputRef.current.value = "";
  };

  const onImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      sendImage(image);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (socket) return;
    connectMemberLevelWs();
  }, [connectMemberLevelWs, socket]);

  useEffect(() => {
    if (!showChat) return;
    scrollToBottomAnimated("member-message");
  }, [showChat]);

  // Message Listen
  useEffect(() => {
    const messageListen = (message) => {
      console.log(message);
      if (!message?.data) return;
      const dataFromServer = JSON.parse(message.data);
      if (Array.isArray(dataFromServer)) {
        dispatch(setMessageList(dataFromServer));
        scrollToBottomAnimated("member-message");

        return;
      }

      dispatch(setMessage(dataFromServer));
      scrollToBottomAnimated("member-message");
    };

    socket?.addEventListener("message", messageListen);

    return () => {
      socket?.removeEventListener("message", messageListen);
    };
  }, [socket, dispatch]);

  return (
    <section
      className={styles.container}
      style={{ display: showChat ? "block" : "none" }}
    >
      <header className={styles.header}>
        <img src={csImage} alt="cs" />
        {/* <img className={styles.close} src={closeImage} alt="close" /> */}
      </header>
      <div id="member-message" className={styles.body}>
        {messages.map(
          ({ Message, SysID, Message_Role, SysDate, Message_Type }) => {
            return (
              <div key={SysID} className={styles["message-box"]}>
                {Message_Type === 1 && (
                  <MessageBox
                    position={Message_Role === 2 ? "left" : "right"}
                    title={Message_Role === 2 ? "*客服" : ""}
                    type={"text"}
                    text={Message}
                    dateString={dayjs(SysDate).format("HH:mm")}
                  />
                )}

                {Message_Type === 2 && (
                  <PhotoProvider>
                    <div
                      className={`rce-mbox ${
                        Message_Role === 2 ? "rce-mbox-left" : "rce-mbox-right"
                      }`}
                      style={{width: '1.5rem'}}
                    >
                      <span
                        style={{
                          position: "absolute",
                          bottom: 20,
                          right: 20,
                          color: "#f2f2f2",
                          fontSize: "1rem",
                        }}
                      >
                        {dayjs(SysDate).format("HH:mm")}
                      </span>
                      <PhotoConsumer key={SysID} src={Message}>
                        <img
                          style={{
                            cursor: "zoom-in",
                            display: "block",
                            margin: 0,
                            width: "100%",
                          }}
                          src={Message}
                          alt="send img"
                        />
                      </PhotoConsumer>
                    </div>
                  </PhotoProvider>
                )}
              </div>
            );
          }
        )}
      </div>
      <form onSubmit={onSubmit} className={styles.action}>
        <Input
          referance={inputRef}
          onChange={({ target }) => setInputValue(target.value)}
          inputStyle={{ backgroundColor: "#f2f2f2" }}
          className={styles.input}
          placeholder="輸入訊息"
          leftButtons={
            <>
              <img
                onClick={() => imageInputRef.current.click()}
                className={styles.upload}
                src={uploadImageIcon}
                alt="upload"
              />
              <input
                id="member-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={onImageChange}
                ref={imageInputRef}
                style={{ display: "none" }}
              />
            </>
          }
          rightButtons={
            <button type="submit">
              <img className={styles.send} src={sendImageIcon} alt="send" />
            </button>
          }
        />
      </form>
    </section>
  );
};

export default MemberChat;
