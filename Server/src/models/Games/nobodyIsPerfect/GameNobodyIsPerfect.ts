import GameBase from "../GameBase";

const machineConfiguration = {
  id: "nobodysperfect",
  initial: "idle",
  state: {
    idle: {
      on: {
        START: "createQuestion",
      },
    },
    createQuestion: {
      on: {
        FINISHED_CREATTE_QA: "collectAnswers",
      },
    },
    collectAnswers: {
      GOT_ANSWER: {
        actions: ["gotAnswer"],
      },
      voteAnswers: {
        GOT_VOTE: {
          actions: ["gotVote"],
        },
      },
    },
  },
};

class GameNobodyIsPerfect extends GameBase {}

export default GameNobodyIsPerfect;
