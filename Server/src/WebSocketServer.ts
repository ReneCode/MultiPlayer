import { gameServer } from "./models/GameServer";
import { Server as SocketServer } from "socket.io";

console.log("WebSocketServer - startup");

export const initSocketServer = (io: SocketServer) => {
  io.on("connection", (socket) => {
    const playerId = socket.id;
    gameServer.connectPlayer(playerId);

    const result = {
      cmd: "CLIENT_CONNECTED",
      playerId: playerId,
    };
    console.log(`CLIENT_CONNECTED: ${playerId}`);
    // io.emit(JSON.stringify({ cmd: "hello", data: "world" }));

    io.to(playerId).emit(JSON.stringify(result));

    socket.onAny((data: any) => {
      try {
        const message = JSON.parse(data);
        const playerId: string = message.playerId;
        const gameId: string = message.gameId;
        const cmd: string = message.cmd;
        console.log("got message", message);

        switch (cmd) {
          case "GAME_CONNECT":
            if (gameServer.addPlayer(gameId, playerId)) {
              // add player to that gameId-room
              socket.join(gameId);
            } else {
              const message = { cmd: "GAME_INVALID" };
              socket.send(JSON.stringify(message));
            }
            break;

          default:
            gameServer.message(message);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnecting", () => {
      gameServer.disconnectPlayer(socket.id);
      console.log("disconnecting", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });

    // socket.onAny((data: any) => {
    //   console.log(">> onAny", data);
    //   // gameServer.message(data);
    // });
  });
};

/*
const colors = require("colors");
import { logger } from "./logger";

colors.setTheme({
  messageIn: ["brightRed"],
  messageOut: ["green"],
});

// https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

class WebSocketServer {
  constructor(wss: any) {
    console.log("start webSocket Server");

    wss.on("connection", (ws, req) => {
      const playerId = gameServer.connectPlayer(ws);
      // console.log("connect player:", playerId);
      // add playerId to the client
      logger.trackTrace(`WS: connection ${playerId}`);
      ws.playerId = playerId;
      const result = {
        cmd: "CLIENT_CONNECTED",
        playerId: playerId,
      };
      console.log(colors.messageOut("CLIENT_CONNECTED"));
      ws.send(JSON.stringify(result));

      ws.on("message", (data) => {
        this.handleMessage(ws, data);
      });

      ws.on("close", () => {
        logger.trackTrace(`WS: close ${ws.playerId}`);

        gameServer.disconnectPlayer(ws.playerId);
      });
    });
  }

  private handleMessage(ws: Server, data: any) {
    try {
      const message = JSON.parse(data);
      logger.trackTrace(`WS: message ${message.cmd}`);

      // console.log("message:", message);
      const playerId: string = message.playerId;
      const gameId: string = message.gameId;
      const cmd: string = message.cmd;

      switch (cmd) {
        case "ping":
          console.log(colors.messageOut("pong"));
          ws.send(JSON.stringify({ cmd: "pong" }));
          break;
        case "GAME_CONNECT":
          gameServer.addPlayer(gameId, playerId, ws);
          break;

        default:
          gameServer.message(message);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
}
*/
//export default WebSocketServer;
