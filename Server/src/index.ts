const http = require("http");
const WSServer = require("ws").Server;

const app = require("./http-server");
import WebSockerServer from "./WebSocketServer";

const server = http.createServer();
server.on("request", app);

// create web socket server on top of a regular http server
const wss = new WSServer({
  server: server,
});
const webSocketServer = new WebSockerServer(wss);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("server listening (http and ws) on port:", port);
});

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
