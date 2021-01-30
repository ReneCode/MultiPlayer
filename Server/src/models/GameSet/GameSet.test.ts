const colors = require("colors");

import { GameSet } from "./GameSet";

describe("GameSet", () => {
  beforeAll(() => {
    colors.setTheme({
      messageIn: ["brightRed"],
      messageOut: ["green"],
    });
  });

  it("complete Set game", () => {
    const game = new GameSet();
    game.addPlayer({}, "player-A");
    game.addPlayer({}, "player-B");
    game.addPlayer({}, "player-C");

    let g = game.getGame();
    const playerIdA = game.players[0].id;
    const playerIdB = game.players[1].id;
    const playerIdC = game.players[2].id;
    expect(g.name).toBe("Set");
    expect(g.board).toHaveLength(0);

    game.message({ cmd: "GAME_START", skipShuffle: true });
    g = game.getGame();
    expect(g.board).toHaveLength(12);
    expect(g.board[0]).toEqual({ shape: 1, color: 1, count: 1, fill: 1 });
    expect(g.board[3]).toEqual({ shape: 1, color: 1, count: 2, fill: 1 });
    expect(g.board[6]).toEqual({ shape: 1, color: 1, count: 3, fill: 1 });
    expect(g.players).toHaveLength(3);
    expect(g.players[0].score).toBe(0);

    game.message({ cmd: "PICK_CARDS", playerId: playerIdA, cards: [3, 0, 6] });
    g = game.getGame();
    expect(g.board).toHaveLength(12);
    expect(g.pickedCards).toEqual([0, 3, 6]);
    expect(g.players[0].score).toBe(1);

    game.message({ cmd: "PICK_CARDS", playerId: playerIdB, cards: [0, 1, 2] });
    g = game.getGame();
    console.log(g);
    expect(g.board).toHaveLength(12);
    expect(g.pickedCards).toEqual([0, 3, 6]);
    expect(g.players[0].score).toBe(1);

    game.message({ cmd: "NEW_CARDS" });
    g = game.getGame();
    console.log(g);
    expect(g.board).toHaveLength(12);
  });
});
