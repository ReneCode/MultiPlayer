import React from "react";
import PlayerName from "./PlayerName";
import { Player } from "../model/Player";

type Props = {
  players: Player[];
  myPlayerId: string;
};
const PlayerList: React.FC<Props> = ({ players, myPlayerId }) => {
  return (
    <div>
      {players.map((player) => {
        return (
          <PlayerName
            key={player.id}
            player={player}
            me={player.id === myPlayerId}
          />
        );
      })}
    </div>
  );
};

export default PlayerList;
