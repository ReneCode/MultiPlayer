const fetch = require("node-fetch");

import GameBase from "../GameBase";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";
import { Machine, interpret, Interpreter, send, actions } from "xstate";
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
        CORRECT_TUPLE: "showTuple",
      },
    },
    showTuple: {
      entry: send("REMOVE_TUPLE", { delay: 2000 }),
      on: {
        REMOVE_TUPLE: {
          actions: ["doRemoveTuple", "doSendUpdate"],
          target: "removedTuple",
        },
      },
    },
    removedTuple: {
      entry: send("ADD_CARDS", { delay: 1000 }),
      on: {
        ADD_CARDS: {
          actions: ["doAddCards", "doSendUpdate"],
          target: "addCards",
        },
      },
    },
    addCards: {
      on: {
        CONTINUE: "searchTuple",
        FINISH: "finish",
      },
    },
    finish: {
      entry: "doFinish",
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
        doSendUpdate: this.doSendUpdate.bind(this),
        doStart: this.doStart.bind(this),
        doPickTuple: this.doPickTuple.bind(this),
        doRemoveTuple: this.doRemoveTuple.bind(this),
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

  private doSendUpdate() {
    console.log("<<< sendUpdate");
    this.sendUpdate();
  }

  private doStart(context, { skipShuffle }: { skipShuffle: boolean }) {
    this.initAllCards(skipShuffle);

    this.doAddCards();
    // const count = 12;
    // this.board = [];
    // for (let i = 0; i < count && this.allCards.length > 0; i++) {
    //   this.board.push(this.allCards.shift());
    // }
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

    const valid = this.validTuple(tuple);
    this.players = this.players.map((p) => {
      if (p.id === playerId)
        if (valid) {
          p.score += 1;
        } else {
          p.score -= 1;
        }
      return p;
    });
    if (valid) {
      this.pickedTuple = tuple.sort();
      this.service.send("CORRECT_TUPLE");
    }
  }

  private doRemoveTuple() {
    this.pickedTuple.forEach((idx) => {
      this.board[idx] = undefined;
    });
    this.sendUpdate();
  }

  /**
   * add Cards to the board
   * - minimal 12 cards
   * - at least one valid tuple on the board
   */
  private doAddCards() {
    console.log("<<< doAddCards", this.allCards.length);
    let finished = false;

    const addThreeCards = () => {
      let added = false;
      for (let i = 0; i < 3; i++) {
        if (this.allCards.length > 0) {
          added = true;
          const newCard = this.allCards.shift();
          if (this.pickedTuple.length > 0) {
            const idx = this.pickedTuple.shift();
            this.board[idx] = newCard;
          } else {
            this.board.push(newCard);
          }
        }
      }
      return added;
    };

    const validTupleOnBoard = () => {
      const len = this.board.length;

      let valid = false;
      for (let i = 0; !valid && i < len - 2; i++) {
        for (let j = i + 1; !valid && j < len - 1; j++) {
          for (let k = j + 1; !valid && k < len; k++) {
            if (this.validTuple([i, j, k])) {
              valid = true;
            }
          }
        }
      }
      return valid;
    };

    const countCards = () => {
      return this.board.reduce((acc, c) => {
        if (c) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    };

    console.log("<< count:", countCards, this.board);
    while (countCards() < 12) {
      const added = addThreeCards();
    }

    const valid = validTupleOnBoard();

    if (valid) {
      this.service.send("CONTINUE");
    } else {
      this.service.send("FINISH");
    }
    this.pickedTuple = [];
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
    if (!skipShuffle) {
      this.allCards = Randomize.shuffle(this.allCards);
    }
  }

  private validTuple = (tuple: number[]) => {
    if (tuple.length != 3) {
      return;
    }

    const checkIdx = (idx) => tuple[idx] >= 0 || tuple[idx] < this.board.length;

    const equalOrSame = (cards: number[], prop: string) => {
      const card1: GameSetCard = this.board[cards[0]];
      const card2: GameSetCard = this.board[cards[1]];
      const card3: GameSetCard = this.board[cards[2]];

      if (!card1 || !card2 || !card3) {
        return false;
      }

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

    const valid =
      checkIdx(0) &&
      checkIdx(1) &&
      checkIdx(2) &&
      equalOrSame(tuple, "shape") &&
      equalOrSame(tuple, "color") &&
      equalOrSame(tuple, "count") &&
      equalOrSame(tuple, "fill");
    return valid;
  };
}
