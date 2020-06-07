import GameBase from "../GameBase";
import { Machine, interpret, Interpreter } from "xstate";
import Player from "../../Player";
import Randomize from "../../Randomize";

const SCORE_VOTED_RIGHT = 2;
const SCORE_VOTED_FROM_OTHER = 3;

const machineConfiguration = {
  strict: true,
  id: "nobodysperfect",
  initial: "idle",
  states: {
    idle: {
      on: {
        ADD_PLAYER: { actions: ["doAddPlayer"] },
        START: {
          cond: "condStart",
          target: "pickQuestion",
          actions: ["doStart"],
        },
      },
    },
    pickQuestion: {
      on: {
        SET_QUESTION_AND_ANSWER: {
          target: "collectAnswers",
          actions: ["doSetQuestionAndAnswer"],
        },
      },
    },
    collectAnswers: {
      on: {
        ADD_ANSWER: {
          actions: ["doAddAnswer"],
        },
        START_VOTING: "collectVoting",
      },
    },

    collectVoting: {
      entry: ["doEnterCollectVoting"],
      on: {
        ADD_VOTE: {
          actions: ["doAddVote"],
        },
        FINISH: {
          target: "finish",
          actions: ["doFinish"],
        },
      },
    },

    finish: {
      on: {
        START: {
          cond: "condStart",
          target: "pickQuestion",
          actions: ["doStart"],
        },
      },
    },

    // createQuestion: {
    //   on: {
    //     FINISHED_CREATTE_QA: "doCollectAnswers",
    //   },
    // },
    // collectAnswers: {
    //   GOT_ANSWER: {
    //     actions: ["doGotAnswer"],
    //   },
    //   voteAnswers: {
    //     GOT_VOTE: {
    //       actions: ["doGotVote"],
    //     },
    //   },
    // },
  },
};

class GamePlayer extends Player {
  master: boolean = false;
  position: number = 0;
  answer: string;
  vote: number = -1;
}

class GameNobodyIsPerfect extends GameBase {
  service: Interpreter<any>;
  // playerIdMaster: string;
  question: string;
  answer: string;
  allAnswers: string[];
  allAnswersPlayerId: string[];

  constructor() {
    super();

    const machineOptions = {
      actions: {
        doStart: this.doStart.bind(this),
        doSetQuestionAndAnswer: this.doSetQuestionAndAnswer.bind(this),
        doAddAnswer: this.doAddAnswer.bind(this),
        doEnterCollectVoting: this.doEnterCollectVoting.bind(this),
        doAddVote: this.doAddVote.bind(this),
        doFinish: this.doFinish.bind(this),
      },
      guards: {
        condStart: this.condStart.bind(this),
      },
    };
    this.service = interpret(
      Machine(machineConfiguration, machineOptions)
    ).start();
  }

  static getName() {
    return "NobodyIsPerfect";
  }

  getGame() {
    const state = this.service.state.value;
    const players = this.players.map((p: GamePlayer) => {
      return {
        id: p.id,
        name: p.name,
        score: p.score,
        color: p.color,
        master: p.master,
        answered: !!p.answer,
        vote: p.vote,
        answer: state === "finish" ? p.answer : undefined,
      };
    });
    return {
      name: GameNobodyIsPerfect.getName(),
      state: state,
      players: players,
      question: this.question,
      allAnswers: this.allAnswers,
    };
  }

  public addPlayer(ws: any, playerId: string) {
    const player = new GamePlayer(ws, playerId);
    player.color = this.getUniquePlayerColor();
    this.players.push(player);
  }

  public removePlayer(playerId: string) {
    const player = this.getPlayer(playerId) as GamePlayer;
    this.players = this.players.filter((p) => p.id !== playerId);
    if (player.master) {
      // master is gone - create new master
      this.newMasterPlayer();
    }
  }

  message(message: any) {
    switch (message.cmd) {
      case "GAME_START":
        this.service.send("START");
        break;
      case "GAME_SET_QUESTION_AND_ANSWER":
        this.service.send("SET_QUESTION_AND_ANSWER", {
          question: message.question,
          answer: message.answer,
        });
        break;

      case "GAME_ADD_ANSWER":
        this.service.send("ADD_ANSWER", {
          playerId: message.playerId,
          answer: message.answer,
        });
        break;

      case "GAME_ADD_VOTE":
        this.service.send("ADD_VOTE", {
          playerId: message.playerId,
          vote: message.vote,
        });
        break;

      default:
        console.log("bad message:", message.cmd);
        return;
    }
    this.sendUpdate();
  }

  newMasterPlayer() {
    // set master to next player
    let idx = this.players.findIndex((p: GamePlayer) => p.master === true);
    idx++;
    if (idx < 0) {
      idx = 0;
    }
    if (idx >= this.players.length) {
      idx = 0;
    }
    const masterPlayer = this.players[idx] as GamePlayer;
    masterPlayer.master = true;
    return masterPlayer;
  }

  doStart(context, event) {
    const masterPlayer = this.newMasterPlayer();

    this.question = undefined;
    this.answer = undefined;
    this.allAnswers = undefined;
    this.players.forEach((p: GamePlayer) => {
      p.answer = undefined;
      p.vote = -1;
      p.master = p.id === masterPlayer.id ? true : false;
    });
  }
  doSetQuestionAndAnswer(context, event) {
    this.question = event.question;
    this.answer = event.answer;
  }

  doAddAnswer(context, event) {
    const playerId = event.playerId;
    const player = this.players.find((p) => p.id === playerId) as GamePlayer;
    if (!player) {
      return;
    }
    if (player.master) {
      // master not allowed to answer
      return;
    }

    player.answer = event.answer;
    const countAnswer = this.players.reduce((acc: number, p: GamePlayer) => {
      if (!!p.answer) {
        acc++;
      }
      return acc;
    }, 0);
    if (countAnswer + 1 === this.players.length) {
      // last player has answered
      this.service.send("START_VOTING");
    }
  }

  doEnterCollectVoting(context, event) {
    // collect all answers - also the right one

    let tmp: { answer: string; playerId: string }[] = [];
    this.players.forEach((p: GamePlayer) => {
      if (p.master) {
        tmp.push({ answer: this.answer, playerId: p.id });
      } else {
        tmp.push({ answer: p.answer, playerId: p.id });
      }
    });
    tmp = Randomize.shuffle(tmp);
    this.allAnswers = [];
    this.allAnswersPlayerId = [];
    tmp.forEach((val) => {
      this.allAnswers.push(val.answer);
      this.allAnswersPlayerId.push(val.playerId);
    });
  }

  doAddVote(context, event) {
    const player = this.getPlayer(event.playerId) as GamePlayer;
    if (player.master) {
      return;
    }
    if (event.vote < 0 || event.vote >= this.players.length) {
      // illegal vote
      return;
    }
    player.vote = event.vote;

    const countVote = this.players.reduce((acc: number, p: GamePlayer) => {
      if (p.vote >= 0) {
        acc++;
      }
      return acc;
    }, 0);
    if (countVote + 1 === this.players.length) {
      this.service.send("FINISH");
    }
  }

  doFinish(context, event) {
    const masterPlayer = this.players.find(
      (player: GamePlayer) => player.master
    );
    if (!masterPlayer) {
      throw new Error("master player not found");
    }

    const voteOk = this.allAnswersPlayerId.findIndex(
      (id) => id == masterPlayer.id
    );
    this.players.forEach((player: GamePlayer) => {
      if (!player.master) {
        if (player.vote == voteOk) {
          player.score += SCORE_VOTED_RIGHT;
        } else {
          const votedPlayerId = this.allAnswersPlayerId[player.vote];
          const otherPlayer = this.getPlayer(votedPlayerId);
          // to not score, if player votes its own answer
          if (player.id !== votedPlayerId) {
            otherPlayer.score += SCORE_VOTED_FROM_OTHER;
          }
        }
      }
    });
  }

  condStart(context, event) {
    return this.players.length >= 2;
  }
}

export default GameNobodyIsPerfect;
