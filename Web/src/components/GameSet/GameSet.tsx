import React, { useEffect, useMemo } from "react";

import { LeftSide } from "../styledComponents";
import PlayerList from "../PlayerList";
import { Player } from "../../model/Player";
import Board from "./Board";
import { DtoGameSet } from "./DtoGameSet";
import { Button } from "../style";
import { Sound } from "../../Sound";

import "./GameSet.scss";

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
        sound.play("ok", { delay: 0.5 });
        break;

      case "BAD_PICK":
        sound.play("bad", { delay: 0.5 });
        break;
    }
  }, [message, sound]);

  return (
    <div className="game">
      <LeftSide>
        <PlayerList players={players} myPlayerId={playerId} showScore={true} />
        <Button onClick={onStart}>Start</Button>
      </LeftSide>
      <Board game={game} sendMessage={sendMessage}></Board>
    </div>
  );
};

export default GameSet;
