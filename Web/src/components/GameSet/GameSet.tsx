import React, { useEffect, useMemo } from "react";

import { GameContainer, LeftSide } from "../styledComponents";
import PlayerList from "../PlayerList";
import { Player } from "../../model/Player";
import Board from "./Board";
import { DtoGameSet } from "./DtoGameSet";
import { Button } from "../style";
import { noteFrequencies, Sound } from "../../Sound";

type Props = {
  playerId: string;
  players: Player[];
  game: DtoGameSet;
  message: any;
  sendMessage: (message: any) => void;
};

const GameSet: React.FC<Props> = ({
  sendMessage,
  message,
  players,
  playerId,
  game,
}) => {
  const sound = useMemo(() => new Sound(), []);

  const onStart = () => {
    sendMessage({
      cmd: "GAME_START",
    });
  };

  useEffect(() => {
    switch (message.cmd) {
      case "GOOD_PICK":
        sound.playNote(noteFrequencies.Eb5, {
          length: 0.8,
          delay: 0.5,
        });
        sound.playNote(noteFrequencies.G5, {
          length: 0.8,
          delay: 0.6,
        });
        sound.playNote(noteFrequencies.Bb5, {
          length: 0.8,
          delay: 0.7,
        });
        sound.playNote(noteFrequencies.Eb6, {
          length: 0.8,
          delay: 0.8,
        });
        break;

      case "BAD_PICK":
        sound.playNote(noteFrequencies.Eb5, {
          length: 0.8,
          delay: 0.5,
        });
        sound.playNote(noteFrequencies.C5, {
          length: 0.8,
          delay: 0.7,
        });

        console.error("oh, bad pick");
        break;
    }
  }, [message]);

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
