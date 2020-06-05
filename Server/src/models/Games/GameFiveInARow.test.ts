import GameFiveInARow from "./GameFiveInARow";

describe("GameFiveInARow", () => {
  it("createCheckCells", () => {
    const game = new GameFiveInARow();

    const cells = game["getCheckCells"]();
    // console.log(cells);
  });
});
