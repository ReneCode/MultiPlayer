const fetch = require("node-fetch");

import GameBase from "../GameBase";
import { Machine, interpret, Interpreter } from "xstate";
import Player from "../Player";
import Randomize from "../Randomize";

class GameSet extends GameBase {
  constructor() {
    super();
  }

  static getName() {
    return "Set";
  }

  getGame() {
    const players = this.players.map((p) => {
      return {
        id: p.id,
        name: p.name,
        score: p.score,
        color: p.color,
      };
    });
    return {
      name: GameSet.getName(),
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

export default GameSet;
