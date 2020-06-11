import React from "react";

import styled from "styled-components";

const PlayerNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Color = styled.div`
  width: 0.9rem;
  height: 0.9rem;
  background-color: ${(props) => props.color};
  border: 0.1rem solid gray;
  border-radius: 50px;
  margin: 5px;
`;

const MeMarker = styled.div`
  margin-left: 4px;
`;

type Props = {
  player: { name: string; color: string };
  withColor?: boolean;
  me?: boolean;
};

const PlayerName: React.FC<Props> = ({ player, me, children }) => {
  return (
    <PlayerNameContainer>
      <Color color={player.color} />
      <div>{player.name}</div>
      {me && <MeMarker>(me)</MeMarker>}
      {children}
    </PlayerNameContainer>
  );
};

export default PlayerName;
