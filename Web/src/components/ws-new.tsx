import React, { useRef, useEffect, useState, useCallback } from "react";

const WS_SERVER = process.env.REACT_APP_WS_SERVER;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

const PING_DELAY = 6_000;

const WebSocketPingPong = () => {
  const ws = useRef((null as unknown) as WebSocket);
  const [connected, setConnected] = useState(false);

  console.log("Connected-Value:", connected);

  const sendPing = useCallback(
    () => () => {
      console.log("sendPing", connected, ws.current);
      if (ws.current && connected) {
        console.log("send ping");
        setConnected(false);
        const message = { cmd: "ping" };
        ws.current.send(JSON.stringify(message));
        setTimeout(sendPing, PING_DELAY);
      } else {
        console.log("reconnect to server ....");
        // connectToServer();
      }
    },
    [connected]
  );

  useEffect(() => {
    const onMessage = ({ data }: { data: any }) => {
      try {
        const message = JSON.parse(data);
        if (message && message.cmd === "pong") {
          console.log("got pong");
          setConnected(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const connectToServer = () => {
      if (ws.current) {
        ws.current.close();
      }
      ws.current = new WebSocket(WS_SERVER);
      ws.current.onopen = () => {
        console.log("onOpen");
        console.log("connected");
        setConnected(true);
        // const message = { cmd: "ping" };
        // ws.current.send(JSON.stringify(message));

        // sendPing();
      };
      // ws.current.onmessage = onMessage;
      ws.current.onmessage = () => {
        console.log("message");
      };
      // sendPing();
      setTimeout(sendPing, PING_DELAY);
    };

    console.log("create WebSocket");
    if (!ws.current) {
      connectToServer();
    }

    return () => {
      console.log("close WS");

      ws.current.close();
    };
  }, []);

  return <div>{connected ? "OK" : "--"}</div>;
};

// // eslint-disable-next-line react-hooks/exhaustive-deps

export default WebSocketPingPong;
