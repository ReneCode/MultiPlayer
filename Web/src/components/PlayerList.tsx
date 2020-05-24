import React from "react";

type Props = {
  players: any[];
};
const PlayerList: React.FC<Props> = ({ players }) => {
  return (
    <ul>
      {players.map((player) => {
        return <li key={player.id}>{player.id}</li>;
      })}
    </ul>
  );
};

export default PlayerList;
