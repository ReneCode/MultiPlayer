const fetch = require("node-fetch");

import { Server as SocketServer } from "socket.io";
import GameBase from "../GameBase";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";
import { Machine, interpret, Interpreter, send, actions } from "xstate";
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
          actions: "doStart",
        },
      },
    },
    searchTuple: {
      entry: "doSendUpdate",
      on: {
        PICK_TUPLE: {
          actions: "doPickTuple",
        },
        CORRECT_TUPLE: "showPickedCards",
      },
    },
    showPickedCards: {
      entry: "doSendUpdate",
      after: {
        SHOW_CORRECT_TUPLE_DELAY: "showRemovedCards",
      },
    },
    showRemovedCards: {
      entry: ["doRemoveTuple", "doSendUpdate"],
      after: {
        SHOW_REMOVED_CARDS_DELAY: "addCards",
      },
    },
    addCards: {
      entry: "doAddCards",
      on: {
        CONTINUE: "searchTuple",
        FINISH: "finish",
      },
    },
    finish: {
      entry: "doSendUpdate",
      on: {
        START: {
          target: "searchTuple",
          actions: "doStart",
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

  constructor(
    socketServer: SocketServer,
    {
      showCorrectTupleDelay,
      showRemovedCardsDelay,
    }: {
      showCorrectTupleDelay: number;
      showRemovedCardsDelay: number;
    } = { showCorrectTupleDelay: 6000, showRemovedCardsDelay: 1000 }
  ) {
    super(socketServer);

    const machineOptions = {
      actions: {
        doSendUpdate: this.doSendUpdate.bind(this),
        doStart: this.doStart.bind(this),
        doPickTuple: this.doPickTuple.bind(this),
        doRemoveTuple: this.doRemoveTuple.bind(this),
        doAddCards: this.doAddCards.bind(this),
      },
      delays: {
        SHOW_CORRECT_TUPLE_DELAY: () => showCorrectTupleDelay,
        SHOW_REMOVED_CARDS_DELAY: () => showRemovedCardsDelay,
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

      default:
        console.log("bad message:", message.cmd);
        return;
    }
  }

  private doSendUpdate() {
    this.sendUpdate();
  }

  private doStart(context, { skipShuffle }: { skipShuffle: boolean }) {
    this.initAllCards(skipShuffle);

    this.doAddCards();
    this.players.forEach((player) => {
      player.score = 0;
    });
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
      this.sendUpdate({ message: { gameId: this.gameId, cmd: "GOOD_PICK" } });
    } else {
      this.sendUpdate();
      const badPickMessage = {
        gameId: this.gameId,
        cmd: "BAD_PICK",
        playerId: playerId,
      };
      this.sendUpdate({ toPlayerId: playerId, message: badPickMessage });
    }
  }

  private doRemoveTuple() {
    this.pickedTuple.forEach((idx) => {
      this.board[idx] = undefined;
    });
  }

  /**
   * add Cards to the board
   * - minimal 12 cards
   * - at least one valid tuple on the board
   */
  private doAddCards() {
    let finished = false;

    const moreCardsAvilable = () => {
      return this.allCards.length > 0;
    };

    const addThreeCards = () => {
      let added = false;
      for (let i = 0; i < 3; i++) {
        if (this.allCards.length > 0) {
          added = true;
          const newCard = this.allCards.shift();
          const freeIdx = this.firstFreeIndexOnBoard();
          if (freeIdx >= 0) {
            this.board[freeIdx] = newCard;
          } else {
            this.board.push(newCard);
          }
        }
      }
      return added;
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

    let canAddCards = true;
    while (canAddCards && countCards() < 12) {
      canAddCards = addThreeCards();
    }

    let validTuple = this.findFirstValidTupleOnBoard();
    while (!validTuple && moreCardsAvilable()) {
      canAddCards = addThreeCards();
      validTuple = this.findFirstValidTupleOnBoard();
    }

    this.fillGapsOnBoard();

    validTuple = this.findFirstValidTupleOnBoard();

    if (validTuple) {
      console.log("found valid Tuple:", validTuple);
      this.service.send("CONTINUE");
    } else {
      this.service.send("FINISH");
    }
    this.pickedTuple = [];
  }

  private fillGapsOnBoard() {
    const countGaps = this.board.reduce((acc, c) => {
      if (!c) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    if (countGaps > 0) {
      // get the last 'countGaps' cards
      const cardsToMove = [];
      for (let i = this.board.length - countGaps; i < this.board.length; i++) {
        if (this.board[i]) {
          cardsToMove.push(this.board[i]);
        }
      }

      for (let card of cardsToMove) {
        const freeIndex = this.firstFreeIndexOnBoard();
        if (freeIndex >= 0) {
          this.board[freeIndex] = card;
        }
      }

      this.board = this.board.slice(0, this.board.length - countGaps);
    }
  }

  private initAllCards(skipShuffle: boolean) {
    this.allCards = [];
    this.pickedTuple = [];
    this.board = [];
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

  firstFreeIndexOnBoard() {
    return this.board.findIndex((c) => c === undefined);
  }

  findFirstValidTupleOnBoard() {
    const len = this.board.length;

    let validTuple = undefined;
    for (let i = 0; !validTuple && i < len - 2; i++) {
      for (let j = i + 1; !validTuple && j < len - 1; j++) {
        for (let k = j + 1; !validTuple && k < len; k++) {
          if (this.validTuple([i, j, k])) {
            validTuple = [i, j, k];
          }
        }
      }
    }
    return validTuple;
  }

  checkDuplicateCards() {
    for (let i = 0; i < this.board.length; i++) {
      const checkCard = this.board[i];
      if (checkCard) {
        for (let j = i + 1; j < this.board.length; j++) {
          const compareCard = this.board[j];
          if (compareCard) {
            if (this.cardsEqual(checkCard, compareCard)) {
              console.error(">>>> duplicateCards:", i, j, this.board);
            }
          }
        }
      }
    }
  }

  cardsEqual(c1: GameSetCard, c2: GameSetCard) {
    return (
      c1.color === c2.color &&
      c1.count === c2.count &&
      c1.fill === c2.fill &&
      c1.shape === c2.shape
    );
  }
}
