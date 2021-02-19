import Randomize from "./Randomize";
import { Server as SocketServer } from "socket.io";
import GameBase from "./GameBase";
import GameTicTacToe from "./GameTicTacToe/GameTicTacToe";
import GameFiveInARow from "./GameFiveInARow/GameFiveInARow";
import GameNobodyIsPerfect from "./GameNobodyIsPerfect/GameNobodyIsPerfect";
import { GameSet } from "./GameSet/GameSet";

type Connection = any;
type PlayerId = string;
type GameId = string;

class GameServer {
  allPlayers: Map<PlayerId, boolean> = new Map<PlayerId, boolean>();
  games: Map<GameId, GameBase> = new Map<GameId, GameBase>();
  socketServer: SocketServer;

  readonly TicTacToe_Name = "Tic Tac Toe";
  readonly FiveInARow_Name = "Five in a row";
  readonly FiveInARowTeam_Name = "Five in a row - Team";
  readonly NobodysPerfect_Name = "Nobody's perfect";
  readonly Set_Name = "Set";
  readonly availiableGames = [
    this.TicTacToe_Name,
    this.FiveInARow_Name,
    this.FiveInARowTeam_Name,
    this.NobodysPerfect_Name,
    this.Set_Name,
  ];

  init(socketServer: SocketServer) {
    this.socketServer = socketServer;
  }

  getAvailiableGames() {
    return this.availiableGames;
  }

  public connectPlayer(playerId: string) {
    // const playerId = Randomize.generateId(16);
    this.allPlayers.set(playerId, true);
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
  public addPlayer(gameId: string, playerId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      return false;
      // const message = { cmd: "GAME_INVALID" };
      // ws.send(JSON.stringify(message));
    } else {
      this.checkPlayerId(playerId);
      game.addPlayer(playerId);
      game.sendUpdate();
      return true;
    }
  }

  public disconnect(ws: Connection) {}

  public createGame(gameName: string) {
    this.checkGameName(gameName);

    let game: GameBase;
    switch (gameName) {
      case this.TicTacToe_Name:
        game = new GameTicTacToe(this.socketServer);
        game.cmdInit();
        break;

      case this.FiveInARow_Name:
        game = new GameFiveInARow(this.socketServer);
        game.cmdInit();
        break;

      case this.FiveInARowTeam_Name:
        game = new GameFiveInARow(this.socketServer, {
          teamSize: 2,
          shuffleTeam: true,
        });
        game.cmdInit();
        break;

      case this.NobodysPerfect_Name:
        game = new GameNobodyIsPerfect(this.socketServer);
        game.cmdInit();
        break;

      case this.Set_Name:
        game = new GameSet(this.socketServer);
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
    // this.checkGameId(gameId);
    // this.checkPlayerId(playerId);
    const game = this.games.get(gameId);
    if (game) {
      const playerId = message.playerId;
      const foundPlayer = game.players.find((p) => p.id == playerId);
      if (foundPlayer) {
        game.message(message);
      }
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

export const gameServer = new GameServer();
