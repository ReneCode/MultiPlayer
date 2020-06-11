import React from "react";
import styled from "styled-components";

import { Button, GroupContainer } from "../style";
import PickQuestionAndAnswer from "./PickQuestionAndAnswer";
import AddAnswer from "./AddAnswer";
import VoteAnswers from "./VoteAnswers";
import PlayerName from "../PlayerName";

const PlayerStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GameContainer = styled.div`
  width: 600px;
`;

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
    allAnswers: { text: string; playerId: string }[];
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
          // master not able to vote
          onSet={isMyselfMaster() ? undefined : handleVoteAnswer}
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
    <GameContainer>
      {game.players.map((p) => {
        return (
          <PlayerStatus key={p.id}>
            <PlayerName player={p}></PlayerName>
            <div> / </div>
            <span> score:{p.score}</span>
            {p.master && <span> (master)</span>}
            {p.answered && <span> (answered) </span>}
            {p.vote >= 0 && <span> (voted) </span>}
          </PlayerStatus>
        );
      })}
      {buttonComponent}
      {topComponent}
    </GameContainer>
  );
};

export default NobodyIsPerfect;
