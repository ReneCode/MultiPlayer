const colors = require("colors");
import { createSocketMock } from "../socketMock";

import { wait } from "../../utils/wait";
import { GameSetCard } from "./DtoGameSet";
import { GameSet } from "./GameSet";

const createGameSetCard = (nr: number): GameSetCard => {
  return { shape: nr, color: nr, count: nr, fill: nr };
};

describe.only("GameSet", () => {
  beforeAll(() => {
    colors.setTheme({
      messageIn: ["brightRed"],
      messageOut: ["green"],
    });
  });

  it("fillGapsOnBoard-1", () => {
    const game = new GameSet(undefined);
    game.board = [
      createGameSetCard(1),
      createGameSetCard(2),
      undefined,
      createGameSetCard(4),
      createGameSetCard(5),
      undefined,
      createGameSetCard(7),
      createGameSetCard(8),
      createGameSetCard(9),
    ];

    game["fillGapsOnBoard"]();
    expect(game.board).toHaveLength(7);
    expect(game.board).toEqual([
      createGameSetCard(1),
      createGameSetCard(2),
      createGameSetCard(8),
      createGameSetCard(4),
      createGameSetCard(5),
      createGameSetCard(9),
      createGameSetCard(7),
    ]);
  });

  it("fillGapsOnBoard-2", () => {
    const game = new GameSet(undefined);
    game.board = [
      undefined,
      createGameSetCard(1),
      createGameSetCard(2),
      undefined,
      createGameSetCard(4),
      createGameSetCard(5),
      undefined,
      createGameSetCard(7),
      createGameSetCard(8),
    ];

    game["fillGapsOnBoard"]();
    expect(game.board).toEqual([
      createGameSetCard(7),
      createGameSetCard(1),
      createGameSetCard(2),
      createGameSetCard(8),
      createGameSetCard(4),
      createGameSetCard(5),
    ]);
  });

  it("complete Set game", async () => {
    const showCorrectTupleDelay = 50;
    const showRemovedCardsDelay = 50;

    const game = new GameSet(createSocketMock(), {
      showCorrectTupleDelay,
      showRemovedCardsDelay,
    });
    game.addPlayer("player-A");
    game.addPlayer("player-B");
    game.addPlayer("player-C");

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
      cards: [0, 1, 4],
    });
    await wait(showCorrectTupleDelay);
    await wait(showRemovedCardsDelay);

    game.message({
      cmd: "PICK_TUPLE",
      playerId: playerIdB,
      cards: [0, 1, 2],
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
