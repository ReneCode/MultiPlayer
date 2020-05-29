import GameBase from "./GameBase";
import GameConnector from "../GameConnector";

class GameFiveInARow extends GameBase {
  board = [];
  currentPlayerIdx = -1;
  wonPlayerId = undefined;
  state: "idle" | "started" | "finished" = "idle";

  constructor(gameConnector: GameConnector, gameId: string) {
    super(gameConnector, gameId);
  }

  public addPlayer(ws: any, playerId: string) {
    super.addPlayer(ws, playerId);
  }

  public getGame() {
    return {
      abc: "5 in a row",
      board: this.board,
    };
  }

  public cmdInit() {
    this.board = [];
    for (let iRow = 0; iRow < 15; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < 15; iCol++) {
        row.push(0);
      }
      this.board.push(row);
    }
    this.sendUpdate();
  }

  public message(message: any) {}
}

export default GameFiveInARow;
