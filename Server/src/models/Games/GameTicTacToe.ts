/*

player:
1:red
2:black
3:yellow
4:green


position: start, start+1, ....

red:     1, 2, 3, 4, 5, 6, 7, 8, 9,10
black:  11,12,13,14,15,16,17,18,19,20
yellow: 21,22,23,24,25,26,27,28,29,30
green:  31,32,33,34,35,36,37,38,39,40

target for
red:    101,102,103,104
black:  111,112,113,114
yellow: 121,122,123,124
green:  131,132,133,134

path for
red:    1.........40,101,102,103,104
black:  11..40,1..10,111,112,113,114
yellow: 21..40,1..20,121,122,123,124
green:  31..40,1..30,131,132,133,134
*/

import GameConnector from "../GameConnector";
import GameBase from "./GameBase";

const MAX_PLAYER_COUNT = 2;
const ONE_PATH_LEN = 10;

const MAX_ROW = 3;
const MAX_COL = 3;

export class Token {
  player: number;
  position: number;
}

class GameTicTacToe extends GameBase {
  board = [];
  currentPlayer = "";

  constructor(gameConnector: GameConnector, gameId: string) {
    super(gameConnector, gameId);
    this.init();
  }

  getGame() {
    return { board: this.board };
  }

  public makeMove(
    playerId: string,
    { col, row }: { col: number; row: number }
  ) {
    this.checkValidMove(col, row);
    console.log("ticTacToe.move", col, row);
    const val = this.getCellValueForPlayer(playerId);
    this.setCellValue(col, row, val);
    this.sendUpdatePlayers();
  }

  private getCellValueForPlayer(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    return index === 0 ? "X" : "O";
  }

  private checkValidMove(col: number, row: number) {
    const ok = col >= 0 && col < MAX_COL && row >= 0 && row < MAX_ROW;
    if (!ok) {
      throw new Error(`invalid move: ${this.gameId}, ${col}, ${row}`);
    }
  }

  private setCellValue(col: number, row: number, val: string) {
    this.board[row][col] = val;
  }

  init() {
    for (let iRow = 0; iRow < MAX_ROW; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < MAX_COL; iCol++) {
        row.push("");
      }
      this.board.push(row);
    }
  }
}

export class Move {
  steps: number;
  token: Token;
}

export const calcNewBoard = (tokenList: Token[], move: Move) => {
  if (
    !tokenList.find((t) => {
      return (
        t.player === move.token.player && t.position === move.token.position
      );
    })
  ) {
    return null;
  }

  let position = move.token.position;
  let steps = move.steps;
  while (steps > 0) {
    steps--;
    position = nextPosition(position, move.token.player);
  }
  if (!position) {
    return null;
  }
};

const nextPosition = (position: number, player: number) => {
  if (!position) {
    return null;
  }
  // if (position <= 1 && position <=)
  // if (isEndPosition(position, player))
};

const isEndPosition = (position: number, player: number) => {};

export default GameTicTacToe;
