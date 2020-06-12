import React from "react";
import styled from "styled-components";

import { Button, GroupContainer } from "../style";
import PickQuestionAndAnswer from "./PickQuestionAndAnswer";
import AddAnswer from "./AddAnswer";
import VoteAnswers from "./VoteAnswers";
import PlayerName from "../PlayerName";
import Crown from "../icon/Crown";
import Waiting from "../icon/Waiting";
import Checkmark from "../icon/Checkmark";

const PlayerTable = styled.table`
  tr {
  }
`;

const PlayerStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GameContainer = styled.div`
  width: 600px;
`;

type Props = {
  playerId: string;

  game: {
    name: string;
    gameId: string;
    players: {
      id: string;
      name: string;
      color: string;
      score: string;
      master: boolean;
      answered: boolean;
      answer: string;
      vote: number;
    }[];
    question: string;
    allAnswers: { text: string; playerId: string }[];
    state:
      | "idle"
      | "pickQuestion"
      | "collectAnswers"
      | "collectVoting"
      | "finish";
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

  let topComponent = null;
  let actionComponent = null;
  switch (game.state) {
    case "idle":
      if (game.players.length >= 2) {
        topComponent = <Button onClick={handleStart}>Start</Button>;
      }
      break;

    case "pickQuestion":
      if (isMyselfMaster()) {
        actionComponent = (
          <PickQuestionAndAnswer onSet={handleSetQuestionAndAnswer} />
        );
      } else {
        actionComponent = (
          <GroupContainer>Question and answers are set ...</GroupContainer>
        );
      }
      break;

    case "collectAnswers":
      if (isMyselfMaster()) {
        actionComponent = (
          <GroupContainer>Answers are collected ...</GroupContainer>
        );
      } else {
        actionComponent = (
          <AddAnswer question={game.question} onSet={handleAddAnswer} />
        );
      }
      break;

    case "collectVoting":
      actionComponent = (
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
        topComponent = <Button onClick={handleStart}>Start</Button>;
      }

      actionComponent = (
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
      <PlayerTable>
        <tbody>
          {game.players.map((p) => {
            const playerWaiting =
              (game.state === "pickQuestion" && p.master) ||
              (game.state === "collectAnswers" && !p.master && !p.answered) ||
              (game.state === "collectVoting" && !p.master && p.vote < 0);

            const playerCheckmark =
              (game.state === "collectAnswers" && !p.master && p.answered) ||
              (game.state === "collectVoting" && !p.master && p.vote >= 0);
            return (
              <tr key={p.id}>
                <td>
                  <PlayerName player={p} me={p.id === playerId}></PlayerName>
                </td>
                <td> {p.score}</td>
                <td>{p.master && <Crown />}</td>
                {playerCheckmark && (
                  <td>
                    <Checkmark />
                  </td>
                )}
                {playerWaiting && (
                  <td>
                    <Waiting />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </PlayerTable>
      {topComponent}
      {actionComponent}
    </GameContainer>
  );
};

export default NobodyIsPerfect;
