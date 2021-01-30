const fetch = require("node-fetch");

import GameBase from "../GameBase";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";
import { Machine, interpret, Interpreter } from "xstate";
import { Player } from "../Player";
import Randomize from "../Randomize";

const machineConfiguration = {
  strict: true,
  id: "GameSet",
  initial: "idle",
  states: {
    idle: {
      on: {
        START: {
          target: "searchTuple",
          actions: ["doStart"],
        },
      },
    },
    searchTuple: {
      on: {
        PICK_TUPLE: {
          actions: ["doPickTuple"],
        },
        SHOW_TUPLE: "showTuple",
        ADD_CARDS: {
          actions: "doAddCards",
          target: "searchTuple",
        },
      },
    },
    showTuple: {
      on: {
        ADD_CARDS: {
          actions: "doAddCards",
          target: "searchTuple",
        },
      },
    },
  },
};

export class GameSet extends GameBase {
  allCards: GameSetCard[] = [];
  pickedTuple: number[] = [];
  board: GameSetCard[] = [];
  service: Interpreter<any>;

  constructor() {
    super();
    const machineOptions = {
      actions: {
        doStart: this.doStart.bind(this),
        doPickTuple: this.doPickTuple.bind(this),
        doAddCards: this.doAddCards.bind(this),
      },
    };
    this.service = interpret(
      Machine(machineConfiguration, machineOptions)
    ).start();
  }

  static getName() {
    return "Set";
  }

  getGame(): DtoGameSet {
    return {
      gameId: this.gameId,
      name: GameSet.getName(),
      state: this.service.state.value,
      remainingCards: this.allCards.length,
      board: this.board,
      pickedTuple: this.pickedTuple,
      players: this.players.map((p) => p.getDtoPlayer()),
    };
  }

  message(message: any) {
    switch (message.cmd) {
      case "GAME_START":
        this.service.send("START", message);
        break;

      case "PICK_TUPLE":
        this.service.send("PICK_TUPLE", message);
        break;

      case "ADD_CARDS":
        this.service.send("ADD_CARDS");
        break;

      default:
        console.log("bad message:", message.cmd);
        return;
    }
    this.sendUpdate();
  }

  private doStart(context, { skipShuffle }: { skipShuffle: boolean }) {
    this.initAllCards(skipShuffle);

    const count = 12;
    this.board = [];
    for (let i = 0; i < count && this.allCards.length > 0; i++) {
      this.board.push(this.allCards.shift());
    }
    this.pickedTuple = [];
  }

  private doPickTuple(
    context,
    {
      playerId,
      cards: tuple,
    }: {
      playerId: string;
      cards: number[];
    }
  ) {
    if (tuple.length != 3) {
      return;
    }

    const checkIdx = (idx) => tuple[idx] >= 0 || tuple[idx] < this.board.length;

    const equalOrSame = (cards: number[], prop: string) => {
      const card1: GameSetCard = this.board[cards[0]];
      const card2: GameSetCard = this.board[cards[1]];
      const card3: GameSetCard = this.board[cards[2]];

      if (card1[prop] === card2[prop] && card1[prop] === card3[prop]) {
        return true;
      }
      if (
        card1[prop] !== card2[prop] &&
        card1[prop] !== card3[prop] &&
        card2[prop] !== card3[prop]
      ) {
        return true;
      }
      return false;
    };

    const pickOk =
      checkIdx(0) &&
      checkIdx(1) &&
      checkIdx(2) &&
      equalOrSame(tuple, "shape") &&
      equalOrSame(tuple, "color") &&
      equalOrSame(tuple, "count") &&
      equalOrSame(tuple, "fill");

    this.players.forEach((p) => {
      if (p.id === playerId) {
        if (pickOk) {
          p.score += 1;
        }
      }
    });
    if (pickOk) {
      this.pickedTuple = tuple.sort();
      this.service.send("SHOW_TUPLE");
    }
  }

  private doAddCards(context) {
    if (this.pickedTuple.length > 0) {
      this.pickedTuple.forEach((idx) => {
        if (this.allCards.length > 0) {
          this.board[idx] = this.allCards.shift();
        }
      });
      this.pickedTuple = [];
    } else {
      for (let i = 0; i < 3; i++) {
        if (this.allCards.length > 0) {
          this.board.push(this.allCards.shift());
        }
      }
    }
  }

  private initAllCards(skipShuffle: boolean) {
    [1, 2, 3].forEach((shape) => {
      [1, 2, 3].forEach((color) => {
        [1, 2, 3].forEach((count) => {
          [1, 2, 3].forEach((fill) => {
            const card: GameSetCard = {
              shape,
              color,
              count,
              fill,
            };
            this.allCards.push(card);
          });
        });
      });
    });
    console.log(">>>", this.allCards.length);
    if (!skipShuffle) {
      this.allCards = Randomize.shuffle(this.allCards);
    }
  }
}
