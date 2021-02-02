import React from "react";
import styled from "styled-components";

import { GameContainer, LeftSide, Button } from "../styledComponents";
import PlayerList from "../PlayerList";
import { Player } from "../../model/Player";
import Board from "./Board";
import { DtoGameSet } from "./DtoGameSet";

type Props = {
  playerId: string;
  players: Player[];
  game: DtoGameSet;
  sendMessage: (message: any) => void;
};

const GameSet: React.FC<Props> = ({ sendMessage, players, playerId, game }) => {
  const onStart = () => {
    sendMessage({
      cmd: "GAME_START",
    });
  };

  return (
    <GameContainer>
      <LeftSide>
        <PlayerList players={players} myPlayerId={playerId} showScore={true} />
        <Button onClick={onStart}>Start</Button>
      </LeftSide>
      <Board game={game} sendMessage={sendMessage}></Board>
    </GameContainer>
  );
};

export default GameSet;
