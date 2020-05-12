import { Move, calcNewBoard, Token } from "./Game";

describe.skip("ludo", () => {
  it("empty board", () => {
    const tokens: Token[] = [];
    const move: Move = {
      token: {
        player: 1,
        position: 1,
      },
      steps: 5,
    };

    const newTokens = calcNewBoard(tokens, move);
    expect(newTokens).toBeNull();
  });

  it("move token not valid", () => {
    const tokens: Token[] = [{ player: 1, position: 4 }];
    const move: Move = {
      token: {
        player: 2,
        position: 1,
      },
      steps: 5,
    };

    const newTokens = calcNewBoard(tokens, move);
    expect(newTokens).toBeNull();
  });

  it("vaid step board", () => {
    const tokens: Token[] = [{ player: 1, position: 4 }];
    const move: Move = {
      token: {
        player: 1,
        position: 4,
      },
      steps: 5,
    };

    const newTokens = calcNewBoard(tokens, move);
    expect(newTokens).toBeTruthy();
  });
});
