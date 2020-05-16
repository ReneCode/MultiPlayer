"use strict";
exports.__esModule = true;
var GameServer_1 = require("./GameServer");
describe("GameServer", function () {
    it("connect", function () {
        var playerId = GameServer_1["default"].connect("ABC");
        expect(playerId).toBeTruthy();
    });
    describe("createGame", function () {
        it("valid player", function () {
            var playerId = GameServer_1["default"].connect("ABC");
            var gameId = GameServer_1["default"].createGame(playerId);
            expect(gameId).toBeTruthy();
            var playerIds = GameServer_1["default"].getGamePlayerIds(gameId);
            expect(playerIds).toHaveLength(1);
            expect(playerIds).toContain(playerId);
        });
        it("invalid player", function () {
            GameServer_1["default"].connect("ABC");
            expect(function () { return GameServer_1["default"].createGame("badPlayerId"); }).toThrowError();
        });
    });
    describe("connectGame", function () {
        it("valid game, valid player", function () {
            var playerIdA = GameServer_1["default"].connect("A-con");
            var gameId = GameServer_1["default"].createGame(playerIdA);
            var playerIdB = GameServer_1["default"].connect("B-con");
            GameServer_1["default"].connectGame(playerIdB, gameId);
            var playerIds = GameServer_1["default"].getGamePlayerIds(gameId);
            expect(playerIds).toHaveLength(2);
            expect(playerIds).toContain(playerIdA);
            expect(playerIds).toContain(playerIdB);
        });
        it("bad gameId", function () {
            var playerIdA = GameServer_1["default"].connect("A-con");
            var gameId = GameServer_1["default"].createGame(playerIdA);
            var playerIdB = GameServer_1["default"].connect("B-con");
            expect(function () {
                return GameServer_1["default"].connectGame(playerIdB, "badGameId");
            }).toThrowError();
            var playerIds = GameServer_1["default"].getGamePlayerIds(gameId);
            expect(playerIds).toHaveLength(1);
            expect(playerIds).toContain(playerIdA);
        });
        it("can't connect twice", function () {
            var playerIdA = GameServer_1["default"].connect("A-con");
            var gameId = GameServer_1["default"].createGame(playerIdA);
            expect(function () { return GameServer_1["default"].connectGame(playerIdA, gameId); }).toThrowError();
            var playerIds = GameServer_1["default"].getGamePlayerIds(gameId);
            expect(playerIds).toHaveLength(1);
            expect(playerIds).toContain(playerIdA);
        });
    });
});
