import GameBase from "./GameBase";
import GameConnector from "../GameConnector";
import { Machine, interpret, Interpreter } from "xstate";
import Randomize from "../Randomize";

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
    console.log(message);
    if (message.playerId === this.currentPlayerId) {
      const col = message.move.col;
      const row = message.move.row;
      const ok = col >= 0 && col < MAX_COLS && row >= 0 && row < MAX_ROWS;
      if (ok) {
        const oldVal = this.getCell(row, col);
        if (oldVal === CELL_EMPTY) {
          const val = this.getCellValueForPlayer(message.playerId);
          if (val) {
            this.setCell(row, col, val);

            this.setNextCurrentPlayerId();

            this.sendUpdate();
          }
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
}

export default GameFiveInARow;
