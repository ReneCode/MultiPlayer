import GameBase from "./GameBase";
import GameConnector from "../GameConnector";
import { Machine, interpret, Interpreter } from "xstate";

const MAX_ROWS = 15;
const MAX_COLS = 15;

const CELL_EMPTY = 0;

const machineConfiguration = {
  id: "fiveInARow",
  initial: "idle",
  states: {
    idle: {
      on: {
        START: {
          target: "started",
          actions: "doStart",
        },
      },
    },
    finished: {
      on: {
        START: {
          target: "started",
          actions: "doStart",
        },
      },
    },
    started: {
      on: {
        FINISHED: "finished",
        MOVE: {
          target: "started",
          actions: ["doMove"],
        },
      },
    },
  },
};
// {
//   actions: {
//     doMove: (context, event) => {
//       console.log("doing move", context, event);
//     },
//   },
// }

class GameFiveInARow extends GameBase {
  board = [];
  currentPlayerIdx = -1;
  wonPlayerId = undefined;
  state: "idle" | "started" | "finished" = "idle";

  service: Interpreter<any>;

  static getName() {
    return "FiveInARow";
  }
  constructor(gameConnector: GameConnector, gameId: string) {
    super(gameConnector, gameId);

    this.doStart = this.doStart.bind(this);
    this.doMove = this.doMove.bind(this);

    const machineOptions = {
      actions: {
        doStart: this.doStart,
        doMove: this.doMove,
      },
    };
    this.service = interpret(Machine(machineConfiguration, machineOptions));
  }

  public addPlayer(ws: any, playerId: string) {
    super.addPlayer(ws, playerId);
  }

  public getGame() {
    return {
      name: GameFiveInARow.getName(),
      board: this.board,
      state: this.service.state.value,
    };
  }

  public cmdInit() {
    this.board = [];
    for (let iRow = 0; iRow < MAX_ROWS; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < MAX_COLS; iCol++) {
        row.push(CELL_EMPTY);
      }
      this.board.push(row);
    }
    this.service.start();
    this.sendUpdate();
  }

  public message(message: any) {
    switch (message.cmd) {
      case "GAME_START":
        this.service.send("START");
        break;
      case "GAME_MOVE":
        this.service.send("MOVE", message);
        break;
    }
  }

  private doStart() {
    this.sendUpdate();
  }

  private doMove(context, message) {
    console.log(message);
    const col = message.move.col;
    const row = message.move.row;
    const ok = col >= 0 && col < MAX_COLS && row >= 0 && row < MAX_ROWS;
    if (ok) {
      const oldVal = this.getCell(row, col);
      if (oldVal === CELL_EMPTY) {
        const val = this.getCellValueForPlayer(message.playerId);
        if (val) {
          this.setCell(row, col, val);
          this.sendUpdate();
        }
      }
    }
  }

  private getCellValueForPlayer(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index < 0) {
      return 0;
    } else {
      return index + 1;
    }
  }

  private setCell(row: number, col: number, val: number) {
    this.board[row][col] = val;
  }

  private getCell(row: number, col: number) {
    return this.board[row][col];
  }
}

export default GameFiveInARow;
