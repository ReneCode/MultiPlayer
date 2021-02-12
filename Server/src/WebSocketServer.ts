import { gameServer } from "./models/GameServer";
import { Server as SocketServer } from "socket.io";
import { logger } from "./logger";

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

    io.to(playerId).emit(JSON.stringify(result));

    socket.onAny((data: any) => {
      try {
        const message = JSON.parse(data);
        const playerId: string = message.playerId;
        const gameId: string = message.gameId;
        const cmd: string = message.cmd;
        logger.trackTrace("got WS message", message);

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
      console.log("disconnect", socket.id);
    });
  });
};
