require("dotenv").config();

import { Server as SocketServer } from "socket.io";

import { app } from "./http-server";
const http = require("http");

import { logger } from "./logger";
import { gameServer } from "./models/GameServer";
import { initSocketServer } from "./WebSocketServer";

const msg = `start Server with NODE_ENV: ${process.env.NODE_ENV}`;
logger.trackTrace(msg);

const envProduction = process.env.NODE_ENV === "production";

const server = http.createServer(app);

// https://socket.io/docs/v3/handling-cors/
const socketServer = new SocketServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});
gameServer.init(socketServer);
initSocketServer(socketServer);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("server listening (http and ws) on port:", port);
});

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
