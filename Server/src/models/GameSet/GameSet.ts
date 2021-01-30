const fetch = require("node-fetch");

import GameBase from "../GameBase";
import { DtoGameSet } from "./DtoGameSet";
import { Machine, interpret, Interpreter } from "xstate";
import { Player } from "../Player";
import Randomize from "../Randomize";

export class GameSet extends GameBase {
  board = [];
  constructor() {
    super();
  }

  static getName() {
    return "Set";
  }

  getGame(): DtoGameSet {
    const players = this.players.map((p) => {
      return {
        id: p.id,
        name: p.name,
        score: p.score,
        color: p.color,
      };
    });
    return {
      gameId: this.gameId,
      name: GameSet.getName(),
      board: this.board,
      players: players,
    };
  }

  message(message: any) {
    switch (message.cmd) {
      default:
        console.log("bad message:", message.cmd);
        return;
    }
    this.sendUpdate();
  }
}
