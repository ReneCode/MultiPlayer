import { Server } from "ws";
import gameServer from "./models/GameServer";

// https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

const outAllPlayers = (wss) => {
  console.log("-------------");
  wss.clients.forEach((client) => {
    console.log(">>> ", client.readyState, client.id);
  });
};

class WebSocketServer {
  wss = undefined;

  public listen(server) {
    this.wss = new Server({ port: 5001 });

    setInterval(() => {}, 5000);

    console.log("start webSocket Server");
    this.wss.on("request", (req) => {
      console.log(">>> request:", req);
    });

    this.wss.on("connection", (ws, req) => {
      const playerId = gameServer.connect(ws);
      console.log("connect player:", playerId);
      ws.id = playerId;
      const result = { cmd: "connected", playerId: playerId };
      ws.send(JSON.stringify(result));

      ws.on("message", (data) => {
        this.handleMessage(data);
      });

      ws.on("close", (data, x) => {
        console.log("close player:", ws.id);
        this.updateGame(null);
      });
    });
  }

  private handleMessage(data: any) {
    try {
      const message = JSON.parse(data);
      console.log("message:", message);
      const { playerId, gameId, cmd } = message;
      let result: any = undefined;
      switch (cmd) {
        case "createGame":
          {
            const newGameId = gameServer.createGame(playerId);
            console.log("create Game:", newGameId);
            this.updateGame(newGameId);
          }
          break;
        case "connectGame":
          gameServer.connectGame(playerId, gameId);
          this.updateGame(gameId);
          break;
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
        playerIds.push(client.id);
      }
    });

    const msg = JSON.stringify({
      cmd: "updateGame",
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
