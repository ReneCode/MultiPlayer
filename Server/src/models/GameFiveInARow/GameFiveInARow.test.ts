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

  it("run 1-player normal game", () => {
    const game = new GameFiveInARow(createSocketMock(), {
      teamSize: 1,
      shuffleTeam: false,
    });

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

    expect(g.currentPlayerId).toBe("player-A");
    const playerFirstId = g.currentPlayerId;
    const playerAVal = 1;
    const playerBVal = 2;

    const colFirst = 0;
    const colSecond = 3;
    for (let iRow = 0; iRow < 4; iRow++) {
      game.message({
        cmd: "GAME_MOVE",
        playerId: "player-A",
        move: { col: colFirst, row: iRow },
      });
      g = game.getGame();
      expect(g.board[0][0]).toEqual(playerAVal);
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
      expect(g.board[colFirst][i]).toEqual(playerAVal);
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

    // expect(g.wonPlayerId).toEqual(playerFirstId);
    const wonPlayer = g.players.find((p) => p.id === playerFirstId);
    expect(wonPlayer).toHaveProperty("score", 1);

    // console.log(g);
  });

  it("Team Game 4 player ", () => {
    const game = new GameFiveInARow(createSocketMock(), {
      teamSize: 2,
      shuffleTeam: false,
    });

    game.addPlayer("player-A");
    game.addPlayer("player-B");
    game.addPlayer("player-C");
    game.addPlayer("player-D");
    const valA = 1;
    const valB = 2;
    const valC = 3;
    const valD = 4;
    game.message({ cmd: "GAME_START" });
    let g = game.getGame();
    expect(g.currentPlayerId).toBe("player-A");
    const colFirst = 0;
    const colSecond = 3;
    for (let iRow = 0; iRow < 4; iRow += 2) {
      // player A
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colFirst, row: iRow },
      });
      g = game.getGame();
      expect(g.board[colFirst][iRow]).toEqual(valA);
      expect(g.state).toEqual("started");

      // player B
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colFirst, row: iRow + 1 },
      });
      g = game.getGame();
      expect(g.board[colFirst][iRow + 1]).toEqual(valB);
      expect(g.wonPlayerId).toBeFalsy();

      // player C
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colSecond, row: iRow },
      });
      g = game.getGame();
      expect(g.board[colSecond][iRow]).toEqual(valC);

      // player D
      expect(g.currentPlayerId).toBe("player-D");
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colSecond, row: iRow + 1 },
      });
      g = game.getGame();
      expect(g.board[colSecond][iRow + 1]).toEqual(valD);
    }

    g = game.getGame();
    // final move to finish/win the game
    expect(g.currentPlayerId).toEqual("player-A");
    game.message({
      cmd: "GAME_MOVE",
      playerId: g.currentPlayerId,
      move: { col: colFirst, row: 4 },
    });
    g = game.getGame();
    for (let i = 0; i < 4; i++) {
      expect(g.wonCells[i]).toEqual(`${colFirst},${i}`);
    }
    expect(g.players[0]).toHaveProperty("score", 1);
    expect(g.players[1]).toHaveProperty("score", 1);
    expect(g.players[2]).toHaveProperty("score", 0);
    expect(g.players[3]).toHaveProperty("score", 0);
  });

  it("Team Game 1 player ", () => {
    const game = new GameFiveInARow(createSocketMock(), {
      teamSize: 2,
      shuffleTeam: false,
    });

    game.addPlayer("player-A");
    const valA = 1;
    game.message({ cmd: "GAME_START" });
    let g = game.getGame();
    expect(g.currentPlayerId).toBe("player-A");
    const colFirst = 0;
    const colSecond = 3;
    for (let iRow = 0; iRow < 4; iRow++) {
      // player A
      game.message({
        cmd: "GAME_MOVE",
        playerId: g.currentPlayerId,
        move: { col: colFirst, row: iRow },
      });
      g = game.getGame();
      expect(g.board[colFirst][iRow]).toEqual(valA);
    }

    g = game.getGame();
    // final move to finish/win the game
    game.message({
      cmd: "GAME_MOVE",
      playerId: g.currentPlayerId,
      move: { col: colFirst, row: 4 },
    });
    g = game.getGame();
    for (let i = 0; i < 4; i++) {
      expect(g.wonCells[i]).toEqual(`${colFirst},${i}`);
    }
    expect(g.players[0]).toHaveProperty("score", 1);
  });
});
