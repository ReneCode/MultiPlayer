const http = require("http");
const WSServer = require("ws").Server;

const app = require("./http-server");
import WebSockerServer from "./WebSocketServer";

// https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
const appInsights = require("applicationinsights");
appInsights.setup().start();
const logClient = appInsights.defaultClient;

const msg = `start Server with NODE_ENV: ${process.env.NODE_ENV}`;
console.log(msg);
logClient.trackTrace({ message: msg });

const envProduction = process.env.NODE_ENV === "production";

const server = http.createServer((req, res) => {
  if (envProduction) {
    logClient.trackNodeHttpRequest({ request: req, response: res });
  }
});
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
