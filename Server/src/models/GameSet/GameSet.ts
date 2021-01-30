const fetch = require("node-fetch");

import GameBase from "../GameBase";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";
import { Machine, interpret, Interpreter } from "xstate";
import { Player } from "../Player";
import Randomize from "../Randomize";

export class GameSet extends GameBase {
  allCards: GameSetCard[] = [];
  pickedCards: number[] = [];
  board: GameSetCard[] = [];

  static getName() {
    return "Set";
  }

  getGame(): DtoGameSet {
    return {
      gameId: this.gameId,
      name: GameSet.getName(),
      board: this.board,
      pickedCards: this.pickedCards,
      players: this.players.map((p) => p.getDtoPlayer()),
    };
  }

  message(message: any) {
    switch (message.cmd) {
      case "GAME_START":
        this.doGameStart(message);
        break;

      case "PICK_CARDS":
        this.doPickCards(message);
        break;

      default:
        console.log("bad message:", message.cmd);
        return;
    }
    this.sendUpdate();
  }

  private doGameStart({ skipShuffle }: { skipShuffle: boolean }) {
    this.initAllCards(skipShuffle);
    this.fillBoardWithCards(12);
    this.pickedCards = [];
  }

  private doPickCards({
    playerId,
    cards,
  }: {
    playerId: string;
    cards: number[];
  }) {
    if (cards.length != 3) {
      return;
    }
    if (this.pickedCards.length !== 0) {
      // allready picked
      return;
    }

    const checkIdx = (idx) => cards[idx] >= 0 || cards[idx] < this.board.length;

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
      equalOrSame(cards, "shape") &&
      equalOrSame(cards, "color") &&
      equalOrSame(cards, "count") &&
      equalOrSame(cards, "fill");

    if (pickOk) {
      this.pickedCards = cards.sort();
    }

    this.players.forEach((p) => {
      if (p.id === playerId) {
        if (pickOk) {
          p.score += 1;
        }
      }
    });
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

  private fillBoardWithCards(count: number) {
    this.board = [];
    for (let i = 0; i < count && this.allCards.length > 0; i++) {
      this.board.push(this.allCards.shift());
    }
  }
}
