import Randomize from "./Randomize";
import GameConnector from "./GameConnector";
import GameBase from "./Games/GameBase";
import GameTicTacToe from "./Games/GameTicTacToe";
import GameFiveInARow from "./Games/GameFiveInARow";

type Connection = any;
type PlayerId = string;
type GameId = string;

class GameServer {
  allPlayers: Map<PlayerId, Connection> = new Map<PlayerId, Connection>();
  games: Map<GameId, GameBase> = new Map<GameId, GameBase>();

  readonly TicTacToe_Name = "Tic Tac Toe";
  readonly FiveInARow_Name = "Five in a row";
  readonly availiableGames = [this.TicTacToe_Name, this.FiveInARow_Name];

  constructor(private wss: any) {}

  getAvailiableGames() {
    return this.availiableGames;
  }

  public connectPlayer(ws: Connection) {
    const playerId = Randomize.generateId(16);
    this.allPlayers.set(playerId, ws);
    return playerId;
  }

  disconnectPlayer(playerId: any) {
    this.allPlayers.delete(playerId);
    this.games.forEach((game) => {
      try {
        if (game) {
          if (game.hasPlayer(playerId)) {
            game.removePlayer(playerId);
            game.sendUpdate();
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // add playerId to the game with id gameId
  public addPlayer(gameId: string, playerId: string, ws: WebSocket) {
    const game = this.games.get(gameId);
    if (!game) {
      const message = { cmd: "GAME_INVALID" };
      ws.send(JSON.stringify(message));
    } else {
      this.checkPlayerId(playerId);
      game.addPlayer(ws, playerId);
      game.sendUpdate();
    }
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
        game.cmdInit();
        break;

      case this.FiveInARow_Name:
        game = new GameFiveInARow(gameConnector, gameId);
        game.cmdInit();
        break;
      default:
        throw new Error("bad gameName:" + gameName);
    }
    this.games.set(gameId, game);
    return gameId;
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
    game.cmdStart();
  }

  // ----------------------------------------------------------

  private checkGameName(name: string) {
    if (!this.availiableGames.includes(name)) {
      throw new Error(`invalid game name: ${name}`);
    }
  }

  private checkPlayerId(playerId: PlayerId) {
    // must be connected player
    if (!this.allPlayers.get(playerId)) {
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
