import Randomize from "./Randomize";
import GameBase from "./Games/GameBase";
import GameTicTacToe from "./Games/GameTicTacToe";
import GameFiveInARow from "./Games/GameFiveInARow";
import GameNobodyIsPerfect from "./Games/nobodyIsPerfect/GameNobodyIsPerfect";

type Connection = any;
type PlayerId = string;
type GameId = string;

class GameServer {
  allPlayers: Map<PlayerId, Connection> = new Map<PlayerId, Connection>();
  games: Map<GameId, GameBase> = new Map<GameId, GameBase>();

  readonly TicTacToe_Name = "Tic Tac Toe";
  readonly FiveInARow_Name = "Five in a row";
  readonly NobodysPerfect_Name = "Nobody's perfect";
  readonly availiableGames = [
    this.TicTacToe_Name,
    this.FiveInARow_Name,
    this.NobodysPerfect_Name,
  ];

  constructor() {}

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

    let game: GameBase;
    switch (gameName) {
      case this.TicTacToe_Name:
        game = new GameTicTacToe();
        game.cmdInit();
        break;

      case this.FiveInARow_Name:
        game = new GameFiveInARow();
        game.cmdInit();
        break;

      case this.NobodysPerfect_Name:
        game = new GameNobodyIsPerfect();
        game.cmdInit();
        break;

      default:
        throw new Error("bad gameName:" + gameName);
    }
    this.games.set(game.gameId, game);
    return game.gameId;
  }

  public message(message: any) {
    const playerId: string = message.playerId;
    const gameId: string = message.gameId;

    // console.log(message);
    this.checkGameId(gameId);
    this.checkPlayerId(playerId);
    const game = this.games.get(gameId);
    if (game) {
      game.message(message);
    }
  }

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

const gameServer = new GameServer();

export default gameServer;
