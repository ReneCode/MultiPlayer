import React from "react";
import styled from "styled-components";

import PlayerName from "../PlayerName";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  players: { name: string; color: string; id: string }[];
};
const PlayerNames: React.FC<Props> = ({ players }) => {
  // const text = names.join(",");

  return (
    <Container>
      {players.map((player) => {
        return <PlayerName key={player.id} player={player} />;
      })}
    </Container>
  );
};

export default PlayerNames;
