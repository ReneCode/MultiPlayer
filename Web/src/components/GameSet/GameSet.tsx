import React from "react";
import { Player } from "../../model/Player";

type Props = {
  playerId: string;
  game: {
    name: string;
    gameId: string;
    players: Player[];
  };
  sendMessage: (message: any) => void;
};

const GameSet: React.FC<Props> = ({ sendMessage, playerId, game }) => {
  return <div>hello</div>;
};

export default GameSet;
