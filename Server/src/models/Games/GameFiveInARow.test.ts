import GameFiveInARow from "./GameFiveInARow";
import GameConnector from "../GameConnector";

describe("GameFiveInARow", () => {
  it("createCheckCells", () => {
    var connector: GameConnector = {} as GameConnector;
    const game = new GameFiveInARow(connector, "id");

    const cells = game["getCheckCells"]();
    // console.log(cells);
  });
});
