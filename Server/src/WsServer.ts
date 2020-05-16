import { Server } from "ws";
import GameServer from "./models/GameServer";

// https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

const outAllPlayers = (wss) => {
  console.log("-------------");
  wss.clients.forEach((client) => {
    console.log(">>> ", client.readyState, client.playerId);
  });
};

class WebSocketServer {
  wss = undefined;
  gameServer: GameServer = undefined;

  public listen(server) {
    this.wss = new Server({ port: 5001 });
    this.gameServer = new GameServer(this.wss);

    setInterval(() => {}, 5000);

    console.log("start webSocket Server");
    this.wss.on("request", (req) => {
      console.log(">>> request:", req);
    });

    this.wss.on("connection", (ws, req) => {
      const playerId = this.gameServer.connect(ws);
      console.log("connect player:", playerId);
      // add playerId to the client
      ws.playerId = playerId;
      const result = {
        cmd: "client_connected",
        playerId: playerId,
        availiableGames: this.gameServer.getAvailiableGames(),
      };
      ws.send(JSON.stringify(result));

      ws.on("message", (data) => {
        this.handleMessage(ws, data);
      });

      ws.on("close", (data, x) => {
        console.log("close player:", ws.playerId);
        this.gameServer.removePlayer(ws.playerId);
        // this.updateGame(null);
      });
    });
  }

  private handleMessage(ws: Server, data: any) {
    try {
      const message = JSON.parse(data);
      console.log("message:", message);
      const playerId: string = message.playerId;
      const gameId: string = message.gameId;
      const cmd: string = message.cmd;
      const move: object = message.move;
      let result: any = undefined;
      switch (cmd) {
        case "game_create":
          {
            const gameName = message.name;
            const newGameId = this.gameServer.createGame(gameName);
            this.gameServer.addPlayer(newGameId, playerId, ws);
            console.log("create Game:", newGameId);
          }
          break;
        case "game_connect":
          this.gameServer.addPlayer(gameId, playerId, ws);
          break;

        case "game_start":
          this.gameServer.startGame(gameId);
          break;

        case "game_move":
          this.gameServer.makeMove(gameId, playerId, move);
      }
      return result;
    } catch (err) {
      console.error(err);
      return null;
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
      cmd: "game_update",
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
