import React from "react";
import { Button, GroupContainer } from "../style";
import PickQuestionAndAnswer from "./PickQuestionAndAnswer";
import AddAnswer from "./AddAnswer";
import VoteAnswers from "./VoteAnswers";

interface DtoGame {
  gameId: string;
  players: any[];
}

type Props = {
  playerId: string;

  game: {
    name: string;
    gameId: string;
    players: any[];
    question: string;
    allAnswers: { text: string; color: string }[];
    state: string;
  };
  sendMessage: (message: any) => void;
};

const NobodyIsPerfect: React.FC<Props> = ({ playerId, game, sendMessage }) => {
  const handleStart = () => {
    sendMessage({ cmd: "GAME_START" });
  };

  const handleSetQuestionAndAnswer = (param: {
    question: string;
    answer: string;
  }) => {
    sendMessage({
      cmd: "GAME_SET_QUESTION_AND_ANSWER",
      question: param.question,
      answer: param.answer,
    });
  };

  const handleAddAnswer = (answer: string) => {
    sendMessage({
      cmd: "GAME_ADD_ANSWER",
      playerId: playerId,
      answer: answer,
    });
  };

  const handleVoteAnswer = (vote: number) => {
    sendMessage({
      cmd: "GAME_ADD_VOTE",
      playerId: playerId,
      vote: vote,
    });
  };

  const isMyselfMaster = () => {
    const master = game.players.find((p) => p.master);
    return master?.id === playerId;
  };

  let buttonComponent = null;
  let topComponent = null;
  switch (game.state) {
    case "idle":
      if (game.players.length >= 2) {
        buttonComponent = <Button onClick={handleStart}>Start</Button>;
      }
      break;

    case "pickQuestion":
      if (isMyselfMaster()) {
        topComponent = (
          <PickQuestionAndAnswer onSet={handleSetQuestionAndAnswer} />
        );
      } else {
        topComponent = (
          <GroupContainer>Question and answers are set ...</GroupContainer>
        );
      }
      break;

    case "collectAnswers":
      if (isMyselfMaster()) {
        topComponent = (
          <GroupContainer>Answers are collected ...</GroupContainer>
        );
      } else {
        topComponent = (
          <AddAnswer question={game.question} onSet={handleAddAnswer} />
        );
      }
      break;

    case "collectVoting":
      topComponent = (
        <VoteAnswers
          question={game.question}
          answers={game.allAnswers}
          players={game.players}
          onSet={handleVoteAnswer}
        />
      );
      break;

    case "finish":
      if (game.players.length >= 2) {
        buttonComponent = <Button onClick={handleStart}>Start</Button>;
      }

      topComponent = (
        <VoteAnswers
          question={game.question}
          answers={game.allAnswers}
          players={game.players}
        />
      );
      break;
  }

  return (
    <React.Fragment>
      <h4>NobodyIsPerfect</h4>
      {game.players.map((p) => {
        return (
          <div key={p.id}>
            <span>{p.name}</span>
            <span> Score:{p.score}</span>
            {p.master && <span> (master)</span>}
            {p.answered && <span> (answered) </span>}
            {p.vote >= 0 && <span> (voted) </span>}
          </div>
        );
      })}
      {buttonComponent}
      {topComponent}
    </React.Fragment>
  );
};

export default NobodyIsPerfect;
