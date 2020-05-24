import React from "react";

const WS_SERVER = process.env.REACT_APP_WS_SERVER as string;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

const PING_DELAY = 60_000;

type Props = {
  onMessage: (message: any) => void;
  onConnectWebSocket: (ws: WebSocket) => void;
};

class WebSocketPingPong extends React.Component<Props> {
  ws: WebSocket | undefined = undefined;
  connected: boolean = false;
  intervalId: number = 0;

  constructor(props: any) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  componentDidMount() {
    this.connectToServer();
    this.intervalId = setInterval(this.sendPing, PING_DELAY);
  }

  componentWillUnmound() {
    clearInterval(this.intervalId);
    if (this.ws) {
      this.ws.close();
    }
  }

  sendPing = () => {
    if (this.ws && this.connected) {
      this.connected = false;
      const message = { cmd: "ping" };
      this.ws.send(JSON.stringify(message));
    } else {
      this.connectToServer();
    }
  };

  onMessage = ({ data }: { data: any }) => {
    try {
      const message = JSON.parse(data);
      if (message && message.cmd === "pong") {
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
    this.connected = true;
  };

  connectToServer = () => {
    if (this.ws) {
      this.ws.close();
    }
    console.log("connect to WebSocket");
    this.ws = new WebSocket(WS_SERVER);
    this.ws.onopen = this.onOpen;

    this.ws.onmessage = this.onMessage;

    this.props.onConnectWebSocket(this.ws);
  };

  render() {
    return null;
  }
}

export default WebSocketPingPong;
