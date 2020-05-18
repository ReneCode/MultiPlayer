import GameConnector from "../GameConnector";
import Player from "../Player";

class GameBase {
  players: Player[] = [];

  constructor(
    protected gameConnector: GameConnector,
    protected gameId: string
  ) {}

  addPlayer(ws: any, playerId: string) {
    if (this.getPlayer(playerId)) {
      throw new Error("player ${playerId} allready added to game");
    }
    const player = new Player(ws, playerId);
    this.players.push(player);
    this.sendUpdatePlayers();
  }

  removePlayer(playerId: any): void {
    const player = this.getPlayer(playerId);
    if (player) {
      this.players = this.players.filter((player) => player.id !== playerId);
      this.sendUpdatePlayers();
    }
  }

  message(message: any) {
    throw new Error("Method not implemented.");
  }

  makeMove(playerId: string, move: any) {
    throw new Error("makeMove not implemented.");
  }

  getGame(): any {
    throw new Error("getGame not implemented");
  }

  start() {
    throw new Error("start not implemented");
  }

  sendMessageToAllPlayers(message: object) {
    const sendMessage = { ...message, gameId: this.gameId };
    const clients = this.players.map((player) => player.ws);
    this.gameConnector.sendMessageToClients(sendMessage, clients);
  }

  // --------------

  protected sendUpdatePlayers() {
    const players = this.players.map((player) => {
      return {
        id: player.id,
        name: player.name,
        scoore: player.score,
      };
    });
    this.sendMessageToAllPlayers({
      cmd: "game_update",
      players: players,
      game: this.getGame(),
    });
  }

  getPlayerIds(): string[] {
    return this.players.map((player) => player.id);
  }

  protected getPlayer(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }
}

export default GameBase;
