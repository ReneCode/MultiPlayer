import React from "react";
import styled from "styled-components";

import PlayerName from "./PlayerName";
import Waiting from "../components/icon/Waiting";
import { Player } from "../model/Player";

const Table = styled.table`
  tr {
  }
`;

const Score = styled.td`
  padding-left: 8px;
  padding-right: 8px;
`;

type Props = {
  players: Player[];
  myPlayerId: string;
  currentTurnPlayerId?: string;
  showScore?: boolean;
};
const PlayerList: React.FC<Props> = ({
  players,
  myPlayerId,
  currentTurnPlayerId,
  showScore,
}) => {
  return (
    <div>
      <h3>Player List</h3>
      <Table>
        <tbody>
          {players.map((player) => {
            return (
              <tr key={player.id}>
                <td>
                  <PlayerName
                    key={player.id}
                    player={player}
                    me={player.id === myPlayerId}
                  />
                </td>
                {showScore && <Score>{player.score}</Score>}
                <td>
                  {currentTurnPlayerId === player.id ? (
                    <Waiting color={player.color} />
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PlayerList;
