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
    let g = game.getGame();

    expect(g.name).toBe("Set");
  });
});
