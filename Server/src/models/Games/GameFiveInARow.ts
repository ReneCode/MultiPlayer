import GameBase from "./GameBase";
import { Machine, interpret, Interpreter } from "xstate";
import Randomize from "../Randomize";

const MAX_ROWS = 15;
const MAX_COLS = 15;
const COMPLETE_LEN = 5;

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
      entry: [
        () => {
          console.log("enter finished stated");
        },
      ],
      on: {
        START: {
          target: "started",
          actions: "doStart",
        },
      },
    },
    started: {
      on: {
        FINISH: "finished",
        START: {
          target: "started",
          actions: "doStart",
        },
        MOVE: {
          target: "started",
          actions: ["doMove"],
        },
      },
    },
  },
};

class GameFiveInARow extends GameBase {
  board = [];
  currentPlayerId = "";
  wonPlayerId = undefined;
  wonCells = [];
  lastMovedCell = undefined;

  service: Interpreter<any>;

  static getName() {
    return "FiveInARow";
  }
  constructor() {
    super();

    this.doStart = this.doStart.bind(this);
    this.doMove = this.doMove.bind(this);

    const machineOptions = {
      actions: {
        doStart: this.doStart,
        doMove: this.doMove,
      },
    };
    this.service = interpret(
      Machine(machineConfiguration, machineOptions)
    ).start();
  }

  public addPlayer(ws: any, playerId: string) {
    super.addPlayer(ws, playerId);
  }

  public getGame() {
    return {
      name: GameFiveInARow.getName(),
      board: this.board,
      currentPlayerId: this.currentPlayerId,
      state: this.service.state.value,
      lastMovedCell: this.lastMovedCell,
      wonCells: this.wonCells,
    };
  }

  public cmdInit() {
    this.lastMovedCell = undefined;
    this.wonCells = [];
    this.board = [];
    for (let iRow = 0; iRow < MAX_ROWS; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < MAX_COLS; iCol++) {
        row.push(CELL_EMPTY);
      }
      this.board.push(row);
    }

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
    const startPlayerIdx = Randomize.generateInt(this.players.length);
    this.currentPlayerId = this.players[startPlayerIdx].id;
    this.cmdInit();
  }

  private doMove(context, message) {
    if (message.playerId !== this.currentPlayerId) {
      // invalid player
      return;
    }

    const col = message.move.col;
    const row = message.move.row;
    const ok = col >= 0 && col < MAX_COLS && row >= 0 && row < MAX_ROWS;
    if (!ok) {
      // invalid move
      return;
    }

    const oldVal = this.getCell(col, row);
    if (oldVal === CELL_EMPTY) {
      const val = this.getCellValueForPlayer(message.playerId);
      if (val) {
        this.setCell(col, row, val);
        this.lastMovedCell = { col, row };

        this.wonCells = this.getWonCells();

        this.setNextCurrentPlayerId();

        this.sendUpdate();

        if (this.wonCells.length > 0) {
          // console.log("game finished");
          this.service.send("FINISH");
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

  private setCell(col: number, row: number, val: number) {
    this.board[col][row] = val;
  }

  private getCell(col: number, row: number) {
    return this.board[col][row];
  }

  private setNextCurrentPlayerId() {
    const currentIdx = this.players.findIndex(
      (player) => player.id === this.currentPlayerId
    );
    let nextIdx = currentIdx + 1;
    if (nextIdx >= this.players.length) {
      nextIdx = 0;
    }
    this.currentPlayerId = this.players[nextIdx].id;
  }

  private getWonCells() {
    let wonCells = [];
    const checkCells = this.getCheckCells();
    checkCells.forEach((cells) => {
      const values = new Set<number>();
      cells.forEach((cell) => {
        const [col, row] = cell.split(",").map((str: string) => parseInt(str));
        values.add(this.getCell(col, row));
      });
      if (values.size === 1 && !values.has(CELL_EMPTY)) {
        wonCells = cells;
      }
    });
    return wonCells;
  }

  private getCheckCells() {
    const checkCells: string[][] = [];

    for (let iCol = 0; iCol < MAX_COLS; iCol++) {
      for (let iRow = 0; iRow <= MAX_ROWS - COMPLETE_LEN; iRow++) {
        const line = [];
        for (let i = 0; i < COMPLETE_LEN; i++) {
          line.push(`${iCol},${iRow + i}`);
        }
        checkCells.push(line);
      }
    }

    for (let iRow = 0; iRow < MAX_ROWS; iRow++) {
      for (let iCol = 0; iCol <= MAX_COLS - COMPLETE_LEN; iCol++) {
        const line = [];
        for (let i = 0; i < COMPLETE_LEN; i++) {
          line.push(`${iCol + i},${iRow}`);
        }
        checkCells.push(line);
      }
    }

    for (let iCol = 0; iCol <= MAX_COLS - COMPLETE_LEN; iCol++) {
      for (let iRow = 0; iRow <= MAX_ROWS - COMPLETE_LEN; iRow++) {
        const line = [];
        for (let i = 0; i < COMPLETE_LEN; i++) {
          line.push(`${iCol + i},${iRow + i}`);
        }
        checkCells.push(line);
      }
    }

    for (let iCol = COMPLETE_LEN - 1; iCol < MAX_COLS; iCol++) {
      for (let iRow = 0; iRow <= MAX_ROWS - COMPLETE_LEN; iRow++) {
        const line = [];
        for (let i = 0; i < COMPLETE_LEN; i++) {
          line.push(`${iCol - i},${iRow + i}`);
        }
        checkCells.push(line);
      }
    }

    return checkCells;
  }
}

export default GameFiveInARow;
