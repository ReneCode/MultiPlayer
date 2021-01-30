const colors = require("colors");

import { Player } from "./Player";
import Randomize from "./Randomize";

const WS_OPEN = 1;

class GameBase {
  players: Player[] = [];
  readonly gameId: string;

  constructor() {
    this.gameId = Randomize.generateId(10);
  }

  addPlayer(ws: any, playerId: string) {
    if (this.getPlayer(playerId)) {
      throw new Error("player ${playerId} allready added to game");
    }
    const player = new Player(ws, playerId);
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

  sendMessageToAllPlayers(message: object) {
    const sendMessage = { ...message, gameId: this.gameId };
    const clients = this.players.map((player) => player.ws);
    this.sendMessageToClients(sendMessage, clients);
  }

  // --------------

  public sendUpdate() {
    const players = this.players.map((player) => {
      return {
        id: player.id,
        name: player.name,
        score: player.score,
        color: player.color,
      };
    });
    const message = {
      cmd: "GAME_UPDATE",
      gameId: this.gameId,
      players: players,
      game: this.getGame(),
    };

    const clients = this.players.map((player) => player.ws);
    this.sendMessageToClients(message, clients);
  }

  getPlayerIds(): string[] {
    return this.players.map((player) => player.id);
  }

  protected getPlayer(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  private sendMessageToClients(message: any, clients: any[]) {
    console.log(colors.messageOut(message.cmd));
    // console.log("sendMessage:", message);

    const messageString = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WS_OPEN) {
        client.send(messageString);
      }
    });
  }
}

export default GameBase;
