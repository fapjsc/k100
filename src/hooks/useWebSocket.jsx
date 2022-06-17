import { useState, useCallback, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export const useWebSocket = (path) => {
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState(false)

  const connectMemberLevelWs = useCallback(() => {
    const ws = new ReconnectingWebSocket(path);
    setSocket(ws);
  }, [path]);

  const sendMessage = (value) => {
    socket.send(
      JSON.stringify({
        Message_Type: 1,
        Message: value.toString(),
      })
    );
  };

  const sendImage = (image) => {
    socket.send(
      JSON.stringify({
        Message_Type: 2,
        Message: image,
      })
    );
  };

  // Open Listen
  useEffect(() => {
    const openListen = () => {
      console.log("member level socket open");
      setOnline(true)
    };
    socket?.addEventListener("open", openListen);

    return () => {
      socket?.removeEventListener("open", openListen);
    };
  }, [socket]);

  // Close Listen
  useEffect(() => {
    const closeListen = (close) => {
      console.log(close);
      setOnline(false)
    };
    socket?.addEventListener("close", closeListen);

    return () => {
      socket?.removeEventListener("close", closeListen);
    };
  }, [socket]);

  // Error Listen
  useEffect(() => {
    const errorListen = (error) => {
      console.log(error);
    };
    socket?.addEventListener("error", errorListen);

    return () => {
      socket?.removeEventListener("error", errorListen);
    };
  }, [socket]);

  return {
    socket,
    connectMemberLevelWs,
    sendMessage,
    sendImage,
  };
};
