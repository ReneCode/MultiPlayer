const colors = require("colors");

import GameNobodyIsPerfect from "./GameNobodyIsPerfect";

describe("GameNobodyIsPerfect", () => {
  beforeAll(() => {
    colors.setTheme({
      messageIn: ["brightRed"],
      messageOut: ["green"],
    });
  });

  it("complete game", () => {
    const game = new GameNobodyIsPerfect();
    let g = game.getGame();
    expect(g.state).toBe("idle");

    // do not start, if no player is there
    game.message({ cmd: "GAME_START" });
    g = game.getGame();
    expect(g.state).toBe("idle");

    game.addPlayer({}, "player-A");
    game.addPlayer({}, "player-B");
    game.addPlayer({}, "player-C");
    g = game.getGame();

    expect(g.players).toHaveLength(3);
    expect(g.state).toBe("idle");
    expect(g.players[0]).toHaveProperty("master", false);
    expect(g.players[1]).toHaveProperty("master", false);
    expect(g.players[2]).toHaveProperty("master", false);
    expect(g.players[0]).toHaveProperty("score", 0);
    expect(g.players[1]).toHaveProperty("score", 0);
    expect(g.players[2]).toHaveProperty("score", 0);

    // start the game - first: pickQuestion
    game.message({ cmd: "GAME_START" });
    g = game.getGame();
    expect(g.state).toBe("pickQuestion");
    expect(g.players[0]).toHaveProperty("master", true);
    expect(g.players[1]).toHaveProperty("master", false);
    expect(g.players[1]).toHaveProperty("master", false);

    const questionText = "what is the aim of life?";
    const answerOk = "42";
    const answerA = "a-answer";
    const answerB = "b-answer";
    const answerC = "c-answer";
    game.message({
      cmd: "GAME_SET_QUESTION_AND_ANSWER",
      question: questionText,
      answer: answerOk,
    });
    g = game.getGame();
    expect(g.state).toBe("collectAnswers");
    expect(g.question).toBe(questionText);

    // master not able to answer
    game.message({
      cmd: "GAME_ADD_ANSWER",
      playerId: "player-A",
      answer: answerA,
    });
    g = game.getGame();
    expect(g.state).toBe("collectAnswers");
    expect(g.players[0]).toHaveProperty("answered", false);

    // B answered
    game.message({
      cmd: "GAME_ADD_ANSWER",
      playerId: "player-B",
      answer: answerB,
    });
    g = game.getGame();
    expect(g.state).toBe("collectAnswers");
    expect(g.players[0]).toHaveProperty("answered", false);
    expect(g.players[1]).toHaveProperty("answered", true);
    expect(g.players[2]).toHaveProperty("answered", false);

    // C answered
    game.message({
      cmd: "GAME_ADD_ANSWER",
      playerId: "player-C",
      answer: answerC,
    });
    g = game.getGame();
    expect(g.state).toBe("collectVoting");
    expect(g.players[0]).toHaveProperty("answered", false);
    expect(g.players[1]).toHaveProperty("answered", true);
    expect(g.players[2]).toHaveProperty("answered", true);

    // that are the shuffled answers
    const answers = g.allAnswers;
    expect(answers).toHaveLength(3);
    expect(answers).toContain(answerOk);
    expect(answers).toContain(answerB);
    expect(answers).toContain(answerC);

    // voting
    // master not allowed to vote
    game.message({
      cmd: "GAME_ADD_VOTE",
      playerId: "player-A",
      vote: 0,
    });
    g = game.getGame();
    expect(g.state).toBe("collectVoting");
    expect(g.players[0]).toHaveProperty("vote", -1);

    // B voted the ok
    const voteForOk = g.allAnswers.indexOf(answerOk);
    game.message({
      cmd: "GAME_ADD_VOTE",
      playerId: "player-B",
      vote: voteForOk,
    });
    g = game.getGame();
    expect(g.state).toBe("collectVoting");
    expect(g.players[1]).toHaveProperty("vote", voteForOk);

    // illegal vote
    game.message({
      cmd: "GAME_ADD_VOTE",
      playerId: "player-C",
      vote: 3,
    });
    g = game.getGame();
    expect(g.state).toBe("collectVoting");
    expect(g.players[2]).toHaveProperty("vote", -1);

    // final vote - calculate score
    const voteForB = g.allAnswers.indexOf(answerB);
    game.message({
      cmd: "GAME_ADD_VOTE",
      playerId: "player-C",
      vote: voteForB,
    });
    g = game.getGame();
    expect(g.state).toBe("finish");
    expect(g.players[2]).toHaveProperty("vote", voteForB);
    expect(g.players[0]).toHaveProperty("score", 0);
    // B voted correct +2  and  it's answer was voted +3
    expect(g.players[1]).toHaveProperty("score", 2 + 3);
    expect(g.players[2]).toHaveProperty("score", 0);

    // new game , next round
    game.message({ cmd: "GAME_START" });
    g = game.getGame();
    expect(g.state).toBe("pickQuestion");
    expect(g.players[0]).toHaveProperty("master", false);
    expect(g.players[1]).toHaveProperty("master", true);
    expect(g.players[2]).toHaveProperty("master", false);

    expect(g.players[0]).toHaveProperty("score", 0);
    expect(g.players[1]).toHaveProperty("score", 2 + 3);
    expect(g.players[2]).toHaveProperty("score", 0);
  });
});
