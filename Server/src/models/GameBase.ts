const colors = require("colors");
import { Server as SocketServer } from "socket.io";
import { Player } from "./Player";
import Randomize from "./Randomize";

const WS_OPEN = 1;

class GameBase {
  players: Player[] = [];
  readonly gameId: string;
  readonly socketServer: SocketServer;

  constructor(socketServer: SocketServer) {
    this.socketServer = socketServer;
    this.gameId = Randomize.generateId(10);
  }

  addPlayer(playerId: string) {
    if (this.getPlayer(playerId)) {
      throw new Error("player ${playerId} allready added to game");
    }
    const player = new Player(playerId);
    player.color = this.getUniquePlayerColor();
    this.players.push(player);
  }

  removePlayer(playerId: string): void {
    const player = this.getPlayer(playerId);
    if (player) {
      this.players = this.players.filter((player) => player.id !== playerId);
    }
  }

  getUniquePlayerColor(): string {
    while (true) {
      const color = Randomize.choose([
        "white",
        "black",
        "red",
        "green",
        "greenyellow",
        "fuchsia",
        "powderblue",
        "blue",
        "orange",
        "pink",
        "yellow",
        "brown",
        "cyan",
        "gold",
      ]);

      const player = this.players.find((player) => player.color === color);
      if (!player) {
        return color;
      }
    }
  }

  hasPlayer(playerId: any) {
    const player = this.getPlayer(playerId);
    return !!player;
  }

  message(message: any) {
    throw new Error("Method not implemented.");
  }

  cmdMakeMove(playerId: string, move: any) {
    throw new Error("makeMove not implemented.");
  }

  // override
  public getGame(): any {
    return {};
  }

  cmdInit() {}

  cmdStart() {
    throw new Error("start not implemented");
  }

  // --------------

  public sendUpdate({
    toPlayerId,
    message,
  }: { toPlayerId?: string; message?: object } = {}) {
    const players = this.players.map((player) => player.getDtoPlayer());
    let msg: object = {
      cmd: "GAME_UPDATE",
      gameId: this.gameId,
      players: players,
      game: this.getGame(),
    };
    if (message) {
      msg = message;
    }
    let toPlayerIds = this.players;
    if (toPlayerId) {
      toPlayerIds = this.players.filter((player) => player.id === toPlayerId);
    }

    const playerIds = toPlayerIds.map((player) => player.id);
    this.sendMessageToClients(msg, playerIds);
  }

  getPlayerIds(): string[] {
    return this.players.map((player) => player.id);
  }

  protected getPlayer(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  private sendMessageToClients(message: any, playerIds: string[]) {
    // console.log(colors.messageOut(message.cmd));
    // console.log("sendMessage:", message);

    const messageString = JSON.stringify(message);
    for (let playerId of playerIds) {
      this.socketServer.to(playerId).emit(messageString);
      // if (client.readyState === WS_OPEN) {
      //   client.send(messageString);
      // }
    }
  }
}

export default GameBase;
