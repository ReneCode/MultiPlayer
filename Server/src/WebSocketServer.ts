import { Server } from "ws";
const colors = require("colors");
import GameServer from "./models/GameServer";

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
  gameServer: GameServer = undefined;

  constructor(private wss: any) {
    this.gameServer = new GameServer(this.wss);

    console.log("start webSocket Server");
    this.wss.on("request", (req) => {
      console.log(">>> request:", req);
    });

    this.wss.on("connection", (ws, req) => {
      console.log(colors.messageIn("connect"));
      const playerId = this.gameServer.connectPlayer(ws);
      // console.log("connect player:", playerId);
      // add playerId to the client
      ws.playerId = playerId;
      const result = {
        cmd: "CLIENT_CONNECTED",
        playerId: playerId,
        availiableGames: this.gameServer.getAvailiableGames(),
      };
      console.log(colors.messageOut("CLIENT_CONNECTED"));
      ws.send(JSON.stringify(result));

      ws.on("message", (data) => {
        this.handleMessage(ws, data);
      });

      ws.on("close", () => {
        console.log(colors.messageIn(`close ${ws.playerId}`));
        this.gameServer.disconnectPlayer(ws.playerId);
      });
    });
  }

  private handleMessage(ws: Server, data: any) {
    try {
      const message = JSON.parse(data);
      console.log(colors.messageIn(`message ${message.cmd}`));

      // console.log("message:", message);
      const playerId: string = message.playerId;
      const gameId: string = message.gameId;
      const cmd: string = message.cmd;

      const move: object = message.move;
      switch (cmd) {
        case "ping":
          console.log(colors.messageOut("pong"));
          ws.send(JSON.stringify({ cmd: "pong" }));
          break;
        case "GAME_CREATE":
          {
            const gameName = message.name;
            const newGameId = this.gameServer.createGame(gameName);
            this.gameServer.addPlayer(newGameId, playerId, ws);
          }
          break;
        case "GAME_CONNECT":
          this.gameServer.addPlayer(gameId, playerId, ws);
          break;

        default:
          this.gameServer.message(message);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private updateGame = (gameId) => {
    console.log("--- update game ----");

    const playerIds = [];
    this.wss.clients.forEach((client) => {
      if (client.readyState === WS_OPEN) {
        playerIds.push(client.playerId);
      }
    });

    const msg = JSON.stringify({
      cmd: "GAME_UPDATE",
      players: playerIds,
      gameId: gameId,
    });
    this.wss.clients.forEach((client) => {
      if (client.readyState === WS_OPEN) {
        client.send(msg);
      }
    });
  };
}

export default WebSocketServer;
