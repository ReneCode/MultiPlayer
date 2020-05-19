import Randomize from "./Randomize";
import GameConnector from "./GameConnector";
import GameBase from "./Games/GameBase";
import GameTicTacToe from "./Games/GameTicTacToe";

type Connection = any;
type PlayerId = string;
type GameId = string;

class GameServer {
  players: Map<PlayerId, Connection> = new Map<PlayerId, Connection>();
  games: Map<GameId, GameBase> = new Map<GameId, GameBase>();

  readonly TicTacToe_Name = "TicTacToe";
  readonly Halma_Name = "Halma";
  readonly availiableGames = [this.TicTacToe_Name, this.Halma_Name];

  constructor(private wss: any) {}

  getAvailiableGames() {
    return this.availiableGames;
  }

  public connect(ws: Connection) {
    const playerId = Randomize.generateId(16);
    this.players.set(playerId, ws);
    return playerId;
  }

  removePlayer(playerId: any) {
    this.players.delete(playerId);
    this.games.forEach((game) => game.removePlayer(playerId));
  }

  public disconnect(ws: Connection) {}

  public createGame(gameName: string) {
    this.checkGameName(gameName);

    const gameId = Randomize.generateId(10);
    const gameConnector = new GameConnector(this.wss);
    let game: GameBase;
    switch (gameName) {
      case this.TicTacToe_Name:
        game = new GameTicTacToe(gameConnector, gameId);
        break;
    }
    this.games.set(gameId, game);
    return gameId;
  }

  // add playerId to the game with id gameId
  public addPlayer(gameId: string, playerId: string, ws: any) {
    this.checkGameId(gameId);
    this.checkPlayerId(playerId);

    const game = this.games.get(gameId);
    game.addPlayer(ws, playerId);
  }

  public message(message: any) {
    const playerId: string = message.playerId;
    const gameId: string = message.gameId;

    this.checkGameId(gameId);
    this.checkPlayerId(playerId);
    const game = this.games.get(gameId);
    if (game) {
      game.message(message);
    }
  }

  // public makeMove(gameId: string, playerId: string, move: any) {
  //   this.checkGameId(gameId);
  //   this.checkPlayerId(playerId);

  //   const game = this.getGame(gameId);
  //   game.makeMove(playerId, move);
  // }

  public getGamePlayerIds(gameId: GameId) {
    this.checkGameId(gameId);
    const game = this.games.get(gameId);
    return game.getPlayerIds();
  }

  public startGame(gameId: string) {
    console.log("gameId:", gameId, this.games);
    this.checkGameId(gameId);
    const game = this.games.get(gameId);
    game.start();
  }

  // ----------------------------------------------------------

  private checkGameName(name: string) {
    if (!this.availiableGames.includes(name)) {
      throw new Error(`invalid game name: ${name}`);
    }
  }

  private checkPlayerId(playerId: PlayerId) {
    // must be connected player
    if (!this.players.get(playerId)) {
      throw new Error(`invalid Player ${playerId}`);
    }
  }

  private checkGameId(gameId: GameId) {
    if (!this.getGame(gameId)) {
      throw new Error(`invalid Game ${gameId}`);
    }
  }

  private getGame(gameId): GameBase {
    return this.games.get(gameId);
  }
}

export default GameServer;
