import GameBase from "../GameBase";
import { Server as SocketServer } from "socket.io";
import { Machine, interpret, Interpreter } from "xstate";
import Randomize from "../Randomize";

const MAX_ROWS = 15;
const MAX_COLS = 15;
const COMPLETE_LEN = 5;

const CELL_EMPTY = 0;

const machineConfiguration = {
  strict: true,
  id: "fiveInARow",
  initial: "idle",
  states: {
    idle: {
      entry: "doIdle",
      on: {
        START: {
          cond: "condStart",
          target: "started",
          actions: "doStart",
        },
      },
    },
    finished: {
      RESET: "idle",
      entry: ["doFinished"],
      on: {
        START: {
          target: "started",
          actions: "doStart",
        },
      },
    },
    started: {
      on: {
        RESET: "idle",
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
  constructor(socketServer: SocketServer) {
    super(socketServer);

    const machineOptions = {
      actions: {
        doStart: this.doStart.bind(this),
        doMove: this.doMove.bind(this),
        doFinished: this.doFinished.bind(this),
        doIdle: this.doIdle.bind(this),
      },
      guards: {
        condStart: this.condStart.bind(this),
      },
    };
    this.service = interpret(
      Machine(machineConfiguration, machineOptions)
    ).start();
  }

  public addPlayer(playerId: string) {
    super.addPlayer(playerId);
  }

  public removePlayer(playerId: string) {
    this.players = this.players.filter((p) => p.id !== playerId);
    this.service.send("RESET");
  }

  public getGame() {
    return {
      name: GameFiveInARow.getName(),
      board: this.board,
      currentPlayerId: this.currentPlayerId,
      state: this.service ? this.service.state.value : "",
      lastMovedCell: this.lastMovedCell,
      wonCells: this.wonCells,
      wonPlayerId: this.wonPlayerId,
      players: this.players.map((p) => {
        return {
          id: p.id,
          name: p.name,
          color: p.color,
          score: p.score,
        };
      }),
    };
  }

  public cmdInit() {
    this.lastMovedCell = undefined;
    this.wonCells = [];
    this.wonPlayerId = "";
    this.board = [];
    this.currentPlayerId = "";
    for (let iRow = 0; iRow < MAX_ROWS; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < MAX_COLS; iCol++) {
        row.push(CELL_EMPTY);
      }
      this.board.push(row);
    }
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

  private doIdle() {
    this.cmdInit();
    this.sendUpdate();
  }

  private doStart() {
    this.cmdInit();
    const startPlayerIdx = Randomize.generateInt(this.players.length);
    this.currentPlayerId = this.players[startPlayerIdx].id;
    this.sendUpdate();
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

        if (this.wonCells.length > 0) {
          // game finished
          const [col, row] = this.wonCells[0].split(",");
          const cellValue = this.getCell(col, row);
          this.wonPlayerId = this.getPlayerIdFromCellValue(cellValue);
          const wonPlayer = this.getPlayer(this.wonPlayerId);
          wonPlayer.score++;
          this.service.send("FINISH");
        } else {
          this.setNextCurrentPlayerId();
          this.sendUpdate();
        }
      }
    }
  }

  private doFinished(context, message) {
    this.currentPlayerId = "";
    this.sendUpdate();
  }

  private getCellValueForPlayer(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index < 0) {
      return 0;
    } else {
      return index + 1;
    }
  }

  private getPlayerIdFromCellValue(cellValue: string) {
    let idx = parseInt(cellValue);
    idx--;
    if (idx >= 0 && idx < this.players.length) {
      return this.players[idx].id;
    }
    return "";
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

  condStart(context, event) {
    return this.players.length > 0;
  }
}

export default GameFiveInARow;
