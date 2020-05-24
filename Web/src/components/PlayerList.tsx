import React from "react";
import PlayerName from "./PlayerName";
import { Player } from "../model/Player";

type Props = {
  players: Player[];
};
const PlayerList: React.FC<Props> = ({ players }) => {
  return (
    <div>
      {players.map((player) => {
        return <PlayerName key={player.id} player={player} />;
      })}
    </div>
  );
};

export default PlayerList;
