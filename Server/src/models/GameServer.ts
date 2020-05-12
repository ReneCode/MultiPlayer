import Randomize from "./Randomize";
import Game from "./Game";

type Connection = any;
type PlayerId = string;
type GameId = string;

class GameServer {
  players: Map<PlayerId, Connection> = new Map<PlayerId, Connection>();
  games: Map<GameId, Game> = new Map<GameId, Game>();

  public connect(ws: Connection) {
    const playerId = Randomize.generateId(16);
    this.players.set(playerId, ws);
    return playerId;
  }

  public disconnect(ws: Connection) {}

  // create game and add playerId to that game
  public createGame(playerId: string) {
    this.checkPlayerId(playerId);

    const game = new Game();
    const gameId = Randomize.generateId(10);
    this.games.set(gameId, game);
    game.addPlayer(playerId);
    return gameId;
  }

  // add playerId to the game with id gameId
  public connectGame(playerId: PlayerId, gameId: GameId) {
    this.checkPlayerId(playerId);
    this.checkGameId(gameId);
    const game = this.games.get(gameId);
    game.addPlayer(playerId);
  }

  public getGamePlayerIds(gameId: GameId) {
    this.checkGameId(gameId);
    const game = this.games.get(gameId);
    return game.getPlayerIds();
  }

  // ----------------------------------------------------------

  private checkPlayerId(playerId: PlayerId) {
    // must be connected player
    if (!this.players.get(playerId)) {
      throw new Error(`invalid Player ${playerId}`);
    }
  }

  private checkGameId(gameId: GameId) {
    const gameValid = !!this.games.get(gameId);
    if (!gameValid) {
      throw new Error(`invalid Game ${gameId}`);
    }
  }
}

const gameServer = new GameServer();

export default gameServer;
