const colors = require("colors");

import { wait } from "../../utils/wait";
import { GameSet } from "./GameSet";

describe.only("GameSet", () => {
  beforeAll(() => {
    colors.setTheme({
      messageIn: ["brightRed"],
      messageOut: ["green"],
    });
  });

  it("complete Set game", async () => {
    const game = new GameSet();
    game.addPlayer({}, "player-A");
    game.addPlayer({}, "player-B");
    game.addPlayer({}, "player-C");

    let g = game.getGame();
    const playerIdA = game.players[0].id;
    const playerIdB = game.players[1].id;
    const playerIdC = game.players[2].id;
    expect(g.state).toBe("idle");
    expect(g.name).toBe("Set");
    expect(g.board).toHaveLength(0);

    game.message({ cmd: "GAME_START", skipShuffle: true });
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.board).toHaveLength(12);
    expect(g.board[0]).toEqual({ shape: 1, color: 1, count: 1, fill: 1 });
    expect(g.board[3]).toEqual({ shape: 1, color: 1, count: 2, fill: 1 });
    expect(g.board[6]).toEqual({ shape: 1, color: 1, count: 3, fill: 1 });
    expect(g.players).toHaveLength(3);
    expect(g.players[0].score).toBe(0);

    // bad answer
    game.message({ cmd: "PICK_TUPLE", playerId: playerIdA, cards: [0, 2, 4] });
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.board).toHaveLength(12);
    expect(g.pickedTuple).toEqual([]);
    expect(g.players[0].score).toBe(-1);

    // first correct answer
    game.message({ cmd: "PICK_TUPLE", playerId: playerIdB, cards: [3, 0, 6] });
    g = game.getGame();
    expect(g.state).toBe("showTuple");
    expect(g.board).toHaveLength(12);
    expect(g.remainingCards).toEqual(69);
    expect(g.pickedTuple).toEqual([0, 3, 6]);
    expect(g.players[0].score).toBe(-1);
    expect(g.players[1].score).toBe(1);
    expect(g.players[2].score).toBe(0);
    expect(g.board[0]).toEqual({ shape: 1, color: 1, count: 1, fill: 1 });

    // second answer - will not be counted
    game.message({ cmd: "PICK_TUPLE", playerId: playerIdB, cards: [0, 1, 7] });
    g = game.getGame();
    expect(g.state).toBe("showTuple");
    expect(g.board).toHaveLength(12);
    expect(g.remainingCards).toEqual(69);
    expect(g.pickedTuple).toEqual([0, 3, 6]);
    expect(g.players[0].score).toBe(-1);
    expect(g.players[1].score).toBe(1);
    expect(g.players[2].score).toBe(0);

    await wait(2000);
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.board).toHaveLength(12);
    expect(g.remainingCards).toEqual(66);
    expect(g.board[0]).toEqual({ shape: 1, color: 2, count: 2, fill: 1 });
    expect(g.board[3]).toEqual({ shape: 1, color: 2, count: 2, fill: 2 });
    expect(g.board[6]).toEqual({ shape: 1, color: 2, count: 2, fill: 3 });

    // // add additional cards
    // game.message({ cmd: "ADD_CARDS" });
    // g = game.getGame();
    // console.log(g);
    // expect(g.board).toHaveLength(15);
    // expect(g.remainingCards).toEqual(63);
    // expect(g.board[12]).toEqual({ shape: 1, color: 2, count: 3, fill: 1 });
    // expect(g.board[13]).toEqual({ shape: 1, color: 2, count: 3, fill: 2 });
    // expect(g.board[14]).toEqual({ shape: 1, color: 2, count: 3, fill: 3 });
  });
});
