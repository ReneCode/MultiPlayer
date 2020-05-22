import React from "react";

const WS_SERVER = process.env.REACT_APP_WS_SERVER as string;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

const PING_DELAY = 6_000;

type Props = {
  onMessage: (message: any) => void;
  onConnectWebSocket: (ws: WebSocket) => void;
};

class WebSocketPingPong extends React.Component<Props> {
  ws: WebSocket | undefined = undefined;
  connected: boolean = false;

  constructor(props: any) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  componentDidMount() {
    this.connectToServer();
  }

  componentWillUnmound() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendPing = () => {
    console.log("sendPing", this.connected, this.ws);
    if (this.ws && this.connected) {
      console.log("send ping");
      this.connected = false;
      const message = { cmd: "ping" };
      this.ws.send(JSON.stringify(message));
      setTimeout(this.sendPing, PING_DELAY);
    } else {
      console.log("reconnect to server ....");
      // connectToServer();
    }
  };

  onMessage = ({ data }: { data: any }) => {
    try {
      const message = JSON.parse(data);
      if (message && message.cmd === "pong") {
        console.log("got pong");
        this.connected = true;
      } else {
        return this.props.onMessage(message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  onOpen = () => {
    console.log("onOpen");
    console.log("connected");
    this.connected = true;
    setTimeout(this.sendPing, PING_DELAY);
  };

  connectToServer = () => {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(WS_SERVER);
    this.ws.onopen = this.onOpen;

    this.ws.onmessage = this.onMessage;

    this.props.onConnectWebSocket(this.ws);
    console.log("create WebSocket");
  };

  render() {
    return null;
  }
}

export default WebSocketPingPong;
