import { gameServer } from "./GameServer";

describe("GameServer", () => {
  const wss = {};
  // const gameServer = new GameServer(wss);

  it("connect", () => {
    // const playerId = gameServer.connectPlayer("ABC");
    // expect(playerId).toBeTruthy();
  });

  describe("createGame", () => {
    it("valid player", () => {
      // const playerId = gameServer.connectPlayer("ABC");
      // const gameId = gameServer.createGame("TicTacToe");
      // expect(gameId).toBeTruthy();
      // const playerIds = gameServer.getGamePlayerIds(gameId);
      // expect(playerIds).toHaveLength(1);
      // expect(playerIds).toContain(playerId);
    });

    it("invalid player", () => {
      // gameServer.connectPlayer("ABC");
      // expect(() => gameServer.createGame("badPlayerId")).toThrowError();
    });
  });

  // describe("connectGame", () => {
  //   it("valid game, valid player", () => {
  //     const playerIdA = gameServer.connect("A-con");
  //     const gameId = gameServer.createGame(playerIdA);

  //     const playerIdB = gameServer.connect("B-con");
  //     gameServer.connectGame(playerIdB, gameId);
  //     const playerIds = gameServer.getGamePlayerIds(gameId);
  //     expect(playerIds).toHaveLength(2);
  //     expect(playerIds).toContain(playerIdA);
  //     expect(playerIds).toContain(playerIdB);
  //   });

  //   it("bad gameId", () => {
  //     const playerIdA = gameServer.connect("A-con");
  //     const gameId = gameServer.createGame(playerIdA);

  //     const playerIdB = gameServer.connect("B-con");
  //     expect(() =>
  //       gameServer.connectGame(playerIdB, "badGameId")
  //     ).toThrowError();
  //     const playerIds = gameServer.getGamePlayerIds(gameId);
  //     expect(playerIds).toHaveLength(1);
  //     expect(playerIds).toContain(playerIdA);
  //   });

  //   it("can't connect twice", () => {
  //     const playerIdA = gameServer.connect("A-con");
  //     const gameId = gameServer.createGame(playerIdA);

  //     expect(() => gameServer.connectGame(playerIdA, gameId)).toThrowError();
  //     const playerIds = gameServer.getGamePlayerIds(gameId);
  //     expect(playerIds).toHaveLength(1);
  //     expect(playerIds).toContain(playerIdA);
  //   });
  // });
});
