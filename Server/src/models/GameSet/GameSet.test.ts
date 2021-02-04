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
    const showCorrectTupleDelay = 50;
    const showRemovedCardsDelay = 50;
    const game = new GameSet({ showCorrectTupleDelay, showRemovedCardsDelay });
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
    expect(g.state).toBe("showPickedCards");
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
    expect(g.state).toBe("showPickedCards");
    expect(g.board).toHaveLength(12);
    expect(g.remainingCards).toEqual(69);
    expect(g.pickedTuple).toEqual([0, 3, 6]);
    expect(g.players[0].score).toBe(-1);
    expect(g.players[1].score).toBe(1);
    expect(g.players[2].score).toBe(0);

    // remove cards
    await wait(showCorrectTupleDelay);
    g = game.getGame();
    expect(g.state).toBe("showRemovedCards");
    expect(g.board).toHaveLength(12);
    expect(g.remainingCards).toEqual(69);
    expect(g.board[0]).toBeUndefined();
    expect(g.board[3]).toBeUndefined();
    expect(g.board[6]).toBeUndefined();

    // show new cards in the open positions
    await wait(showRemovedCardsDelay);
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.remainingCards).toEqual(66);
    expect(g.board[0]).toEqual({ shape: 1, color: 2, count: 2, fill: 1 });
    expect(g.board[3]).toEqual({ shape: 1, color: 2, count: 2, fill: 2 });
    expect(g.board[6]).toEqual({ shape: 1, color: 2, count: 2, fill: 3 });

    for (let i = 0; i < 23; i++) {
      g = game.getGame();
      expect(g.remainingCards).toEqual(66 - 3 * i);
      game.message({
        cmd: "PICK_TUPLE",
        playerId: playerIdC,
        cards: [1, 4, 7],
      });
      await wait(showCorrectTupleDelay);
      await wait(showRemovedCardsDelay);
    }
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.remainingCards).toBe(0);
    expect(g.players[2].score).toBe(23);

    game.message({
      cmd: "PICK_TUPLE",
      playerId: playerIdB,
      cards: [0, 3, 6],
    });
    await wait(showCorrectTupleDelay);
    await wait(showRemovedCardsDelay);

    game.message({
      cmd: "PICK_TUPLE",
      playerId: playerIdB,
      cards: [9, 10, 11],
    });
    await wait(showCorrectTupleDelay);
    await wait(showRemovedCardsDelay);

    game.message({
      cmd: "PICK_TUPLE",
      playerId: playerIdB,
      cards: [2, 5, 8],
    });
    await wait(showCorrectTupleDelay);
    await wait(showRemovedCardsDelay);

    g = game.getGame();
    expect(g.state).toBe("finish");

    game.message({
      cmd: "GAME_START",
    });
    g = game.getGame();
    expect(g.state).toBe("searchTuple");
    expect(g.remainingCards).toBe(81 - 12);
    expect(g.players[0].score).toBe(0);
    expect(g.players[1].score).toBe(0);
    expect(g.players[2].score).toBe(0);
  }, 10_000);
});
