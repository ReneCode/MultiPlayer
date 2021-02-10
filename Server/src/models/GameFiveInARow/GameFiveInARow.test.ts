const colors = require("colors");

import GameFiveInARow from "./GameFiveInARow";
import { createSocketMock } from "../socketMock";

describe("GameFiveInARow", () => {
  beforeAll(() => {
    colors.setTheme({
      messageIn: ["brightRed"],
      messageOut: ["green"],
    });
  });

  it("createCheckCells", () => {
    const game = new GameFiveInARow(createSocketMock());

    let g = game.getGame();
    expect(g.state).toEqual("idle");

    game.message({ cmd: "GAME_START" });
    g = game.getGame();
    expect(g.state).toEqual("idle");

    game.addPlayer("player-A");
    game.addPlayer("player-B");
    game.message({ cmd: "GAME_START" });
    g = game.getGame();
    expect(g.state).toEqual("started");
    expect(g.players).toHaveLength(2);
    expect(g.players[0]).toHaveProperty("score", 0);
    expect(g.players[1]).toHaveProperty("score", 0);

    expect(["player-A", "player-B"]).toContain(g.currentPlayerId);
    const playerFirstId = g.currentPlayerId;
    const playerValFirst =
      game.players.findIndex((p) => p.id === g.currentPlayerId) + 1;
    const colFirst = 0;
    const colSecond = 3;
    for (let iRow = 0; iRow < 4; iRow++) {
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colFirst, row: iRow },
      });
      g = game.getGame();
      expect(g.board[0][0]).toEqual(playerValFirst);
      expect(g.state).toEqual("started");

      // second player
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colSecond, row: iRow },
      });
      g = game.getGame();

      expect(g.currentPlayerId).toBeTruthy();
      expect(g.wonPlayerId).toBeFalsy();
      expect(g.wonCells).toHaveLength(0);
      expect(g.lastMovedCell).toEqual({ col: colSecond, row: iRow });
    }

    // check the moves placed on the board
    for (let i = 0; i < 4; i++) {
      expect(g.board[colFirst][i]).toEqual(playerValFirst);
    }

    // final move to finish/win the game
    expect(g.currentPlayerId).toEqual(playerFirstId);
    game.message({
      cmd: "GAME_MOVE",
      playerId: g.currentPlayerId,
      move: { col: colFirst, row: 4 },
    });
    g = game.getGame();
    for (let i = 0; i < 4; i++) {
      expect(g.wonCells[i]).toEqual(`${colFirst},${i}`);
    }
    expect(g.currentPlayerId).toBeFalsy();
    expect(g.state).toEqual("finished");

    expect(g.wonPlayerId).toEqual(playerFirstId);
    const wonPlayer = g.players.find((p) => p.id === playerFirstId);
    expect(wonPlayer).toHaveProperty("score", 1);

    // console.log(g);
  });
});
